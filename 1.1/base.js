/**
 * @Description:    网页自适应布局Base
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
        var self = this;
        AutoResponsive.superclass.constructor.apply(self, arguments);
        if (!S.get(self.get('container'))) {
            S.log('can not init, lack of container!');
            return;
        }
        self.fire('beforeInit', {
            autoResponsive: self
        });
        if (self.get('autoInit')) {
            self.init();
        }
        self.fire('afterInit', {
            autoResponsive: self
        });
    }

    S.extend(AutoResponsive, Base, {
        /**
         * 初始化组件
         * @return  排序实例
         */
        init: function () {
            var self = this;
            self._bindEvent();
            self.initPlugin();
            self.render();
            S.log('init!');
        },
        initPlugin: function () {
            var self = this;
            self.api = {};
            /**
             * 添加插件
             */
            S.each(self.get('plugins'), function (i) {
                i.init(self);
                S.mix(self.api, i.api);
            });
        },
        /**
         * 渲染排序结果
         */
        render: function () {
            var self = this,
                userCfg = self.getAttrVals();
            self.frame = self.frame || 0;
            arguments[0] && S.each(arguments[0], function (i, _key) {
                userCfg[_key] = i;
            });
            /**
             * 应用插件属性
             */
            S.mix(userCfg, self.api);
            self.gridSort = self.gridSort || new GridSort();
            self.gridSort.init(userCfg, self);
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
            E.on(win, 'resize', function (e) {
                handle.call(self, {isRecountUnitWH: S.inArray('resize', whensRecountUnitWH)});
            });
        },
        /**
         * 添加事件节流阀
         */
        _bindEvent: function () {
            var self = this;
            self._bind(S.buffer(function () {   // 使用buffer，不要使用throttle
                self.render(arguments);
                /**
                 * 浏览器改变触发resize事件
                 */
                self.fire('resize');
            }, self.get('resizeFrequency'), self));
        },
        /**
         * 重新布局调整
         */
        adjust: function (isRecountUnitWH) {
            var self = this, whensRecountUnitWH = self.get('whensRecountUnitWH');
            self.__isAdjusting = 1;
            self.render({
                isRecountUnitWH: isRecountUnitWH || S.inArray('adjust', whensRecountUnitWH)
            });
            self.__isAdjusting = 0;
        },
        isAdjusting: function () {
            return this.__isAdjusting || 0;
        },
        /**
         * 优先排序方法
         * @param {String} 选择器
         */
        priority: function (selector) {
            var self = this;
            self.render({
                priority: selector
            });
        },
        /**
         * 过滤方法
         * @param {String} 选择器
         */
        filter: function (selector) {
            var self = this;
            self.render({
                filter: selector
            });
        },
        /**
         * 调整边距
         * @param {Object} 边距
         */
        margin: function (margin) {
            var self = this;
            self.render({
                unitMargin: margin
            });
        },
        /**
         * 方向设置
         * @param {String} 方向
         */
        direction: function (direction) {
            var self = this;
            self.render({
                direction: direction
            });
        },
        /**
         * 随机排序
         */
        random: function () {
            var self = this;
            self.render({
                random: true
            });
        },
        /**
         * 改变组件设置
         * @param {Object} 设置对象
         */
        option: function (option) {
            var self = this;
            self.render(option);
        },
        /**
         * append 方法,调用跟随队列优化性能
         * @param {Object} 节点对象（可以为单个元素、多个元素数组、fragments，以及混合数组）
         */
        append: function (nodes) {
            var self = this;
            D.append(nodes, self.get('container'));
            self.render({
                cache: true
            });
        },
        /**
         * dom prepend 方法,耗费性能
         * @param {Object} 节点对象（可以为单个元素、多个元素数组、fragments，以及混合数组）
         */
        prepend: function (nodes) {
            var self = this;
            D.prepend(nodes, self.get('container'));
            self.render();
        }
    }, { ATTRS: new Config()});
    return AutoResponsive;
}, {requires: ['./config', './gridsort', 'base', 'dom', 'event']});
