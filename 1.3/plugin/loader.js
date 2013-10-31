/**
 * @Description:    Loader
 * @Author:         dafeng.xdf[at]taobao.com zhuofeng.ls[at]taobao.com
 * @Date:           2013.03.05
 *
 * @Log:
 *    - 2013.07.03 zhuofeng.ls
 *      1.[!] fill loader detail functions.
 *
 *    - 2013.03.05 dafeng.xdf
 *      1.[+] build this file.
 */
KISSY.add(function (S,Util) {
    'use strict';
    var D = S.DOM, E = S.Event, win = window,

        SCROLL_TIMER = 50;
    /**
     * @name Loader
     * @class 加载器
     * @constructor
     */
    function Loader(cfg) {
        if (!(this instanceof Loader)) {
            return new Loader(cfg);
        }

        this._makeCfg(cfg);
    }

    /**
     * 启用插件便开始解析
     */
    S.augment(Loader, S.EventTarget, {
        /**
         * loader插件初始化
         * @public 供宿主对象在插件初始化时调用
         * @param owner Base对象（即插件宿主对象）
         */
        init: function (owner) {

            this.owner = owner;

            this.__bindMethods();

            this._reset();

        },
        /**
         * 状态及绑定重置
         * @private
         */
        _reset: function(){
            var self = this,
                userCfg = self.config,
                mod = userCfg.mod;

            self.__started = self.__destroyed = self.__stopped = 0;

            if (mod === 'manual') { // 手动触发模式 | 这种情况多是用户自定义load触发条件，如点击更多按钮时触发
                // nothing to do

            } else { // 自动触发模式

                self.__onScroll(); // 初始化时立即检测一次，但是要等初始化 adjust 完成后.

                self.start();
            }
        },
        /**
         * 用户配置修正
         * @param cfg
         * @private
         */
        _makeCfg: function(cfg){
            cfg = {
                load: typeof cfg.load == 'function' ? cfg.load : function (success, end) {
                    S.log('AutoResponsive.Loader::_makeCfg: the load function in user\'s config is undefined!', 'warn');
                },
                diff: cfg.diff || 0,  // 数据砖块预载高度
                mod: cfg.mod == 'manual' ? 'manual' : 'auto',  // load触发模式
                qpt: 15 // 每次渲染处理的最大单元数量，如15表示每次最多渲染15个数据砖块，多出来的部分下个时间片再处理
            };

            this.config = cfg;
        },
        /**
         * 暴露成外部接口，主要目的是让使用者可以动态改变loader某些配置（如mod），而不需要重新实例化
         * 修改的配置会立即生效
         * @param cfg
         */
        changeCfg: function(cfg){
            this.stop(); // 终止原来的loader
            this._makeCfg(S.merge(this.config, cfg)); // 重新配置
            this._reset(); // 状态及事件重置
        },
        /**
         * 在自动触发模式下，监测屏幕滚动位置是否满足触发load数据的条件
         * @private
         */
        __doScroll: function (e) {
            var self = this,
                owner = self.owner,
                userCfg = self.config;

            if(self.__scrollDirection === 'up')
                return;

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

            var offsetTop = D.offset(container).top,
                diff = userCfg.diff,
                minColHeight = owner.getMinColHeight(),
                scrollTop = D.scrollTop(win),
                height = D.height(win);

            // 动态加载 | 低于预加载线(或被用户看到了)时触发加载
            if (diff + scrollTop + height >= offsetTop + minColHeight) {
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

            if (self.__stopped) {
                S.log('AutoResponsive.Loader::load: this loader has stopped, please to resume!', 'warn');
                return;
            }

            S.log('AutoResponsive.Loader::loading...');

            self.__loading = 1;

            load && load(success, end);

            function success(items, callback) {
                self.__addItems(items, function () {

                    callback && callback.call(self);

                    self.__doScroll(); // 加载完不够一屏再次检测
                });

                self.__loading = 0;
            }

            function end() {
                self.stop();
            }
        },
        isLoading: function () {
            return this.__loading;
        },
        isStarted: function () {
            return this.__started;
        },
        isStopped: function () {
            return this.__stopped;
        },
        isDestroyed: function () {
            return this.__destroyed;
        },
        /**
         * 将指定函数（__appendItems）封装到时间片函数中
         * @private
         * @param items
         * @param callback
         * @returns {*}
         */
        __addItems: function (items, callback) {
            var self = this;

            // 创建一个新的时间片管理器（旧的如果任务还没处理完还会继续处理，直到处理完毕自动销毁）
            Util.timedChunk(items, self.__appendItems, self,function () {

                callback && callback.call(self);

                // TODO revise...
                self.fire('autoresponsive.loader.complete', {
                    items: items
                });
            }).start();

        },
        /**
         * 向容器中插入新节点
         * @private
         * @param items
         */
        __appendItems: function (items) {
            var self = this,
                owner = self.owner;

            items = S.makeArray(items);
            owner.append(items);
        },
        /**
         * 挂载一次，终身受用：
         * 1.为Base对象挂载getMaxColHeight、getMinColHeight方法;
         * 2.为Loader对象挂载__onScroll、__onMouseWheel私有方法
         * @private
         */
        __bindMethods: function () {
            var self = this,
                owner = self.owner,
                curMinMaxColHeight = {min: 0, max: 0};
            owner.on('afterLocate', function (e) {
                curMinMaxColHeight = e.autoResponsive.curMinMaxColHeight;
            });
            owner.getMaxColHeight = function () {
                return curMinMaxColHeight.max;
            };
            owner.getMinColHeight = function () {
                return curMinMaxColHeight.min;
            };

            self.__onScroll = Util.debounce(self.__doScroll, SCROLL_TIMER, self, true); // 建议不要使用Kissy.buffer，否则感觉loader太不灵敏了
            self.__onMouseWheel = function (e) {
                self.__scrollDirection = e.deltaY > 0 ? 'up' : 'down';
            };
        },
        /**
         * 启动loader数据load功能
         * @public
         */
        start: function () {
            E.on(win, 'mousewheel', this.__onMouseWheel);
            this.resume();
        },
        /**
         * 停止loader数据load功能
         * @public
         */
        stop: function () {
            this.pause();
            E.detach(win, 'scroll', this.__onMouseWheel);
            this.__stopped = 1;
        },
        /**
         * 暂停loader数据load功能
         * @public
         */
        pause: function () {
            if (this.__destroyed)
                return;

            E.detach(win, 'scroll', this.__onScroll);
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
            E.on(win, 'scroll', self.__onScroll);
            self.__started = 1;
            self.__stopped = 0;
        },
        /**
         * 停止loader所有工作，销毁loader对象
         * @deprecated 该功能暂时未完善
         * @public
         */
        destroy: function () {
            // TODO ...
            this.__destroyed = 1;
        }
//        Status: {INIT: 0, LOADING: 1, LOADED: 2, ERROR: 3, ATTACHED: 4}
    });
    return Loader;

}, {requires: ['../util','dom', 'event']});
