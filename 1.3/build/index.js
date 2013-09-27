/*
combined files : 

gallery/autoResponsive/1.3/anim
gallery/autoResponsive/1.3/linkedlist
gallery/autoResponsive/1.3/gridsort
gallery/autoResponsive/1.3/base
gallery/autoResponsive/1.3/plugin/hash
gallery/autoResponsive/1.3/util
gallery/autoResponsive/1.3/plugin/drag
gallery/autoResponsive/1.3/plugin/loader
gallery/autoResponsive/1.3/plugin/sort
gallery/autoResponsive/1.3/index

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

            var actions = []; // 注意里面的规则顺序
            //定位之前触发用于自定义规则
            cfg.owner.fire('beforeLocate', {
                autoResponsive: { 
                    actions : actions,
                    elms: items // TODO items不精准，没有走过actions，所以可能存在被过滤元素，或顺序不正确问题
                }
            });
            //排版之前触发用于操作子元素
            cfg.owner.fire('beforeArrange', {
                autoResponsive: { // TODO 优化点：既然是给自定义事件传参，没必要再多挂一层 'autoResponsive' key
                    elms: items // TODO items不精准，没有走过actions，所以可能存在被过滤元素，或顺序不正确问题
                }
            });
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
                        /**
                         * @param renderQueue 用于排序的队列
                         * @param j 当前下标
                         * @param items dom元素数组
                         * @return 当返回number时，表示插入到队列中哪个位置的前面
                         */
                        r =(typeof(actions[t]) =='function' ? actions[t] : this[actions[t]])(renderQueue, j, items);
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

/**
 * @Description:    hash回溯、功能路由
 * @Author:         dafeng.xdf[at]taobao.com
 * @Date:           2013.3.5
 * @Log:            2013.7.20重构hash插件
 */
KISSY.add('gallery/autoResponsive/1.3/plugin/hash',function (S) {
    'use strict';
    var AND = '&',
        EQUAL = '=';

    /**
     * @name hash
     * @class 自适应布局
     * @constructor
     */
    function Hash(cfg) {
        var self = this;
        self.prefix = cfg.prefix || 'ks-';
    }

    /**
     * 启用插件便开始解析
     */
    S.augment(Hash, {
        init: function (owner) {
            var self = this;
            self.owner = owner;
            S.log('hash init!');
            if (!self.hasHash()) {
                return;
            }
            self.parse();
        },
        hasHash: function () {
            return location.hash ? true : false;
        },
        parse: function () {
            var self = this;
            self.getParam();
        },
        /**
         * 解析hash
         * priority,filter
         */
        getParam: function () {
            var self = this;
            self.hash = location.hash.split(AND);
            S.each(self.hash, function (param) {
                self.getPriority(param);
                self.getFilter(param);
            });
        },
        getPriority: function (str) {
            var self = this,
                _priority = self.prefix + 'priority';
            if (str.indexOf(_priority) != -1) {

            }
        },
        getFilter: function (str) {
            var self = this,
                _filter = self.prefix + 'filter';
            if (str.indexOf(_filter) != -1) {

            }
        }
    });
    return Hash;
}, {requires: ['event']});
/**
 * @Description: 公用工具类
 * @Author:      dafeng.xdf[at]taobao.com zhuofeng.ls@taobao.com
 * @Date:        2013.3.5
 */
