/**
 * @ignore
 * Make Elements flow like waterfall.
 * @author yiminghe@gmail.com
 */
KISSY.add("waterfall/base", function (S, Node, Base) {

    var $ = Node.all,
        win = S.Env.host,
        RESIZE_DURATION = 50;

    /**
     * Make Elements flow like waterfall.
     * @class KISSY.Waterfall
     */
    function Waterfall() {
        var self = this;
        Waterfall.superclass.constructor.apply(self, arguments);
        // windows ie<9
        //  - ���������ͻᴥ�� resize �¼�
        //  - ie<8 ����������������������һ��
        //  - ie=8 ���˹����������������ǰ��һ���ˣ����������߼�
        var onResize = self.__onResize = S.buffer(doResize, RESIZE_DURATION, self);
        // һ��ʼ�� adjust һ�Σ����Զ����о�̬���ݴ���

        doResize.call(self);
        $(win).on("resize", onResize);
    }

    function timedChunk(items, process, context, callback) {

        var stopper = {},
            timer, todo;

        function start() {

            todo = [].concat(S.makeArray(items));

            if (todo.length > 0) {
                // 2012-07-10
                // ��һ�β��ӳ٣���ֹ
                // adjust -> recalculate -> addItem -> adjustItemAction
                // �����˹̶������Ͻǵ�Ԫ��
                (function () {
                    var start = +new Date();
                    do {
                        var item = todo.shift();
                        process.call(context, item);
                    } while (todo.length > 0 && (+new Date() - start < 50));

                    if (todo.length > 0) {
                        timer = setTimeout(arguments.callee, 25);
                    } else {
                        callback && callback.call(context, items);
                    }
                })();
            } else {
                callback && callback.call(context, items);
            }
        }

        stopper.stop = function () {
            if (timer) {
                clearTimeout(timer);
                todo = [];
                items.each(function (item) {
                    item.stop();
                });
            }
        };

        // ������������ֹͬ��ʱ���̱������
        stopper.start = start;

        return stopper;
    }


    Waterfall.ATTRS = {
        /**
         * Container which contains waterfall elements.
         * @cfg {KISSY.NodeList} container
         */
        /**
         * @ignore
         */
        container: {
            setter: function (v) {
                return $(v);
            }
        },

        /**
         * Horizontal alignment of waterfall items with container.
         * Enum: 'left','center','right','justify'.
         * @cfg {String} align
         */
        /**
         * @ignore
         */
        align: {
            value: 'center'
        },

        /**
         * Minimum col count of waterfall items.
         * Event window resize to 0.
         * Defaults to: 1.
         * @cfg {Number} minColCount
         */
        /**
         * @ignore
         */
        minColCount: {
            value: 1
        },

        /**
         * Effect config object when waterfall item is added to container.
         *
         * Defaults to: { effect:"fadeIn",duration:1 }
         * @cfg {Object} effect
         *
         *      for example:
         *      {
         *          effect:'fadeIn', // or slideUp
         *          duration:1 // unit is second
         *      }
         */
        /**
         * @ignore
         */
        effect: {
            value: {
                effect: "fadeIn",
                duration: 1
            }
        },

        /**
         * Column's width.
         * @cfg {Number|Function} colWidth
         */
        /**
         * @ignore
         */
        colWidth: {},

        /**
         * Effect config object when waterfall item is adjusted on window resize.
         *
         * Defaults to: { easing:"",duration:1 }
         * @cfg {Object} adjustEffect
         *
         *      for example:
         *      {
         *          easing:'', // easing type
         *          duration:1 // unit is second
         *      }
         */
        /**
         * @ignore
         */
        adjustEffect: {}
    };

    function doResize() {
        var self = this,
            colWidth = self.get('colWidth'),
            container = self.get('container'),
            containerRegion = self._containerRegion || {};

        // support fluid width
        // responsive design!
        if (S.isFunction(colWidth)) {
            colWidth = colWidth(self);
        }
        // S.log('resize: colWidth: ' + colWidth);

        if (
        // container display none ...
            !container[0].offsetWidth ||
                // �������û�䲢��ÿ�п��Ҳû���û��Ҫ����
                self._colWidth === colWidth &&
                    container.width() === containerRegion.width) {
            return
        }
        self._colWidth = colWidth;
        self.adjust();
    }

    function recalculate() {
        var self = this,
            container = self.get("container"),
            containerWidth = container.width(),
            curColHeights = self._curColHeights || [];
        /**
         * Array of height of current waterfall cols.
         * @protected
         * @type {Number[]}
         * @property curColHeights
         */
        self._curColHeights = curColHeights;
        // ��ǰ����
        curColHeights.length = Math.max(Math.floor(containerWidth / self._colWidth), self.get("minColCount"));
        // ��ǰ�������
        self._containerRegion = {
            width: containerWidth
        };
        S.each(curColHeights, function (v, i) {
            curColHeights[i] = 0;
        });
        /**
         * Waterfall items grouped by col.
         * @private
         * @type {KISSY.NodeList[][]}
         * @property colItems
         *
         *      for example:
         *      [
         *          [ node11, node12 ],
         *          [ node21, node22 ]
         *      ]
         */
        self._colItems = [];
    }

    function adjustItemAction(self, add, itemRaw, callback) {
        var effect = self.get("effect"),
            item = $(itemRaw),
            align = self.get("align"),
            margin,
            curColHeights = self._curColHeights,
            container = self.get("container"),
            colWidth = self._colWidth,
            curColCount = curColHeights.length,
            col = 0,
            colProp,
            containerRegion = self._containerRegion,
            guard = Number['MAX_VALUE'];

        if (!curColCount) {
            return undefined;
        }

        // �̶���߻��ұ�
        if (item.hasClass("ks-waterfall-fixed-left")) {
            col = 0;
        } else if (item.hasClass("ks-waterfall-fixed-right")) {
            col = curColCount > 0 ? curColCount - 1 : 0;
        } else {
            // �����ҵ���̵���
            for (var i = 0; i < curColCount; i++) {
                if (curColHeights[i] < guard) {
                    guard = curColHeights[i];
                    col = i;
                }
            }
        }

        // Ԫ�ر��ּ�����䣬����
        margin = align === 'left' ? 0 :
            Math.max(containerRegion.width -
                curColCount * colWidth, 0);

        if (align === 'center') {
            margin /= 2;
        }

        if (align === 'justify' && curColCount > 1) {
            margin = col > 0 ? Math.max(
                (containerRegion.width - colWidth) / (curColCount - 1) - colWidth,
                0) * col : 0;
        }

        colProp = {
            // Ԫ�ؼ�̶�����õ�
            left: col * colWidth + margin,
            top: curColHeights[col]
        };

        function end(ifNotCall) {
            // ���뵽 dom ������ȡ�ø߶�
            curColHeights[col] += item.outerHeight(true);
            var colItems = self._colItems;
            colItems[col] = colItems[col] || [];
            colItems[col].push(item);
            item.attr("data-waterfall-col", col);
            var className = item[0].className
                .replace(/\s*ks-waterfall-col-(?:first|last|\d+)/g, "");
            className += " ks-waterfall-col-" + col;
            if (col == 0) {
                className += " ks-waterfall-col-first";
            } else if (col == curColHeights.length - 1) {
                className += " ks-waterfall-col-last";
            }
            item[0].className = className;
            if (!ifNotCall) {
                callback && callback();
            }
        }


        /*
         ����������ͼ���
         */
        if (add) {
            // ��ʼ��Ҫ��������ô�Ȱ�͸���Ȼ��� 0
            item.css(colProp);
            if (effect && effect.effect) {
                // has layout to allow to compute height
                item.css("visibility", "hidden");
            }
            container.append(item);
            end();
        }
        // �����������Ҫ����
        else {
            var adjustEffect = self.get("adjustEffect");
            if (adjustEffect) {
                end(1);
                item.animate(colProp, adjustEffect.duration,
                    adjustEffect.easing, callback);
            } else {
                item.css(colProp);
                end();
            }
        }


        return item;
    }

    function addItem(itemRaw) {
        var self = this,
        // update curColHeights first
        // because may slideDown to affect height
            item = adjustItemAction(self, true, itemRaw),
            effect = self.get("effect");
        // then animate
        if (item && effect && effect.effect) {
            // �����ز��ܵ��� fadeIn slideDown
            item.hide();
            item.css("visibility", "");
            item[effect.effect](
                effect.duration,
                0,
                effect.easing
            );
        }
    }

    S.extend(Waterfall, Base, {
        /**
         * Whether is adjusting waterfall items.
         * @return Boolean
         */
        isAdjusting: function () {
            return !!this._adjuster;
        },

        /**
         * Whether is adding waterfall item.
         * @return Boolean
         */
        'isAdding': function () {
            return !!this._adder;
        },

        /**
         * Adjust the height of one specified item.
         * @param {KISSY.NodeList} item Waterfall item to be adjusted.
         * @param {Object} cfg Config object.
         * @param {Function} cfg.callback Callback function after the item is adjusted.
         * @param {Function} cfg.process Adjust logic function.
         * If returns a number, it is used as item height after adjust.
         * else use item.outerHeight(true) as item height after adjust.
         * @param {Object} cfg.effect Same as {@link KISSY.Waterfall#adjustEffect}
         * @param {Number} cfg.effect.duration
         * @param {String} cfg.effect.easing
         */
        adjustItem: function (item, cfg) {
            var self = this;
            cfg = cfg || {};

            if (self.isAdjusting()) {
                return undefined;
            }

            var originalOuterHeight = item['outerHeight'](true),
                outerHeight;

            if (cfg.process) {
                outerHeight = cfg.process.call(self);
            }

            if (outerHeight === undefined) {
                outerHeight = item['outerHeight'](true);
            }

            var diff = outerHeight - originalOuterHeight,
                curColHeights = self._curColHeights,
                col = parseInt(item['attr']("data-waterfall-col")),
                colItems = self._colItems[col],
                items = [],
                original = Math.max.apply(Math, curColHeights),
                now;

            for (var i = 0; i < colItems.length; i++) {
                if (colItems[i][0] === item[0]) {
                    break;
                }
            }

            i++;

            while (i < colItems.length) {
                items.push(colItems[i]);
                i++;
            }

            curColHeights[col] += diff;

            now = Math.max.apply(Math, curColHeights);

            if (now != original) {
                self.get("container").height(now);
            }

            var effect = cfg.effect,
                num = items.length;

            if (!num) {
                return cfg.callback && cfg.callback.call(self);
            }

            function check() {
                num--;
                if (num <= 0) {
                    self._adjuster = 0;
                    cfg.callback && cfg.callback.call(self);
                }
            }

            if (effect === /**
             @ignore
             @type String
             */undefined) {
                effect = self.get("adjustEffect");
            }

            self._adjuster = timedChunk(items, function (item) {
                if (effect) {
                    item.animate({
                            top: parseInt(item.css("top")) + diff
                        },
                        effect.duration,
                        effect.easing,
                        check);
                } else {
                    item.css("top", parseInt(item.css("top")) + diff);
                    check();
                }
            });

            self._adjuster.start();

            return self._adjuster;
        },

        /**
         * Remove a waterfall item.
         * @param {KISSY.NodeList} item Waterfall item to be removed.
         * @param {Object} cfg Config object.
         * @param {Function} cfg.callback Callback function to be called after remove.
         * @param {Object} cfg.effect Same as {@link KISSY.Waterfall#adjustEffect}
         * @param {Number} cfg.effect.duration
         * @param {String} cfg.effect.easing
         */
        removeItem: function (item, cfg) {
            cfg = cfg || {};
            var self = this,
                callback = cfg.callback;
            self.adjustItem(item, S.mix(cfg, {
                process: function () {
                    item['remove']();
                    return 0;
                },
                callback: function () {
                    var col = parseInt(item['attr']("data-waterfall-col")),
                        colItems = self._colItems[col];
                    for (var i = 0; i < colItems.length; i++) {
                        if (colItems[i][0] == item[0]) {
                            colItems.splice(i, 1);
                            break;
                        }
                    }
                    callback && callback();
                }
            }));
        },

        /**
         * Readjust existing waterfall item.
         * @param {Function} [callback]
         * Callback function to be called after adjust.
         */
        adjust: function (callback) {

            //return;

            var self = this,
                items = self.get("container").all(".ks-waterfall");
            /* ���ڼӣ�ֱ�ӿ�ʼ��ε�����ʣ��ļӺ����ڵ�����һ���� */
            /* ���ڵ����У�ȡ���ϴε�������ʼ��ε��� */
            if (self.isAdjusting()) {
                self._adjuster.stop();
                self._adjuster = 0;
            }
            /*����������ȵ���Ϣ*/
            recalculate.call(self);
            var num = items.length;

            function check() {
                num--;
                if (num <= 0) {
                    self.get("container").height(Math.max.apply(Math, self._curColHeights));
                    self._adjuster = 0;
                    callback && callback.call(self);
                    self.fire('adjustComplete', {
                        items: items
                    });
                }
            }

            if (!num) {
                return callback && callback.call(self);
            }

            self._adjuster = timedChunk(items, function (item) {
                adjustItemAction(self, false, item, check);
            });

            self._adjuster.start();

            return self._adjuster;
        },

        /**
         * Add array of waterfall items to current instance.
         * @param {NodeList[]} items Waterfall items to be added.
         * @param {Function} [callback] Callback function to be called after waterfall items are added.
         */
        addItems: function (items, callback) {
            var self = this;

            /* ���ڵ����У�ֱ����μӣ��͵����Ľڵ�һ���� */
            /* ���ڼӣ�ֱ����μӣ�һ���� */
            self._adder = timedChunk(items,
                addItem,
                self,
                function () {
                    self.get("container").height(Math.max.apply(Math,
                        self._curColHeights));
                    self._adder = 0;
                    callback && callback.call(self);
                    self.fire('addComplete', {
                        items: items
                    });
                });

            self._adder.start();

            return self._adder;
        },

        /**
         * Destroy current instance.
         */
        destroy: function () {
            var self = this;
            var onResize = self.__onResize;
            $(win).detach("resize", onResize);
            onResize.stop();

            self.fire('destroy');
            self.__destroyed = 1;
        }
    });


    return Waterfall;

}, {
    requires: ['node', 'base']
});
/**
 * @ignore
 *
 * 2012-07-10
 *  - ע��������� ie �µ��µ����µ���
 *  - timeChunk ��һ�β� setTimeout
 *
 * 2012-03-21 yiminghe@gmail.com
 *  - ���Ӷ�����Ч
 *  - ����ɾ��/�����ӿ�
 **//**
 * @ignore
 * Dynamic load waterfall items by monitor window scroll.
 * @author yiminghe@gmail.com
 */
