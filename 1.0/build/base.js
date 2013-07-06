/*
combined files : 

gallery/autoResponsive/1.0/config
gallery/autoResponsive/1.0/anim
gallery/autoResponsive/1.0/linkedlist
gallery/autoResponsive/1.0/gridsort
gallery/autoResponsive/1.0/base

*/
/**
 * @Description:    网页自适应布局全局配置模块
 * @Author:         dafeng.xdf[at]taobao.com
 * @Date:           2013.3.5
 */
KISSY.add('gallery/autoResponsive/1.0/config', function () {
    'use strict';
    var EMPTY = '';

    /**
     * @name Config
     * @param {String}  container            外层容器
     * @param {String}  selector             单元选择器
     * @param {String}  filter               单元过滤器
     * @param {String}  fixedSelector        [*]占位选择器
     * @param {String}  priority             优先选择器
     * @param {Number}  gridWidth            最小栅格单元宽度<code>px</code>
     * @param {Object}  unitMargin           单元格外边距<code>px</code>
     * @param {Boolean} closeAnim            是否关闭动画（默认开启）
     * @param {Number}  duration             补间动画时间
     * @param {String}  easing               补间动画算子
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
     */
    function Config() {
        return {
            container: {value: EMPTY},
            selector: {value: EMPTY},
            filter: {value: EMPTY},
            fixedSelector: {value: EMPTY},
            priority: {value: EMPTY},
            gridWidth: {value: 10},
            unitMargin: {value: {x: 0, y: 0}},
            closeAnim: {value: false},
            duration: {value: 1},
            easing: {value: 'easeNone'},
            direction: {value: 'left'},
            random: {value: false},
            sortBy: {value: EMPTY},
            autoHeight: {value: true},
            closeResize: {value: false},
            autoInit: {value: true},
            plugins: {value: []},
            suspend: {value: true},
            cache: {value: false},
            resizeFrequency: {value: 200},
            whensRecountUnitWH: {value: []}
        };
    }
    return Config;
});
/**
 * @Description: 兼容css3和低版本浏览器动画效果
 * @Author:      dafeng.xdf[at]taobao.com
 * @Date:        2013.3.5
 */
KISSY.add('gallery/autoResponsive/1.0/anim', function (S) {
    'use strict';
    var D = S.DOM, Anim = S.Anim, BLANK = ' ',
        letIE10 = S.UA.ie < 11;

    /**
     * @name AutoAnim
     * @class css动画，采用帧重复
     * @constructor
     */
    function AutoAnim(cfg) {
        var self = this;
        self.cfg = cfg;
        self._init();
    }

    S.augment(AutoAnim, {
        _init: function () {
            var self = this,
                cfg = self.cfg;
            if (cfg.closeAnim) {
                self.noneAnim();
                return;
            }
            letIE10 || cfg.direction == 'right' ? self.fixedAnim() : self.css3Anim();
        },
        /**
         * css3动画
         */
        cssPrefixes: function (styleKey, styleValue) {
            var fixedRule = {};
            S.each('-webkit- -moz- -o- -ms-  '.split(BLANK), function (i) {
                fixedRule[i + styleKey] = styleValue;
            });
            return fixedRule;
        },
        css3Anim: function () {
            /**
             * css3效果代码添加
             */
            var self = this,
                cfg = self.cfg;
            D.css(cfg.elm, S.merge(
                self.cssPrefixes('transform', 'translate(' + cfg.x + 'px,' + cfg.y + 'px) '),
                self.cssPrefixes('transition-duration', cfg.duration + 's'))
            );
            /**
             * 单元素计算排序后触发
             */
            cfg.owner.fire('afterUnitSort', {
                autoResponsive: {
                    elm: cfg.elm,
                    position: {
                        x: cfg.x,
                        y: cfg.y
                    },
                    frame: cfg.owner.frame
                }
            });
        },
        /**
         * 降级模拟css3动画
         */
        fixedAnim: function () {
            var self = this,
                cfg = self.cfg,
                cssRules = {'top': cfg.y},
                direction = 'left';
            if (cfg.direction == 'right') {
                direction = 'right';
            }
            cssRules[direction] = cfg.x;
            new Anim(cfg.elm, cssRules, cfg.duration, cfg.easing, function () {
                /**
                 * 单元素计算排序后触发
                 */
                cfg.owner.fire('afterUnitSort', {
                    autoResponsive: {
                        elm: cfg.elm,
                        position: {
                            x: cfg.x,
                            y: cfg.y
                        },
                        frame: cfg.owner.frame
                    }
                });
            }).run();
        },
        /**
         * 无动画
         */
        noneAnim: function () {
            var self = this,
                cfg = self.cfg;
            D.css(cfg.elm, {
                left: cfg.x,
                top: cfg.y
            });
            /**
             * 单元素计算排序后触发
             */
            cfg.owner.fire('afterUnitSort', {
                autoResponsive: {
                    elm: cfg.elm,
                    position: {
                        x: cfg.x,
                        y: cfg.y
                    },
                    frame: cfg.owner.frame
                }
            });
        }
    });
    return AutoAnim;
}, {requires: ['dom', 'anim']});

