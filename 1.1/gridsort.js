/**
 * @Description:    计算排序
 * @Author:         dafeng.xdf[at]taobao.com
 * @Date:           2013.3.5
 * @Todo:           gridSort
 */
KISSY.add(function (S, AutoAnim, LinkedList) {
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
            self._maxHeight = 0;
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