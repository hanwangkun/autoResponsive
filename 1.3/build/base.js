/*
combined files : 

gallery/autoResponsive/1.3/anim
gallery/autoResponsive/1.3/linkedlist
gallery/autoResponsive/1.3/gridsort
gallery/autoResponsive/1.3/base

*/
/**
 * @Description: 兼容css3和低版本浏览器动画效果
 * @Author:      dafeng.xdf[at]taobao.com
 * @Date:        2013.3.5
 */
KISSY.add('gallery/autoResponsive/1.3/anim',function (S) {
    'use strict';
    var D = S.DOM, Anim = S.Anim,
        letIE10 = S.UA.ie < 11,
        prefixes = ['-webkit-', '-moz-', '-ms-', '-o-', ''],
        animType = letIE10 ? 'fixedAnim' : 'css3Anim';
    /**
     * @name AutoAnim
     * @class css动画，采用帧重复
     * @constructor
     */
    function AutoAnim(cfg) {
        this.cfg = cfg;
        this._init();
    }
    S.augment(AutoAnim, {
        _init: function () {
            this[this.cfg.animType ? this.cfg.animType : animType]();
        },
        /**
         * supply css ua prefix
         */
        cssPrefixes: function (styleKey, styleValue) {
            var fixedRule = {};
            for (var i = 0, len = prefixes.length; i < len; i++) {
                fixedRule[prefixes[i] + styleKey] = styleValue;
            }
            return fixedRule;
        },
        /**
         * css3动画效果
         */
        css3Anim: function () {
            /*
             * css3效果代码添加
             * 为了减少对象读取css3模式去除duration配置，改为css中读取
             */
            var cfg = this.cfg;
            // TODO 优化点：既然css3Anim在循环中，可以考虑将‘cfg.direction !== 'right'’该判断条件在逻辑树上上提，以加快该函数的执行
            D.css(cfg.elm, this.cssPrefixes('transform', 'translate(' + ((cfg.direction !== 'right') ? cfg.x : (cfg.owner.gridSort.containerWH - cfg.elm.__width - cfg.x)) + 'px,' + cfg.y + 'px) '));
            this._fireAfterUnitArrange(cfg);
            S.log('css3 anim success');
        },
        /**
         * 降级模拟css3动画
         */
        fixedAnim: function () {
            var self = this,
                cfg = self.cfg,
                cssRules = {'top': cfg.y};
            if (cfg.closeAnim) {
                this.noneAnim();
                return;
            }
            cssRules[cfg.direction == 'right' ? 'right' : 'left'] = cfg.x;
            new Anim(cfg.elm, cssRules, cfg.duration, cfg.easing, function () {
                self._fireAfterUnitArrange(cfg);
            }).run();
            S.log('kissy anim success');
        },
        /**
         * 无动画
         */
        noneAnim: function () {
            var cfg = this.cfg;
            D.css(cfg.elm, {
                left: cfg.x,
                top: cfg.y
            });
            this._fireAfterUnitArrange(cfg);
            S.log('maybe your anim is closed');
        },
        _fireAfterUnitArrange: function(cfg){
            // 单元排版后触发
            cfg.owner.fire('afterUnitArrange', {
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
KISSY.add('gallery/autoResponsive/1.3/linkedlist',function (S) {
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
        },
        /**
         * 返回query长度
         * @returns {Number}
         */
        size: function(){
            return this.query.length || this.length;
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
KISSY.add('gallery/autoResponsive/1.3/gridsort',function (S, AutoAnim, LinkedList) {
    'use strict';
    var D = S.DOM, EMPTY = '';
    /**
     * @name GridSort
     * @class 栅格布局算法
     */
    function GridSort() {
    }

    GridSort.prototype = {
        init: function (cfg, owner) {
            this.cfg = cfg;
            cfg.owner = owner;
            var items = S.query(cfg.selector, cfg.container);
            switch (cfg.sortBy) {
                case EMPTY:
                case 'grid':
                default:
                    this._gridSort(items);
                    break;
                case 'cell':
                    this._cellSort(items);
                    break;
            }
        },
        _gridSort: function (items) {
            var cfg = this.cfg,
                curQuery = this._getCols();
            // 设置关键帧
            this._setFrame();
            // 定位&排版之前触发
            cfg.owner.fire('beforeLocate beforeArrange', {
                autoResponsive: { // TODO 优化点：既然是给自定义事件传参，没必要再多挂一层 'autoResponsive' key
                    elms: items // TODO items不精准，没有走过actions，所以可能存在被过滤元素，或顺序不正确问题
                }
            });
            var actions = []; // 注意里面的规则顺序
            if(cfg.exclude !== EMPTY){
                actions.push('_exclude');
            }
            if (cfg.filter !== EMPTY) {
                actions.push('_filter');
            }
            if (cfg.priority !== EMPTY) {
                actions.push('_priority');
            }
            var l = actions.length, m = items.length, s = cfg.cache ? cfg.owner._lastPos : 0, count = s, fn = S.noop;
            if (l == 0) { // 没有规则，说明全渲染，那就直接渲染
                // 判断“排版结束”事件是否触发
                cfg.owner.on('afterUnitArrange', fn = function(){
                    if(++count >= m){
                        cfg.owner.detach('afterUnitArrange', fn);
                        count == m && cfg.owner.fire('afterArrange', {
                            autoResponsive: {
                                elms: items,
                                frame: cfg.owner.frame
                            }
                        });
                    }
                });
                for (var i = s; i < m; i++) {
                    this._render(curQuery, items[i]);
                }
            } else { // 有规则，走renderQueue
                var renderQueue = []; // 记录的只是序号
                actions.push('_tail');
                for (var j = s; j < m; j++) {
                    for (var t = 0, r; t < l + 1; t++) {
                        r = this[actions[t]](renderQueue, j, items[j]);
                        // 说明得到明确的插入位置，做插入并停止后面的actions执行
                        if (typeof r === 'number') {
                            renderQueue.splice(r, 0, j);
                            break;
                        }
                        // 没得到明确插入位置，本次就不插入
                        // r为false表示继续向后执行后面的actions
                        // r为true表示停止后面的actions执行
                        else if (typeof r === 'boolean' && r) {
                            break;
                        }
                    }
                }
                count = 0;
                // 判断“排版结束”事件是否触发
                cfg.owner.on('afterUnitArrange', fn = function(){
                    if(++count >= n){
                        cfg.owner.detach('afterUnitArrange', fn);
                        count == n && cfg.owner.fire('afterArrange', {
                            autoResponsive: {
                                elms: items,
                                frame: cfg.owner.frame
                            }
                        });
                    }
                });
                for (var k = 0, n = renderQueue.length; k < n; k++) {
                    this._render(curQuery, items[renderQueue[k]]);
                }
            }
            // 记录一下这次渲染结束的位置(即下一次渲染开始的位置)
            cfg.owner._lastPos = m;
            var curMinMaxColHeight = this._getMinMaxColHeight();
            // 定位之后触发
            cfg.owner.fire('afterLocate', {
                autoResponsive: {
                    elms: items,
                    curMinMaxColHeight: curMinMaxColHeight,
                    frame: cfg.owner.frame
                }
            });
            // 更新容器高度
            this.setHeight(curMinMaxColHeight.max);
        },
        _getCols: function () {
            var cfg = this.cfg;
            this.containerWH = cfg.landscapeOrientation ? D.outerHeight(cfg.container) :D.outerWidth(cfg.container);
            if (cfg.owner.curQuery && cfg.cache) {
                return cfg.owner.curQuery;
            } else {
                var curQuery = new LinkedList({});
                for (var i = 0, span = Math.ceil(this.containerWH / cfg.gridWidth); i < span; i++) {
                    curQuery.add(0);
                }
                return cfg.owner.curQuery = curQuery;
            }
        },
        _setFrame: function () {
            this.cfg.owner.frame++;
        },
        _exclude:function(queue, idx, elm){
            var cfg = this.cfg;
            if(D.hasClass(elm,cfg.exclude)){
                return true;
            }
        },
        _filter: function (queue, idx, elm) {
            var cfg = this.cfg;
            D.show(elm);
            if (D.hasClass(elm, cfg.filter)) {
                D.hide(elm);
                return true; // 停止后面的actions执行，并且不插入
            }
            return false; // 继续执行后面的actions，插入与否由后面的actions决定
        },
        _priority: function (queue, idx, elm) {
            if (typeof queue._priorityInsertPos == 'undefined') {
                queue._priorityInsertPos = 0;
            }
            var cfg = this.cfg;
            if (D.hasClass(elm, cfg.priority)) {
                return queue._priorityInsertPos++; // 找到了队列的插入位置
            }
            return Infinity; // 找到了队列的插入位置，即队列的末尾
        },
        /**
         * 尾部action，只负责把当前的idx压栈，以免丢失
         * @param queue
         * @param idx
         * @param elm
         * @private
         */
        _tail: function (queue, idx, elm) {
            return Infinity; // 找到了队列的插入位置，即队列的末尾
        },
        _render: function (curQuery, item) {
            var self = this,
                cfg = self.cfg;
            // 在单元定位、排版之前触发
            cfg.owner.fire('beforeUnitLocate beforeUnitArrange', {
                autoResponsive: {
                    elm: item,
                    frame: cfg.owner.frame
                }
            });
            var coordinate = self.coordinate(curQuery, item);
            // 在单元定位之后触发
            cfg.owner.fire('afterUnitLocate', {
                autoResponsive: {
                    elm: item,
                    frame: cfg.owner.frame
                }
            });
            // 调用动画
            self.asyncize(function () {
                self.callAnim(item, coordinate);
            });
        },
        coordinate: function (curQuery, elm) {
            var cfg = this.cfg,
                isRecountUnitWH = cfg.isRecountUnitWH,
                fixedSize = cfg.owner.get('fixedSize');
            if (isRecountUnitWH || !elm.__width) {
                elm.__width = fixedSize.width ? fixedSize.width : D.outerWidth(elm);
                elm.__height = fixedSize.height ? fixedSize.height : D.outerHeight(elm);
            }
            return this._autoFit(curQuery, elm.__width, elm.__height);
        },
        /**
         * 返回x，y轴坐标
         */
        _autoFit: function (curQuery, cW, cH) {
            var cfg = this.cfg,_position,
                num = Math.ceil((( cfg.landscapeOrientation ? cH : cW ) + cfg.unitMargin.x) / cfg.gridWidth),
                cur = this._getCur(num, curQuery);
            for (var i = cur[0], len = num + cur[0], newH = cur[1] + (cfg.landscapeOrientation ? cW : cH) + cfg.unitMargin.y; i < len; i++) {
                curQuery.update(i, newH);
            }
            _position = [cur[0] * cfg.gridWidth, cur[1]];
            return cfg.landscapeOrientation ? _position.reverse() : _position;
        },
        /**
         * 获取当前指针
         */
        _getCur: function (num, curQuery) {
            return this._skipALG(num, curQuery);
        },
        /**
         * 单步式算法（常规保守的）
         * @param num 粒度
         * @param curQuery
         * @returns {Array}
         * @private
         */
        _stepALG: function (num, curQuery) {
            var cur = [null, Infinity];
            for (var i = 0, len = curQuery.size(); i < len - num + 1; i++) {
                var max = 0;
                for (var j = i; j < i + num; j++) {
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
         * 跳跃式算法（性能优越的）
         * @param num 粒度
         * @param curQuery
         * @returns {Array}
         * @private
         */
        _skipALG: function (num, curQuery) {
            var min = Infinity,
                idx = 0,
                len = curQuery.size();
            for (var i = 0; i <= (len < num ? 0 : len - num); i++) {
                var max = -Infinity, curValue;
                for (var j = 0; j < num; j++) {
                    curValue = curQuery.get(i + j);
                    if (curValue >= min) {
                        i += j + 1; // 向后跳跃
                        if (i > len - num) {// 过界了
                            max = min; // 主要是绕过min > max这个条件，以免污染min
                            break;
                        }
                        j = -1; // reset
                        max = -Infinity; // reset
                        continue;
                    }
                    if (curValue > max) {
                        max = curValue;
                    }
                }
                if (min > max) {
                    min = max;
                    idx = i; // 记录位置
                }
            }
            return [idx, min];
        },
        asyncize: function (handle) {
            var self = this,
                cfg = self.cfg;
            if (cfg.owner.get('suspend')) { // TODO 优化点：既然该判断条件可以在逻辑树上上提，以加快该函数的执行
                setTimeout(function () {
                    handle.call(self);
                }, 0);
            } else {
                handle.call(self);
            }
        },
        callAnim: function (elm, coordinate) {
            var cfg = this.cfg;
            new AutoAnim({
                elm: elm,
                x: coordinate[0],
                y: coordinate[1],
                closeAnim: cfg.closeAnim,
                duration: cfg.duration,
                easing: cfg.easing,
                direction: cfg.direction,
                frame: cfg.owner.frame,
                owner: cfg.owner,
                animType:cfg.animType
            });
            elm.autoResponsiveCoordinate = {
                x:coordinate[0],
                y:coordinate[1]
            };
        },
        _getMinMaxColHeight: function () {
            var cfg = this.cfg,
                min = Infinity,
                doneQuery = cfg.owner.curQuery.query, // TODO 如果使用的类型是链表？
                max = Math.max.apply(Math, doneQuery);
            if (max == 0) { // 说明是空容器
                min = 0;
            } else {
                for (var i = 0, len = doneQuery.length; i < len; i++) {
                    if (doneQuery[i] != 0 && doneQuery[i] < min) {
                        min = doneQuery[i];
                    }
                }
            }
            return {
                min: min,
                max: max
            };
        },
        /**
         * 设置容器高度
         * @param height
         */
        setHeight: function (height) {
            var cfg = this.cfg;
            if (!cfg.autoHeight) {
                return;
            }
            cfg.landscapeOrientation ? D.width(cfg.container, height) :D.height(cfg.container, height);
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
        }
    };
    return GridSort;
}, {requires: ['./anim', './linkedlist', 'dom']});

/**
 * @Description:    网页自适应布局Base 1.2
 * @Author:         dafeng.xdf[at]taobao.com
 * @Date:           2013.3.5
 */
KISSY.add('gallery/autoResponsive/1.3/base',function (S, GridSort, Base) {
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
             * @param {Object}  fixedSize            针对固定宽高的情况，若提供宽高则，计算量缩小{width:10,height:10}
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
                value: 1
            },
            easing: {
                value: 'easeNone'
            },
            direction: {
                value: 'left'
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
            },
            fixedSize:{
                value:{
                }
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
            self._bind(S.buffer(function () {
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