/**
 * @Description: 集成一个双向链表方便操作
 * @Author:      dafeng.xdf[at]taobao.com
 * @Date:        2013.3.5
 */
KISSY.add('gallery/autoResponsive/1.0/linkedlist', function (S) {
    'use strict';
    /**
     * @name LinkedList
     * @class 双向更新链表
     * @constructor
     */
    function LinkedList(cfg) {
        var self = this;
        self.length = 0;
        self.head = null;
        self.tail = null;
        self.type = cfg.type || true;
        self.query = [];
        self.init();
    }

    S.augment(LinkedList, {
        /**
         * 初始化，增加随机序列
         */
        init: function () {
            S.augment(Array, {
                shuffle: function () {
                    for (var j, x, i = this.length;
                         i;
                         j = parseInt(Math.random() * i), x = this[--i], this[i] = this[j], this[j] = x);
                    return this;
                }
            });
        },
        /**
         * 新增节点
         */
        add: function (value) {
            var self = this;
            if (self.type) {
                self.query.push(value);
                return;
            }
            var node = {
                value: value,
                next: null,//前驱
                prev: null//后继
            };
            if (self.length == 0) {
                self.head = self.tail = node;
            } else {
                self.tail.next = node;
                node.prev = self.tail;
                self.tail = node;
            }
            self.length++;
        },
        /**
         * 删除节点
         */
        remove: function (index) {
            var self = this;
            if (index > self.length - 1 || index < 0) {
                return null;
            }
            var node = self.head,
                i = 0;
            if (index == 0) {
                self.head = node.next;
                if (self.head == null) {
                    self.tail = null;
                }
                else {
                    self.head.previous = null;
                }
            }
            else if (index == self.length - 1) {
                node = self.tail;
                self.tail = node.prev;
                self.tail.next = null;
            }
            else {
                while (i++ < index) {
                    node = node.next;
                }
                node.prev.next = node.next;
                node.next.prev = node.prev;
            }
            self.length--;
        },
        /**
         * 获取链表值
         */
        get: function (index) {
            var self = this;
            if (self.type) {
                return self.query[index];
            }
            return self.node(index).value;
        },
        /**
         * 返回链表节点
         */
        node: function (index) {
            var self = this;
            if (index > self.length - 1 || index < 0) {
                return null;
            }
            var node = self.head,
                i = 0;
            while (i++ < index) {
                node = node.next;
            }
            return node;
        },
        /**
         * 更新节点值
         */
        update: function (index, value) {
            var self = this;
            if (self.type) {
                self.query[index] = value;
                return;
            }
            self.node(index).value = value;
        }
    });
    return LinkedList;
});
/**
 * @Description:    计算排序
 * @Author:         dafeng.xdf[at]taobao.com
 * @Date:           2013.3.5
 * @Todo:           gridSort
 */