KISSY.add("waterfall/loader", function (S, Node, Waterfall) {

    var $ = Node.all,
        win = S.Env.host,
    // > timeChunk interval to allow adjust first
        SCROLL_TIMER = 50;

    /**
     * @class KISSY.Waterfall.Loader
     * @extends KISSY.Waterfall
     * Dynamic load waterfall items by monitoring window scroll.
     */
    function Loader() {
        var self = this;
        Loader.superclass.constructor.apply(self, arguments);
        self.__onScroll = S.buffer(doScroll, SCROLL_TIMER, self);
        self.start();
    }

    function doScroll() {
        var self = this;

        if (self.__loading) {
            return;
        }
        // ������ڵ����У��Ȼ��ٿ�
        // �����еĸ߶Ȳ�ȷ�������ڲ��ʺ��ж��Ƿ��˼��������ݵ�����
        if (self.isAdjusting()) {
            // ǡ�� __onScroll �� buffered . :)
            self.__onScroll();
            return;
        }
        var container = self.get("container");
        // in case container is display none
        if (!container[0].offsetWidth) {
            return;
        }
        var colHeight = container.offset().top,
            diff = self.get("diff"),
            curColHeights = self._curColHeights;
        // �ҵ���С�и߶�
        if (curColHeights.length) {
            colHeight += Math.min.apply(Math, curColHeights);
        }
        // ��̬��
        // ��С�߶�(���û�������)����Ԥ������
        if (diff + $(win).scrollTop() + $(win).height() >= colHeight) {

            loadData.call(self);
        }
    }

    function loadData() {
        var self = this,
            container = self.get("container");

        self.__loading = 1;

        var load = self.get("load");

        load && load(success, end);

        function success(items, callback) {
            self.__loading = 0;
            self.addItems(items, function () {
                callback && callback.apply(this, arguments);
                // �����겻��һ���ٴμ��
                doScroll.call(self);
            });
        }

        function end() {
            self.end();
        }
    }

    Loader.ATTRS = {
        /**
         * Preload distance below viewport.
         * Defaults to: 0.
         * @cfg {Number} diff
         */
        /**
         * @ignore
         */
        diff: {
            value: 0
        }
    };


    S.extend(Loader, Waterfall, {

        /**
         * @ignore
         */
        start: function () {
            this.resume();
        },

        /**
         * @ignore
         */
        end: function () {
            this.pause();
        },

        /**
         * Stop monitor scroll on window.
         */
        pause: function () {
            var self = this;
            if (self.__destroyed) {
                return;
            }
            $(win).detach("scroll", self.__onScroll);
            self.__onScroll.stop();
        },

        /**
         * Start monitor scroll on window.
         */
        resume: function () {
            var self = this;
            if (self.__destroyed) {
                return;
            }
            $(win).on("scroll", self.__onScroll);
            self.__started = 1;
            // ��ʼ��ʱ�������һ�Σ�����Ҫ�ȳ�ʼ�� adjust ��ɺ�.
            doScroll.call(self);
        },

        /**
         * Destroy this instance.
         */
        destroy: function () {
            var self = this;
            self.end();
            Loader.superclass.destroy.apply(self, arguments);
        }
    });

    return Loader;

}, {
    requires: ['node', './base']
});/**
 * @ignore
 * waterfall
 * @author yiminghe@gmail.com
 */
KISSY.add("waterfall", function (S, Waterfall, Loader) {
    Waterfall.Loader = Loader;
    return Waterfall;
}, {
    requires:['waterfall/base', 'waterfall/loader']
});