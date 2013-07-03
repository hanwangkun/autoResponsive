/*
combined files : 

autoResponsive/1.0/plugin/loader

*/
/**
 * @Description:    Loader
 * @Author:         dafeng.xdf[at]taobao.com zhuofeng.ls@taobao.com
 * @Date:           2013.03.05
 *
 * @Log:
 *    - 2013.07.03 zhuofeng.ls
 *      1.[!] fill loader detail functions.
 *
 *    - 2013.03.05 dafeng.xdf
 *      1.[+] build this file.
 */
KISSY.add('autoResponsive/1.0/plugin/loader', function (S) {
    'use strict';
    var $ = S.all, win = window, $win = $(win),

        SCROLL_TIMER = 50;

    /**
     * @name Loader
     * @class 加载器
     * @constructor
     */
    function Loader(cfg) {
        var self = this;

        // 用户配置修正
        cfg = {
//            onabort: function () {
//            },
//            onerror: function () {
//            },
//            ondisplay: function () {
//            },
//            onloadstart: function () {
//            },
//            onloadend: function () {
//            },
//            onload: function () {
//            },
//            ontimeout: function () {
//            },
//            onrender: function () {
//            },
            load: typeof cfg.load == 'function' ? cfg.load : function (success, end) {
                S.log('AutoResponsive.Loader::constructor: the load function in user\'s config is undefined!', 'warn');
            },
            diff: cfg.diff || 0,  // 数据砖块预载高度
            mod: cfg.mod == 'manual' ? 'manual' : 'auto'  // load触发模式
        };

        self.config = cfg;
    }

    /**
     * 启用插件便开始解析
     */
    S.augment(Loader, S.EventTarget, {
        /**
         * loader插件初始化
         * @public 供宿主对象在插件初始化时调用
         * @param _self Base对象（即插件宿主对象）
         */
        init: function (_self) {
            var self = this,
                userCfg = self.config,
                mod = userCfg.mod;

            self._self = _self;

            self.__bindMethods();

            if (mod === 'manual') { // 手动触发模式 | 这种情况多是用户自定义load触发条件，如点击更多按钮时触发
                // nothing to do

            } else { // 自动触发模式

                self.__onScroll = S.buffer(self.__doScroll, SCROLL_TIMER, self);
                // 初始化时立即检测一次，但是要等初始化 adjust 完成后.
                self.__onScroll();

                self.start();
            }

        },
        /**
         * 在自动触发模式下，监测屏幕滚动位置是否满足触发load数据的条件
         * @private
         */
        __doScroll: function () {
            var self = this,
                owner = self._self,
                userCfg = self.config;
            S.log('AutoResponsive.Loader::__doScroll...');
            if (self.__loading) {
                return;
            }
            // 如果正在调整中，等会再看；
            // 调整中的高度不确定，现在不适合判断是否到了加载新数据的条件
            if (owner.isAdjusting()) {
                // 恰好 __onScroll 是 buffered
                self.__onScroll();
                return;
            }

            var container = S.get(owner.get('container'));
            // in case that the container's current style is 'display: none'
            if (!container.offsetWidth) {
                return;
            }

            var offsetTop = container.offset().top,
                diff = userCfg.diff,
                minColHeight = owner.getMinColHeight();

            // 动态加载 | 低于预加载线(或被用户看到了)时触发加载
            if (diff + $win.scrollTop() + $win.height() >= offsetTop + minColHeight) {
                self.load();
            }
        },
        /**
         * 使用用户自定义load函数对数据进行loading
         * @public 在手动模式时可以供外部调用
         */
        load: function () {
            var self = this,
                userCfg = self.config,
                load = userCfg.load;

            S.log('AutoResponsive.Loader::loading...');

            self.__loading = 1;

            load && load(success, end);

            function success(items, callback) {
                self.__loading = 0;
                self.__addItems(items, function () {
                    callback && callback.apply(this, arguments);
                    // 加载完不够一屏再次检测
                    self.__doScroll();
                });
            }

            function end() {
                self.stop();
            }
        },
        /**
         * 将指定函数（__appendItems）封装到时间片函数中
         * @private
         * @param items
         * @param callback
         * @returns {*}
         */
        __addItems: function (items, callback) {
            var self = this,
                owner = self._self;

            // 正在调整中，直接这次加，和调整的节点一起处理；
            // 正在加，直接这次加，一起处理
            self._adder = timedChunk(items, __appendItems, self, function () {
                owner.adjust();
                self._adder = 0;
                callback && callback.call(self);

                // TODO revise...
                self.fire('autoresponsive.loader.complete', {
                    items: items
                });
            });

            self._adder.start();

            return self._adder;
        },
        /**
         * 向容器中插入新节点
         * @private
         * @param items
         */
        __appendItems: function (items) {
            var self = this,
                owner = self._self;

            items = S.makeArray(items);
            owner.append(items);
        },
        /**
         * 为Base对象挂载getMaxColHeight、getMinColHeight方法
         * @private
         */
        __bindMethods: function () {
            var self = this,
                owner = self._self,
                curColHeights = [0];
            owner.on('afterSort', function (e) {
                curColHeights = e.autoResponsive.curColHeights;
            });
            owner.getMaxColHeight = function () {
                return Math.max.apply(Math, curColHeights);
            };
            owner.getMinColHeight = function () {
                return Math.min.apply(Math, curColHeights);
            };
        },
        /**
         * 启动loader数据load功能
         * @public
         */
        start: function () {
            this.resume();
        },
        /**
         * 停止loader数据load功能
         * @public
         */
        stop: function () {
            this.pause();
        },
        /**
         * 暂停loader数据load功能
         * @public
         */
        pause: function () {
            if (this.__destroyed)
                return;

            $win.detach('scroll', this.__onScroll);
            this.__onScroll.stop();
        },
        /**
         * 恢复（重新唤醒）loader数据load功能
         * @public
         */
        resume: function () {
            var self = this;
            if (self.__destroyed) {
                return;
            }
            $win.on('scroll', self.__onScroll);
            self.__started = 1;
        },
        /**
         * 停止loader所有工作，销毁loader对象
         * @public
         */
        destroy: function () {
            // TODO ...
            this.__destroyed = 1;
        }
//        Status: {INIT: 0, LOADING: 1, LOADED: 2, ERROR: 3, ATTACHED: 4}
    });

    function timedChunk(items, process, context, callback) {

        var stopper = {}, timer, todo;

        stopper.start = function () {

            todo = [].concat(S.makeArray(items));

            if (todo.length > 0) {
                // 第一次不延迟
                (function () {
                    var start = +new Date;
                    do {
                        var item = todo.shift();
                        process.call(context, item);
                    } while (todo.length > 0 && (new Date - start < 50));

                    if (todo.length > 0) {
                        timer = setTimeout(arguments.callee, 25);
                    } else {
                        callback && callback.call(context, items);
                    }
                })();
            } else {
                callback && callback.call(context, items);
            }
        };

        stopper.stop = function () {
            if (timer) {
                clearTimeout(timer);
                todo = [];
//                items.each(function (item) {
//                    item.stop();
//                });
            }
        };

        return stopper;
    }

    return Loader;

}, {requires: ['event']});