KISSY.add('gallery/autoResponsive/1.0/gridsort', function (S, AutoAnim, LinkedList) {
    'use strict';
    var D = S.DOM, EMPTY = '';

    /**
     * @name GridSort
     * @class 栅格布局算法
     */
    function GridSort() {
    }

    S.augment(GridSort, {
        init: function (cfg, owner) {
            var self = this;
                self.cfg = cfg;
                cfg.owner = owner;
                cfg.owner.doneQuery = [];

            var items = S.query(cfg.selector, cfg.container);
            switch (cfg.sortBy) {
                case EMPTY:
                case 'grid':
                default:
                    self._gridSort(items);
                    break;
                case 'cell':
                    self._cellSort(items);
                    break;
            }
        },
        _filter: function (elm) {
            var self = this,
                cfg = self.cfg;
            if (cfg.filter == EMPTY) {
                return;
            }
            D.show(elm);
            if (D.hasClass(elm, cfg.filter)) {
                D.hide(elm);
                return true;
            }
        },
        coordinate: function (curQuery, elm) {
            var cfg = this.cfg,
                isRecountUnitWH = cfg.isRecountUnitWH;

            if (isRecountUnitWH || !elm.__width) {
                elm.__width = D.outerWidth(elm);
                elm.__height = D.outerHeight(elm);
            }

            return this._autoFit(curQuery, elm.__width, elm.__height);
        },
        callAnim: function (elm, coordinate) {
            var self = this,
                cfg = self.cfg;
            new AutoAnim({
                elm: elm,
                x: coordinate[0],
                y: coordinate[1],
                closeAnim: cfg.closeAnim,
                duration: cfg.duration,
                easing: cfg.easing,
                direction: cfg.direction,
                frame: cfg.owner.frame,
                owner: cfg.owner
            });
        },
        _cache: function (elm) {
            var self = this, isCache = false,
                cfg = self.cfg;
            if (cfg.priority == EMPTY) {
                return  isCache;
            }
            if (!cfg.cacheQuery) {
                cfg.cacheQuery = [];
            }
            if (!D.hasClass(elm, cfg.priority)) {
                isCache = true;
                cfg.cacheQuery.push(elm);
            }
            return isCache;
        },
        /**
         * 清除缓存
         * 记录全局缓存
         */
        clearCache: function (curQuery, _items) {
            var self = this,
                cfg = self.cfg;
            if (cfg.cacheQuery) {
                cfg.cacheQuery = [];
            }
            cfg.owner.curQuery = curQuery;
            cfg.owner.itemsLen = _items.length;
        },
        asyncize: function (handle) {
            var self = this,
                cfg = self.cfg;
            if (cfg.owner.get('suspend')) {
                setTimeout(function () {
                    handle.call(self);
                }, 0);
            } else {
                handle.call(self);
            }
        },
        _render: function (curQuery, item) {
            var self = this,
                cfg = self.cfg;
            /**
             * 遍历单个元素之前触发
             */
            cfg.owner.fire('beforeUnitSort', {
                autoResponsive: {
                    elm: item,
                    frame: cfg.owner.frame
                }
            });
            var coordinate = self.coordinate(curQuery, item),
                height = coordinate[1] + item.__height;
            if ((self._maxHeight || 0) < height) {
                self._maxHeight = height;
            }
            /**
             * 调用动画
             */
            self.asyncize(function () {
                self.callAnim(item, coordinate);
            });
        },
        _gridSort: function (items) {
            var self = this,
                cfg = self.cfg,
                curQuery = self._getCols();
            /**
             * 设置关键帧
             */
            self._setFrame();
            if (cfg.random) {
                items = items.shuffle();
            }
            /**
             * 排序之前触发beforeSort
             */
            cfg.owner.fire('beforeSort', {
                autoResponsive: {
                    elms: items
                }
            });
            S.each(items, function (v, k) {
                if (cfg.cache && k < cfg.owner.itemsLen) {
                    return;
                }
                if (self._filter(v)) {
                    return;
                }
                if (self._cache(v)) {
                    return;
                }
                self._render(curQuery, v);
            });
            S.each(cfg.cacheQuery, function (v) {
                self._render(curQuery, v);
            });
            /**
             * 清空缓存队列
             */
            self.clearCache(curQuery, items);
            /**
             * 排序之后触发
             */
            cfg.owner.fire('afterSort', {
                autoResponsive: {
                    elms: items,
                    curMinMaxColHeight: self._getMinMaxColHeight(),
                    frame: cfg.owner.frame
                }
            });
            self.setHeight();
        },
        _getMinMaxColHeight: function () {
            var self = this,
                cfg = self.cfg,
                _min = Infinity,
                doneQuery = cfg.owner.doneQuery;
            for (var i = 0; i < doneQuery.length; i++) {
                if (doneQuery[i] != 0 && doneQuery[i] < _min) {
                    _min = doneQuery[i];
                }
            }
            return {
                min: _min,
                max: Math.max.apply(Math, doneQuery)
            };
        },
        _setFrame: function () {
            var self = this;
            self.cfg.owner.frame++;
        },
        /**
         * @deprecated 该功能暂时未完善
         *
         * @param items
         * @private
         */
        _cellSort: function (items) {
            var self = this,
                _maxHeight = 0,
                _row = 0,
                curQuery = [];
            S.each(items, function (i, key) {
                S.log('star from here!');
                curQuery.push(self._getCells());
                //self.callAnim(i,coordinate);
            });
        },
        _getCells: function () {
            return this._getCols();
        },
        _getCols: function () {
            var self = this,
                cfg = self.cfg;
            if (cfg.owner.curQuery && cfg.cache) {
                return cfg.owner.curQuery;
            } else {
                var curQuery = new LinkedList({});
                for (var i = 0, span = Math.ceil(D.outerWidth(cfg.container) / cfg.gridWidth); i < span; i++) {
                    curQuery.add(0);
                }
                return curQuery;
            }
        },
        /**
         * 获取当前指针
         */
        _getCur: function (_num, curQuery) {
            var cur = [null, Infinity],
                _curQuery = curQuery.query.length ? curQuery.query : curQuery;

            for (var i = 0, len = _curQuery.length; i < len - _num; i++) {
                var max = 0;

                for (var j = i; j < i + _num; j++) {
                    if (curQuery.get(j) > max) {
                        max = curQuery.get(j);
                    }
                }
                if (cur[1] > max) {
                    cur = [i, max];
                }
            }
            return cur;
        },
        /**
         * 返回x，y轴坐标
         */
        _autoFit: function (curQuery, cW, cH) {
            var self = this,
                cfg = self.cfg,
                _num = Math.ceil((cW + cfg.unitMargin.x) / cfg.gridWidth),
                cur = self._getCur(_num, curQuery);
            for (var i = cur[0]; i < _num + cur[0]; i++) {
                curQuery.update(i, cur[1] + cH + cfg.unitMargin.y);
            }
            cfg.owner.doneQuery = curQuery.query;
            return [cur[0] * cfg.gridWidth + cfg.unitMargin.x, cur[1] + cfg.unitMargin.y];
        },
        /**
         * 设置容器高度
         */
        setHeight: function () {
            var self = this,
                cfg = self.cfg;
            if (!cfg.autoHeight) {
                return;
            }
            D.height(cfg.container, (self._maxHeight || 0) + cfg.unitMargin.y);
        }
    });
    return GridSort;
}, {requires: ['./anim', './linkedlist', 'dom']});
/**
 * @Description:    网页自适应布局Base
 * @Author:         dafeng.xdf[at]taobao.com
 * @Date:           2013.3.5
 */
KISSY.add('gallery/autoResponsive/1.0/base', function (S, Config, GridSort, Base) {
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

