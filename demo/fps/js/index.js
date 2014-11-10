/*
 combined files :

 gallery/autoResponsive/1.1/config
 gallery/autoResponsive/1.1/anim
 gallery/autoResponsive/1.1/linkedlist
 gallery/autoResponsive/1.1/gridsort
 gallery/autoResponsive/1.1/base
 gallery/autoResponsive/1.1/plugin/hash
 gallery/autoResponsive/1.1/plugin/drag
 gallery/autoResponsive/1.1/plugin/loader
 gallery/autoResponsive/1.1/index

 */
/**
 * @Description:    ��ҳ����Ӧ����ȫ������ģ��
 * @Author:         dafeng.xdf[at]taobao.com
 * @Date:           2013.3.5
 */
KISSY.add('gallery/autoResponsive/1.1/config',function () {
    'use strict';
    var EMPTY = '';

    /**
     * @name Config
     * @param {String}  container            �������
     * @param {String}  selector             ��Ԫѡ����
     * @param {String}  filter               ��Ԫ������
     * @param {String}  fixedSelector        [*]ռλѡ����
     * @param {String}  priority             ����ѡ����
     * @param {Number}  gridWidth            ��Сդ��Ԫ���<code>px</code>
     * @param {Object}  unitMargin           ��Ԫ����߾�<code>px</code>
     * @param {Boolean} closeAnim            �Ƿ�رն�����Ĭ�Ͽ�����
     * @param {Number}  duration             ���䶯��ʱ��
     * @param {String}  easing               ���䶯������
     * @param {String}  direction            ������ʼ���򣨿�ѡֵ��<code>'right'</code>��
     * @param {Boolean} random               ������򿪹أ�Ĭ�Ϲرգ�
     * @param {String}  sortBy               �����㷨����ѡֵ��<code>'grid'</code>��<code>'cell'</code>��Ĭ��Ϊ<code>'grid'</code>��
     * @param {Boolean} autoHeight           �����߶�����Ӧ���أ�Ĭ��Ϊtrue��
     * @param {Boolean} suspend              ��Ⱦ��������Ƿ�֧�ֹ��𣨹���ʱ������ִ�н���UI�߳� | Ĭ��Ϊtrue��
     * @param {Array}   plugins              �������
     * @param {Boolean} autoInit             �Ƿ��Զ���ʼ����Ĭ��Ϊtrue��
     * @param {Boolean} closeResize          �Ƿ�ر�resize�󶨣�Ĭ�ϲ��رգ�
     * @param {Number}  resizeFrequency      resize����Ƶ��
     * @param {Array}   whensRecountUnitWH   ���¼��㵥Ԫ��ߵ���Ϊʱ�̣���ѡֵ��<code>'closeResize', 'adjust'</code>��
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
 * @Description: ����css3�͵Ͱ汾���������Ч��
 * @Author:      dafeng.xdf[at]taobao.com
 * @Date:        2013.3.5
 */
KISSY.add('gallery/autoResponsive/1.1/anim',function (S) {
    'use strict';
    var D = S.DOM, Anim = S.Anim, BLANK = ' ',
        letIE10 = S.UA.ie < 11;

    /**
     * @name AutoAnim
     * @class css����������֡�ظ�
     * @constructor
     */
    function AutoAnim(cfg) {
        var self = this;
        self.cfg = cfg;
        self._init();
    }

    S.augment(AutoAnim, {
        _init: function () {
            var self = this;
            letIE10 ? self.fixedAnim() : self.css3Anim();
        },
        /**
         * css3����
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
             * css3Ч���������
             */
            var self = this,
                cfg = self.cfg;
            if (cfg.direction !== 'right') {
                D.css(cfg.elm, S.merge(
                    self.cssPrefixes('transform', 'translate(' + cfg.x + 'px,' + cfg.y + 'px) '),
                    self.cssPrefixes('transition-duration', cfg.closeAnim ? 0 : cfg.duration + 's'))
                );
            }else{
                D.css(cfg.elm, S.merge(
                    self.cssPrefixes('transform', 'translate(' + (cfg.owner.gridSort.containerWH - cfg.elm.__width-cfg.x)  + 'px,' + cfg.y + 'px) '),
                    self.cssPrefixes('transition-duration', cfg.closeAnim ? 0 : cfg.duration + 's'))
                );
            }
            /**
             * ��Ԫ�ؼ�������󴥷�
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
         * ����ģ��css3����
         */
        fixedAnim: function () {
            var self = this,
                cfg = self.cfg,
                cssRules = {'top': cfg.y},
                direction = 'left';
            if (cfg.closeAnim) {
                self.noneAnim();
                return;
            }
            if (cfg.direction == 'right') {
                direction = 'right';
            }
            cssRules[direction] = cfg.x;
            new Anim(cfg.elm, cssRules, cfg.duration, cfg.easing, function () {
                /**
                 * ��Ԫ�ؼ�������󴥷�
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
         * �޶���
         */
        noneAnim: function () {
            var self = this,
                cfg = self.cfg;
            D.css(cfg.elm, {
                left: cfg.x,
                top: cfg.y
            });
            /**
             * ��Ԫ�ؼ�������󴥷�
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
 * @Description: ����һ��˫�����������
 * @Author:      dafeng.xdf[at]taobao.com
 * @Date:        2013.3.5
 */
KISSY.add('gallery/autoResponsive/1.1/linkedlist',function (S) {
    'use strict';
    /**
     * @name LinkedList
     * @class ˫���������
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
         * ��ʼ���������������
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
         * �����ڵ�
         */
        add: function (value) {
            var self = this;
            if (self.type) {
                self.query.push(value);
                return;
            }
            var node = {
                value: value,
                next: null,//ǰ��
                prev: null//���
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
         * ɾ���ڵ�
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
         * ��ȡ����ֵ
         */
        get: function (index) {
            var self = this;
            if (self.type) {
                return self.query[index];
            }
            return self.node(index).value;
        },
        /**
         * ��������ڵ�
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
         * ���½ڵ�ֵ
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
 * @Description:    ��������
 * @Author:         dafeng.xdf[at]taobao.com
 * @Date:           2013.3.5
 * @Todo:           gridSort
 */
KISSY.add('gallery/autoResponsive/1.1/gridsort',function (S, AutoAnim, LinkedList) {
    'use strict';
    var D = S.DOM, EMPTY = '';

    /**
     * @name GridSort
     * @class դ�񲼾��㷨
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
         * �������
         * ��¼ȫ�ֻ���
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
             * ��������Ԫ��֮ǰ����
             */
            cfg.owner.fire('beforeUnitSort', {
                autoResponsive: {
                    elm: item,
                    frame: cfg.owner.frame
                }
            });
            self._maxHeight = 0;
            var coordinate = self.coordinate(curQuery, item),
                height = coordinate[1] + item.__height;
            if ((self._maxHeight || 0) < height) {
                self._maxHeight = height;
            }
            /**
             * ���ö���
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
             * ���ùؼ�֡
             */
            self._setFrame();
            if (cfg.random) {
                items = items.shuffle();
            }
            /**
             * ����֮ǰ����beforeSort
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
             * ��ջ������
             */
            self.clearCache(curQuery, items);
            /**
             * ����֮�󴥷�
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
         * @deprecated �ù�����ʱδ����
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
            self.containerWH = D.outerWidth(cfg.container);
            if (cfg.owner.curQuery && cfg.cache) {
                return cfg.owner.curQuery;
            } else {
                var curQuery = new LinkedList({});
                for (var i = 0, span = Math.ceil(self.containerWH / cfg.gridWidth); i < span; i++) {
                    curQuery.add(0);
                }
                return curQuery;
            }
        },
        /**
         * ��ȡ��ǰָ��
         */
        _stepALG: function(num, curQuery){
            var cur = [null, Infinity],
                _curQuery = curQuery.query.length ? curQuery.query : curQuery;

            for (var i = 0, len = _curQuery.length; i < len - num; i++) {
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
         * ��Ծʽ�㷨
         * @param num
         * @param curQuery
         * @returns {Array}
         * @private
         */
        _skipALG: function(num, curQuery){

            var min = Infinity,
                i = 0, idx = 0,
                _curQuery = curQuery.query.length ? curQuery.query : curQuery;

            for (var len = _curQuery.length; i < len - num + 1; i++) {
                var max = -Infinity, curValue;

                for (var j = 0; j < num; j++) {
                    curValue = curQuery.get(i + j);
                    if (curValue >= min) {
                        i += j+1; // �����Ծ
                        if(i > len - num){// ������
                            max = min; // ��Ҫ���ƹ�min > max���������������Ⱦmin
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
                    idx = i; // ��¼λ��
                }
            }
            return [idx, min];
        },
            /**
         * ����x��y������
         */
        _autoFit: function (curQuery, cW, cH) {
            var self = this,
                cfg = self.cfg,
                _num = Math.ceil((cW + cfg.unitMargin.x) / cfg.gridWidth),
                cur = self._skipALG(_num, curQuery);
                //cur = self._stepALG(_num, curQuery);
            for (var i = cur[0]; i < _num + cur[0]; i++) {
                curQuery.update(i, cur[1] + cH + cfg.unitMargin.y);
            }
            cfg.owner.doneQuery = curQuery.query;
            return [cur[0] * cfg.gridWidth + cfg.unitMargin.x, cur[1] + cfg.unitMargin.y];
        },
        /**
         * ���������߶�
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
 * @Description:    ��ҳ����Ӧ����Base
 * @Author:         dafeng.xdf[at]taobao.com
 * @Date:           2013.3.5
 */
KISSY.add('gallery/autoResponsive/1.1/base',function (S, Config, GridSort, Base) {
    'use strict';
    var D = S.DOM, E = S.Event, win = window;

    /**
     * @name AutoResponsive
     * @class ��ҳ����Ӧ����
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
         * ��ʼ�����
         * @return  ����ʵ��
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
             * ��Ӳ��
             */
            S.each(self.get('plugins'), function (i) {
                i.init(self);
                S.mix(self.api, i.api);
            });
        },
        /**
         * ��Ⱦ������
         */
        render: function () {
            var self = this,
                userCfg = self.getAttrVals();
            self.frame = self.frame || 0;
            arguments[0] && S.each(arguments[0], function (i, _key) {
                userCfg[_key] = i;
            });
            /**
             * Ӧ�ò������
             */
            S.mix(userCfg, self.api);
            self.gridSort = self.gridSort || new GridSort();
            self.gridSort.init(userCfg, self);
        },
        /**
         * �������resize�¼�
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
         * ����¼�������
         */
        _bindEvent: function () {
            var self = this;
            self._bind(S.buffer(function () {   // ʹ��buffer����Ҫʹ��throttle
                self.render(arguments);
                /**
                 * ������ı䴥��resize�¼�
                 */
                self.fire('resize');
            }, self.get('resizeFrequency'), self));
        },
        /**
         * ���²��ֵ���
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
         * �������򷽷�
         * @param {String} ѡ����
         */
        priority: function (selector) {
            var self = this;
            self.render({
                priority: selector
            });
        },
        /**
         * ���˷���
         * @param {String} ѡ����
         */
        filter: function (selector) {
            var self = this;
            self.render({
                filter: selector
            });
        },
        /**
         * �����߾�
         * @param {Object} �߾�
         */
        margin: function (margin) {
            var self = this;
            self.render({
                unitMargin: margin
            });
        },
        /**
         * ��������
         * @param {String} ����
         */
        direction: function (direction) {
            var self = this;
            self.render({
                direction: direction
            });
        },
        /**
         * �������
         */
        random: function () {
            var self = this;
            self.render({
                random: true
            });
        },
        /**
         * �ı��������
         * @param {Object} ���ö���
         */
        option: function (option) {
            var self = this;
            self.render(option);
        },
        /**
         * append ����,���ø�������Ż�����
         * @param {Object} �ڵ���󣨿���Ϊ����Ԫ�ء����Ԫ�����顢fragments���Լ�������飩
         */
        append: function (nodes) {
            var self = this;
            D.append(nodes, self.get('container'));
            self.render({
                cache: true
            });
        },
        /**
         * dom prepend ����,�ķ�����
         * @param {Object} �ڵ���󣨿���Ϊ����Ԫ�ء����Ԫ�����顢fragments���Լ�������飩
         */
        prepend: function (nodes) {
            var self = this;
            D.prepend(nodes, self.get('container'));
            self.render();
        }
    }, { ATTRS: new Config()});
    return AutoResponsive;
}, {requires: ['./config', './gridsort', 'base', 'dom', 'event']});

/**
 * @Description:    hash���ݡ�����·��
 * @Author:         dafeng.xdf[at]taobao.com
 * @Date:           2013.3.5
 */
KISSY.add('gallery/autoResponsive/1.1/plugin/hash',function (S) {
    'use strict';
    var AND = '&',
        EQUAL = '=';

    /**
     * @name hash
     * @class ����Ӧ����
     * @constructor
     */
    function Hash(cfg) {
        var self = this;
        self.prefix = cfg.prefix || 'ks-';
        self.api = {};
    }

    /**
     * ���ò���㿪ʼ����
     */
    S.augment(Hash, {
        init: function (owner) {
            var self = this;
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
         * ����hash
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
                S.mix(self.api, {
                    priority: str.split(EQUAL)[1]
                });
            }
        },
        getFilter: function (str) {
            var self = this,
                _filter = self.prefix + 'filter';
            if (str.indexOf(_filter) != -1) {
                S.mix(self.api, {
                    filter: str.split(EQUAL)[1]
                });
            }
        }
    });
    return Hash;
}, {requires: ['event']});
/**
 * @Description:    ��ק����
 * @Author:         dafeng.xdf[at]taobao.com
 * @Date:           2013.3.5
 */
KISSY.add('gallery/autoResponsive/1.1/plugin/drag',function (S) {
    'use strict';
    var E = S.Event, DD = S.DD,
        DraggableDelegate = DD.DraggableDelegate,
        Droppable = DD.Droppable;

    /**
     * @name Drag
     * @class ��ק����
     * @constructor
     */
    function Drag(cfg) {
    }

    /**
     *
     */
    S.augment(Drag, {
        init: function () {
            var self = this;
            S.log('drag init!');
        },
        _bindDrop: function (elm) {
            var self = this;
            if (self.drag != 'on') {
                return;
            }
            new Droppable({
                node: elm
            }).on("dropenter", function (ev) {
                    D.insertAfter(ev.drag.get("node"), ev.drop.get("node"));
                    self.owner.render();
                });
        },
        _bindBrag: function () {
            var self = this;
            if (self.drag != 'on') {
                return;
            }
            new DraggableDelegate({
                container: self.container,
                selector: self.selector,
                move: true
            }).on('dragstart',function (ev) {
                    var _target = ev.drag.get("node")[0];
                    this.p = {
                        left: _target.offsetLeft,
                        top: _target.offsetTop
                    };
                }).on('drag',function () {
                }).on('dragend', function (ev) {
                    D.css(ev.drag.get("node"), this.p);
                });
        }
    });
    return Drag;
}, {requires: ['event', 'dd']});
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
KISSY.add('gallery/autoResponsive/1.1/plugin/loader',function (S) {
    'use strict';
    var D = S.DOM, $ = S.all, win = window, $win = $(win),

        SCROLL_TIMER = 50;

    /**
     * @name Loader
     * @class ������
     * @constructor
     */
    function Loader(cfg) {
        var self = this;

        // �û���������
        cfg = {
            load: typeof cfg.load == 'function' ? cfg.load : function (success, end) {
                S.log('AutoResponsive.Loader::constructor: the load function in user\'s config is undefined!', 'warn');
            },
            diff: cfg.diff || 0,  // ����ש��Ԥ�ظ߶�
            mod: cfg.mod == 'manual' ? 'manual' : 'auto',  // load����ģʽ
            qpt: 15 // ÿ����Ⱦ��������Ԫ��������15��ʾÿ�������Ⱦ15������ש�飬������Ĳ����¸�ʱ��Ƭ�ٴ���
        };

        self.config = cfg;
    }

    /**
     * ���ò���㿪ʼ����
     */
    S.augment(Loader, S.EventTarget, {
        /**
         * loader�����ʼ��
         * @public �����������ڲ����ʼ��ʱ����
         * @param owner Base���󣨼������������
         */
        init: function (owner) {
            var self = this,
                userCfg = self.config,
                mod = userCfg.mod;

            self.owner = owner;

            self.__bindMethods();

            if (mod === 'manual') { // �ֶ�����ģʽ | ������������û��Զ���load�����������������ఴťʱ����
                // nothing to do

            } else { // �Զ�����ģʽ

                self.__onScroll = S.buffer(self.__doScroll, SCROLL_TIMER, self);

                self.__onScroll(); // ��ʼ��ʱ�������һ�Σ�����Ҫ�ȳ�ʼ�� adjust ��ɺ�.

                self.start();
            }

        },
        /**
         * ���Զ�����ģʽ�£������Ļ����λ���Ƿ����㴥��load���ݵ�����
         * @private
         */
        __doScroll: function () {
            var self = this,
                owner = self.owner,
                userCfg = self.config;
            S.log('AutoResponsive.Loader::__doScroll...');
            if (self.__loading) {
                return;
            }
            // ������ڵ����У��Ȼ��ٿ���
            // �����еĸ߶Ȳ�ȷ�������ڲ��ʺ��ж��Ƿ��˼��������ݵ�����
            if (owner.isAdjusting()) {
                // ǡ�� __onScroll �� buffered
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
                scrollTop = $win.scrollTop(),
                height = $win.height();

            // ��̬���� | ����Ԥ������(���û�������)ʱ��������
            if (diff + scrollTop + height >= offsetTop + minColHeight) {
                self.load();
            }
        },
        /**
         * ʹ���û��Զ���load���������ݽ���loading
         * @public ���ֶ�ģʽʱ���Թ��ⲿ����
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

                    callback && callback.call(self);

                    self.__doScroll(); // �����겻��һ���ٴμ��
                });
            }

            function end() {
                self.stop();
            }
        },
        /**
         * ��ָ��������__appendItems����װ��ʱ��Ƭ������
         * @private
         * @param items
         * @param callback
         * @returns {*}
         */
        __addItems: function (items, callback) {
            var self = this;

            // ����һ���µ�ʱ��Ƭ���������ɵ��������û�����껹���������ֱ����������Զ����٣�
            timedChunk(items, self.__appendItems, self,function () {

                callback && callback.call(self);

                // TODO revise...
                self.fire('autoresponsive.loader.complete', {
                    items: items
                });
            }).start();

        },
        /**
         * �������в����½ڵ�
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
         * ΪBase�������getMaxColHeight��getMinColHeight����
         * @private
         */
        __bindMethods: function () {
            var self = this,
                owner = self.owner,
                curMinMaxColHeight = {min: 0, max: 0};
            owner.on('afterSort', function (e) {
                curMinMaxColHeight = e.autoResponsive.curMinMaxColHeight;
            });
            owner.getMaxColHeight = function () {
                return curMinMaxColHeight.max;
            };
            owner.getMinColHeight = function () {
                return curMinMaxColHeight.min;
            };
        },
        /**
         * ����loader����load����
         * @public
         */
        start: function () {
            this.resume();
        },
        /**
         * ֹͣloader����load����
         * @public
         */
        stop: function () {
            this.pause();
        },
        /**
         * ��ͣloader����load����
         * @public
         */
        pause: function () {
            if (this.__destroyed)
                return;

            $win.detach('scroll', this.__onScroll);
            this.__onScroll.stop();
        },
        /**
         * �ָ������»��ѣ�loader����load����
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
         * ֹͣloader���й���������loader����
         * @public
         */
        destroy: function () {
            // TODO ...
            this.__destroyed = 1;
        }
//        Status: {INIT: 0, LOADING: 1, LOADED: 2, ERROR: 3, ATTACHED: 4}
    });

    /**
     * ʱ��Ƭ��ѯ����
     * @param items
     * @param process
     * @param context
     * @param callback
     * @returns {{}}
     */
    function timedChunk(items, process, context, callback) {

        var monitor = {}, timer, todo = []; // ������� | ÿһ��ʱ��Ƭ��������timedChunk����ά���Լ���һ���������

        var userCfg = context.config,
            qpt = userCfg.qpt || 15;

        monitor.start = function () {

            todo = todo.concat(S.makeArray(items)); // ѹ���������

            // ��ѯ����
            var polling = function () {
                var start = +new Date;
                while (todo.length > 0 && (new Date - start < 50)) {
                    var task = todo.splice(0, qpt);
                    process.call(context, task);
                }

                if (todo.length > 0) { // ������л������񣬷ŵ���һ��ʱ��Ƭ���д���
                    timer = setTimeout(polling, 25);
                    return;
                }

                callback && callback.call(context, items);

                // ���ٸù�����
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

    return Loader;

}, {requires: ['dom', 'event']});
/**
 * @Description: Ŀǰ�ȹ���base��effectЧ�������hash���
 * @Author:      dafeng.xdf[at]taobao.com
 * @Date:        2013.3.5
 */
KISSY.add('gallery/autoResponsive/1.1/index',function (S, AutoResponsive, Hash, Drag, Loader) {
    AutoResponsive.Hash = Hash;
    AutoResponsive.Drag = Drag;
    AutoResponsive.Loader = Loader;
    return AutoResponsive;
}, {requires: ['./base', './plugin/hash', './plugin/drag', './plugin/loader']});