KISSY.add('gallery/autoResponsive/1.3/util',function (S) {
    'use strict';
    var util = {};

    S.mix(util,{
        /**
         * 等同于kissy的buffer（保留尾帧的任务，延迟指定时间threshold后再执行）
         * 比kissy的buffer优越的一点是可以设置保留首帧还是尾帧任务（execAsap=true表示保留首帧）
         *
         * @param fn reference to original function
         * @param threshold
         * @param context the context of the original function
         * @param execAsap execute at start of the detection period
         * @returns {Function}
         * @private
         */
        debounce:function (fn, threshold, context, execAsap) {
            var timeout; // handle to setTimeout async task (detection period)
            // return the new debounced function which executes the original function only once
            // until the detection period expires
            return function debounced() {
                var obj = context || this, // reference to original context object
                    args = arguments; // arguments at execution time
                // this is the detection function. it will be executed if/when the threshold expires
                function delayed() {
                    // if we're executing at the end of the detection period
                    if (!execAsap)
                        fn.apply(obj, args); // execute now
                    // clear timeout handle
                    timeout = null;
                }

                // stop any current detection period
                if (timeout)
                    clearTimeout(timeout);
                // otherwise, if we're not already waiting and we're executing at the beginning of the detection period
                else if (execAsap)
                    fn.apply(obj, args); // execute now
                // reset the detection period
                timeout = setTimeout(delayed, threshold || 100);
            };
        },
        /**
         * 时间片轮询函数
         * @param items
         * @param process
         * @param context
         * @param callback
         * @returns {{}}
         */
        timedChunk:function(items, process, context, callback) {

            var monitor = {}, timer, todo = []; // 任务队列 | 每一个时间片管理函数（timedChunk）都维护自己的一个任务队列

            var userCfg = context.config,
                qpt = userCfg.qpt || 15;

            monitor.start = function () {

                todo = todo.concat(S.makeArray(items)); // 压入任务队列

                // 轮询函数
                var polling = function () {
                    var start = +new Date;
                    while (todo.length > 0 && (new Date - start < 50)) {
                        var task = todo.splice(0, qpt);
                        process.call(context, task);
                    }

                    if (todo.length > 0) { // 任务队列还有任务，放到下一个时间片进行处理
                        timer = setTimeout(polling, 25);
                        return;
                    }

                    callback && callback.call(context, items);

                    // 销毁该管理器
                    monitor.stop();
                    monitor = null;
                };

                polling();
            };

            monitor.stop = function () {
                if (timer) {
                    clearTimeout(timer);
                    todo = [];
                }
            };
            return monitor;
        }

    });
    return util;
});

/**
 * @Description:    拖拽功能，依赖constrain、scroll两个dd组件
 * @Author:         dafeng.xdf[at]taobao.com
 * @Date:           2013.3.5
 * @Log:            1.2版本对drag重构
 */
