/**
 * @Description:    网页自适应布局Base 1.2
 * @Author:         dafeng.xdf[at]taobao.com
 * @Date:           2013.3.5
 */
KISSY.add(function (S, GridSort, Base) {
    'use strict';
    var D = S.DOM, E = S.Event,
        win = window,
        EMPTY = '',
        config = {
            /* @name Config
             * @param {String}  container            外层容器
             * @param {String}  selector             单元选择器
             * @param {String}  filter               单元过滤器
             * @param {String}  fixedSelector        [*]占位选择器
             * @param {String}  priority             优先选择器
             * @param {Number}  gridWidth            最小栅格单元宽度<code>px</code>
             * @param {Object}  unitMargin           单元格外边距<code>px</code>
             * @param {Boolean} closeAnim            是否关闭动画（默认开启）
             * @param {Number}  duration             补间动画时间，此项只针对IE系列生效
             * @param {String}  easing               补间动画算子，此项只针对IE系列生效
             * @param {String}  direction            排序起始方向（可选值：<code>'right'</code>）
             * @param {Boolean} random               随机排序开关（默认关闭）
             * @param {String}  sortBy               排序算法（可选值：<code>'grid'</code>或<code>'cell'</code>，默认为<code>'grid'</code>）
             * @param {Boolean} autoHeight           容器高度自适应开关（默认为true）
             * @param {Boolean} suspend              渲染任务队列是否支持挂起（挂起时主动将执行交给UI线程 | 默认为true）
             * @param {Array}   plugins              插件队列
             * @param {Boolean} autoInit             是否自动初始化（默认为true）
             * @param {Boolean} closeResize          是否关闭resize绑定（默认不关闭）
             * @param {Number}  resizeFrequency      resize触发频率
             * @param {Array}   whensRecountUnitWH   重新计算单元宽高的行为时刻（可选值：<code>'closeResize', 'adjust'</code>）
             * @param {Number}  delayOnResize        resize时延迟渲染，主要是解决css3动画对页面节点属性更新不及时导致的渲染时依赖的数据不准确问题[临时解决办法]
             * @param {Boolean} landscapeOrientation 布局方向设置为横向，默认为false，竖向
             * @param {String}  exclude              排除设置
             * @param {String}  animType             提供css3动画'css3Anim'（针对高级浏览器），和普通模拟动画'fixedAnim'（针对低版本浏览器）两种选项，可以强制指定
             */
            container: {
                value: EMPTY
            },

            selector: {
                value: EMPTY
            },

            filter: {
                value: EMPTY
            },
            fixedSelector: {
                value: EMPTY
            },
            priority: {
                value: EMPTY
            },
            gridWidth: {
                value: 10
            },
            unitMargin: {
                value: {
                    x: 0, y: 0
                }
            },
            closeAnim: {
                value: false
            },
            duration: {
                value: 1}
            ,
            easing: {
                value: 'easeNone'
            },
            direction: {
                value: 'left'
            },
            random: {
                value: false
            },
            sortBy: {
                value: EMPTY
            },
            autoHeight: {
                value: true
            },
            closeResize: {
                value: false
            },
            autoInit: {
                value: true
            },
            plugins: {
                value: []
            },
            suspend: {
                value: true
            },
            cache: {
                value: false
            },
            resizeFrequency: {
                value: 200
            },
            whensRecountUnitWH: {
                value: []
            },
            delayOnResize: {
                value: -1
            },
            landscapeOrientation: {
                value:false}
            ,
            exclude:{
                value:EMPTY
            },
            animType:{
                value:EMPTY
            }
        };
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
    }, { ATTRS: config });

    return AutoResponsive;

}, {requires: ['./gridsort', 'base', 'dom', 'event']});
