/**
 * @Description:    网页自适应布局Base 1.2
 * @Author:         dafeng.xdf[at]taobao.com
 * @Date:           2013.3.5
 */
KISSY.add(function (S, Config, GridSort, Base) {
    'use strict';
    var D = S.DOM, E = S.Event, win = window;

    /**
     * @name AutoResponsive
     * @class 网页自适应布局
     * @constructor
     * @extends Base
     */
    function AutoResponsive() {
        AutoResponsive.superclass.constructor.apply(this, arguments);

        if (!S.get(this.get('container'))) {
            S.log('can not init, lack of container!');
            return;
        }

        this.fire('beforeInit', {
            autoResponsive: this
        });

        if (this.get('autoInit')) {
            this.init();
        }

        this.fire('afterInit', {
            autoResponsive: this
        });
    }

    S.extend(AutoResponsive, Base, {
        /**
         * 初始化组件
         * @return  排序实例
         */
        init: function () {
            this._bindEvent();
            this.initPlugins();
            this.render();
            S.log('AutoResponsive init!');
        },
        /**
         * 初始插件
         */
        initPlugins: function () {
            for (var i = 0, a = this.get('plugins'), len = a.length, v; i < len; i++) {
                v = a[i];
                v.init(this);
            }
        },
        /**
         * 渲染排序结果
         */
        render: function () {
            var userCfg = this.getAttrVals(),
                whensRecountUnitWH = this.get('whensRecountUnitWH');
            userCfg.isRecountUnitWH = !!whensRecountUnitWH.length;
            this.frame = this.frame || 0;
            arguments[0] && S.each(arguments[0], function (i, _key) {
                userCfg[_key] = i;
            });

            this.gridSort = this.gridSort || new GridSort();
            this.gridSort.init(userCfg, this);
        },
        /**
         * 绑定浏览器resize事件
         */
        _bind: function (handle) {
            var self = this,
                whensRecountUnitWH = self.get('whensRecountUnitWH');
            if (self.get('closeResize')) {
                return;
            }
            E.on(win, 'resize', function () {
                handle.call(self, {isRecountUnitWH: S.inArray('resize', whensRecountUnitWH)});
            });
        },
        /**
         * 添加事件节流阀
         */
        _bindEvent: function () {
            var self = this;
            self._bind(S.buffer(function () {   // 使用buffer，不要使用throttle
                var delayOnResize = self.get('delayOnResize');
                self.fire('beforeResize');
                if(delayOnResize !== -1){
                    setTimeout(function(){
                        self.render(arguments);
                    },delayOnResize);
                }else{
                    self.render(arguments);
                }
                self.fire('resize'); // 浏览器改变触发resize事件
            }, self.get('resizeFrequency'), self));
        },
        /**
         * 重新布局调整
         */
        adjust: function (isRecountUnitWH) {
            var whensRecountUnitWH = this.get('whensRecountUnitWH');
            this.__isAdjusting = 1;
            this.render({
                isRecountUnitWH: isRecountUnitWH || S.inArray('adjust', whensRecountUnitWH)
            });
            this.__isAdjusting = 0;
            S.log('adjust success');
        },
        isAdjusting: function () {
            return this.__isAdjusting || 0;
        },
        /**
         * 优先排序方法
         * @param {String} 选择器
         */
        priority: function (selector) {
            this.render({
                priority: selector
            });
        },
        /**
         * 过滤方法
         * @param {String} 选择器
         */
        filter: function (selector) {
            this.render({
                filter: selector
            });
        },
        /**
         * 调整边距
         * @param {Object} 边距
         */
        margin: function (margin) {
            this.render({
                unitMargin: margin
            });
        },
        /**
         * 方向设置
         * @param {String} 方向
         */
        direction: function (direction) {
            this.render({
                direction: direction
            });
        },
        /**
         * 随机排序
         */
        random: function () {
            this.render({
                random: true
            });
        },
        /**
         * 改变组件设置
         * @param {Object} 设置对象
         */
        changeCfg: function (cfg) {
            var self = this;
            S.each(cfg,function(i,key){
                self.set(key,i);
            });
        },
        /**
         * append 方法,调用跟随队列优化性能
         * @param {Object} 节点对象（可以为单个元素、多个元素数组、fragments，以及混合数组）
         */
        append: function (nodes) {
            D.append(nodes, this.get('container'));
            this.render({
                cache: true
            });
        },
        /**
         * dom prepend 方法,耗费性能
         * @param {Object} 节点对象（可以为单个元素、多个元素数组、fragments，以及混合数组）
         */
        prepend: function (nodes) {
            D.prepend(nodes, this.get('container'));
            this.render();
        }
    }, { ATTRS: new Config()});

    return AutoResponsive;

}, {requires: ['./config', './gridsort', 'base', 'dom', 'event']});