KISSY.add('gallery/autoResponsive/1.3/plugin/drag',function (S,Constrain,Scroll,Util) {
    'use strict';
    var D = S.DOM,
        DD = S.DD, DDM = DD.DDM,
        DraggableDelegate = DD.DraggableDelegate,
        DroppableDelegate = DD.DroppableDelegate,
        prifixCls = 'ks-autoResponsive-dd-',
        placeHolderCls = prifixCls+'placeHolder',
        draggingCls = prifixCls+'dragging',
        placeHolderTPL = '<div class="'+placeHolderCls+'"></div>';

    /**
     * Drag
     * @param cfg
     * @constructor
     */
    function Drag(cfg) {
        var self = this;
        self.closeConstrain = cfg.closeConstrain || false; //是否关闭边界限制，默认开启
        self.selector = cfg.selector;                      //拖拽dom选择器
        self.handlers = cfg.handlers || [];                //拖拽操作代理dom
        self.threshold = cfg.threshold || 300;             //拖拽默认时间颗粒度
    }
    Drag.prototype={
        /**
         * drag插件初始化
         * @public 供宿主对象在插件初始化时调用
         * @param owner 为插件宿主
         */
        init: function (owner) {
            var self = this;
            /**
             * 获取宿主对象
             * @type {*}
             */
            self.owner = owner;
            /**
             * 强制更改owner配置为fixedAnim
             * @type {*}
             */
            self.owner.changeCfg({
                animType:'fixedAnim'
            });
            /**
             * 容器取自宿主配置
             * @type {*}
             */
            self.container = self.owner.userConfig.container;
            /**
             * 初始化拖拽代理对象
             * @type {DraggableDelegate}
             */
            self.dragDelegate = new DraggableDelegate({
                container:self.container,
                selector:self.selector,
                move:true,
                plugins:[new Constrain({
                    constrain: self.container
                }),new Scroll({
                    node: self.container
                })],
                handlers:self.handlers
            });
            /**
             * 初始化拖放对象
             * @type {DroppableDelegate}
             */
            self.dropDelegate = new DroppableDelegate({
                container:self.container,
                selector:self.selector
            });
            /**
             * 拖放自定义事件操作
             */
            self._bindOperate();
            S.log('drag init!');
        },
        /**
         * 动态改变配置
         */
        changCfg:function(cfg){
            var self = this;
            S.each(cfg,function(i,key){
                self.dragDelegate.set(key,i);
            });
        },
        stop:function(){
            var self = this;
            self.dragDelegate.set('disabled',true);
        },
        restore:function(){
            var self = this;
            self.dragDelegate.set('disabled',false);
        },
        _bindOperate:function(){
            var self = this;
            DDM.on('dragstart',self._debounce(self._dragStartOperate))
                .on('dragend',self._debounce(self._dragEndOperate))
                .on('dropover',self._debounce(self._dropOverOperate));
        },
        _dragStartOperate:function(e){
            var self = this,
                _drag = e.drag,
                _node =  _drag.get("node");
            self.select = _node[0];
            /**
             * 获取坐标对象
             * @type {*}
             */
            self.originPosition = self.select.autoResponsiveCoordinate;
            /**
             * 创建中间模块
             * @type {*}
             */
            self._renderPlaceHolder();
            /**
             * 设置select为拖起样式
             */
            D.addClass(self.select,draggingCls);
            /**
             * 覆盖宿主配置，对拖起元素略过不计
             */
            self.owner.changeCfg({
                exclude:draggingCls
            });
        },
        _dragEndOperate:function(){
            var self = this;
            /**
             * 拖动结束后设置拖起元素为中间元素的坐标
             */
            D.css(self.select,{
                left: D.css(self.placeHolder,'left'),
                top: D.css(self.placeHolder,'top')
            });
            /**
             * 插入占位元素之前
             */
            D.insertBefore(self.select,self.placeHolder);
            /**
             * 去掉中间元素
             */
            D.remove(self.placeHolder);
            /**
             * 复原拖起元素样式
             */
            D.removeClass(self.select,draggingCls);
        },
        _dropOverOperate:function(e){
            var self = this,
                _drop = e.drop,
                _node = _drop.get("node");
            /**
             * 中间展位元素插入over元素之前
             */
            D.insertBefore(self.placeHolder,_node);
            /**
             * 调用autoResponsive排序
             */
            self.owner.adjust();
        },
        _renderPlaceHolder:function(){
            var self = this;
            /**
             * 创建占位dom
             * @type {*}
             */
            self.placeHolder = D.create(placeHolderTPL);
            /**
             * 设置占位样式
             */
            D.css(self.placeHolder,{
                left:self.originPosition.x,
                top:self.originPosition.y,
                width: D.width(self.select),
                height: D.height(self.select)
            });
            /**
             * dom树插入占位元素
             */
            D.insertBefore(self.placeHolder,self.select);
        },
        _debounce:function(fn){
            var self = this,
                _threshold = self.threshold;
            return Util.debounce(fn,_threshold,self,true);
        }
    };
    return Drag;
}, {requires: ['dd/plugin/constrain','dd/plugin/scroll','../util','dd','dom','event']});

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
KISSY.add('gallery/autoResponsive/1.3/plugin/loader',function (S,Util) {
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

/**
 * @Description:    Sort
 * @Author:         dafeng.xdf[at]taobao.com
 * @Date:           2013.09.01
 */
KISSY.add('gallery/autoResponsive/1.3/plugin/sort',function (S) {
    'use strict';
    var D = S.DOM;

    var config = {};
    /**
     * @name Sort
     * @class 排序插件
     * @constructor
     */
    function Sort(cfg) {
        if (!(this instanceof Sort)) {
            return new Sort(cfg);
        }
        this._makeCfg(cfg);
    }
    /**
     * 启用插件便开始解析
     */
    S.augment(Sort, {
        /**
         * loader插件初始化
         * @public 供宿主对象在插件初始化时调用
         * @param owner Base对象（即插件宿主对象）
         * 重度依赖beforeLocate事件
         */
        init: function (owner) {
            var self = this;
            self.owner = owner;
            self.actions = [];
            self.owner.on('beforeLocate',function(d){
                self.elms = d.autoResponsive.elms;
                for (var i = 0;i<self.actions.length;i++){
                    d.autoResponsive.actions.push(self.actions[i]);
                }
            });
            S.log('plugin sort::init');
        },
        /**
         * 用户配置修正
         * @param cfg
         * @private
         */
        _makeCfg: function(cfg){
            cfg = config
            this.config = cfg;
        },
        /**
         * 暴露成外部接口
         * 修改的配置会立即生效
         * @param cfg
         */
        changeCfg: function(cfg){
            this._makeCfg(S.merge(this.config, cfg)); // 重新配置
        },
        /**
         * 随机排序
         */
        random:function(cfg){
            var self = this;
            self.clear();
            self.actions.push(function(queue,index,items){
                return parseInt(Math.random() * queue.length);
            });
        },
        /**
         * 优先排序
         */
        priority:function(cfg){
            var self = this;
            var attrName = cfg.attrName || 'data-priority';
            var cache = [],_p =-1;
            S.each(self.elms,function(i){
                if( cfg.dataAttr && ( D.attr(i,attrName) == cfg.dataAttr ) || D.hasClass(i,cfg.classAttr)){
                    cache.push(i);
                }
            });
            self.actions.push(function(queue,index,items){
                if(S.inArray(items[index],cache)){
                    _p++;
                    return _p;
                }else{
                    return queue.length;
                }
            });
        },
        /**
         * 倒序
         */
        reverse:function(){
            var self = this;
            self.actions.push(function(queue,index,items){
                return 0;
            });
        },
        /**
         * 过滤排序
         */
        filter:function(cfg){
            var self = this;
            self.clear();
            var attrNames = cfg.attrName || ['data-filter'];
            for(var j = 0;j<attrNames.length;j++){
                var attrName =  attrNames[j]||'data-filter';
                self.actions.push(function(queue,index,items){
                   if( (D.hasAttr(items[index],attrName) &&  D.attr(items[index],attrName) == cfg.dataAttr)){
                        D.show(items[index]);
                   }else if(D.hasClass(items[index],cfg.classAttr)){
                        D.show(items[index]);
                   }else if(S.inArray(D.attr(items[index],attrName),cfg.dataAttr)){
                        D.show(items[index]);
                   }else {
                        cfg.hide && D.hide(items[index]);
                        return true;
                   }
                });
            }
        },
        /**
         * 用户自定义算法
         */
        custom:function(action){
            var self = this;
            self.actions.push(action);
        },
        /**
         * 清除规则
         */
        clear:function(){
            var self = this;
            //清除所有自定义规则
            self.actions = [];
        },
        /**
         * 撤销操作
         */
        restore:function(){
            var self = this;
            self.actions.pop();
        }
    });
    return Sort;

}, {requires: ['dom']});

/**
 * @Description: 目前先挂载base，effect效果插件，hash插件
 * @Author:      dafeng.xdf[at]taobao.com
 * @Date:        2013.3.5
 */
KISSY.add('gallery/autoResponsive/1.3/index',function (S, AutoResponsive, Hash, Drag, Loader, Sort) {
    AutoResponsive.Hash = Hash;
    AutoResponsive.Drag = Drag;
    AutoResponsive.Loader = Loader;
    AutoResponsive.Sort = Sort;
    return AutoResponsive;
}, {requires: ['./base', './plugin/hash', './plugin/drag', './plugin/loader', './plugin/sort']});

