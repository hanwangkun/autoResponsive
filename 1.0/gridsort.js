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
    function GridSort(cfg, _self) {
        var self = this;
        S.mix(self, S.merge(cfg, {
            _self: _self
        }));
        self.doneQuery = [];
        self._init();
    }
    S.augment(GridSort, {
        _init: function () {
            var self = this;
            var items = S.query(self.selector, self.container);
            switch (self.layout) {
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
            var self = this;
            if (self.filter == EMPTY) {
                return;
            }
            ;
            D.show(elm);
            if (D.hasClass(elm, self.filter)) {
                D.hide(elm);
                return true;
            }
            ;
        },
        coordinate: function (curQuery, elm) {
            return this._autoFit(curQuery, D.outerWidth(elm), D.outerHeight(elm));
        },
        callAnim: function (elm, coordinate) {
            var self = this;
            new AutoAnim({
                elm: elm,
                x: coordinate[0],
                y: coordinate[1],
                animate: self.animate,
                duration: self.duration,
                easing: self.easing,
                direction: self.direction,
                frame: self._self.frame,
                _self: self._self
            });
        },
        _cache: function (elm) {
            var self = this, isCache = false;
            if (self.priority == EMPTY) {
                return  isCache;
            }
            if (!self.cacheQuery) {
                self.cacheQuery = [];
            }
            if (!D.hasClass(elm, self.priority)) {
                isCache = true;
                self.cacheQuery.push(elm);
            }
            return isCache;
        },
        /**
         * 清除缓存
         * 记录全局缓存
         */
        clearCache: function (curQuery, _items) {
            var self = this;
            if (self.cacheQuery) {
                self.cacheQuery = [];
            }
            self._self.curQuery = curQuery;
            self._self.itemLength = _items.length;
        },
        asyncize: function (handle) {
            var self = this;
            if (self._self.get('async')) {
                setTimeout(function () {
                    handle.call(self);
                }, 0);
            } else {
                handle.call(self);
            }
        },
        _gridSort: function (_items) {
            var self = this,
                _maxHeight = 0,
                curQuery = self._getCols();
            /**
             * 设置关键帧
             */
            self._setFrame();
            if (self.random) {
                _items = _items.shuffle();
            }
            /**
             * 排序之前触发beforeSort
             */
            self._self.fire('beforeSort', {
                autoResponsive: {
                    elms: _items
                }
            });
            S.each(_items, function (i, _key) {
                if (self.cache && _key < self._self.itemLength) {
                    return;
                }
                if (self._filter(i)) {
                    return;
                }
                if (self._cache(i)) {
                    return;
                }
                /**
                 * 遍历单个元素之前触发
                 */
                self._self.fire('beforeElemSort', {
                    autoResponsive: {
                        elm: i,
                        frame: self._self.frame
                    }
                });
                var coordinate = self.coordinate(curQuery, i);
                if (_maxHeight < coordinate[1] + D.outerHeight(i)) {
                    _maxHeight = coordinate[1] + D.outerHeight(i);
                }
                /**
                 * 调用动画
                 */
                self.asyncize(function () {
                    self.callAnim(i, coordinate);
                });
            });
            S.each(self.cacheQuery, function (i) {
                /**
                 * 遍历单个元素之后触发
                 */
                self._self.fire('beforeElemSort', {
                    autoResponsive: {
                        elm: i,
                        frame: self._self.frame
                    }
                });
                var coordinate = self.coordinate(curQuery, i);
                if (_maxHeight < coordinate[1] + D.outerHeight(i)) {
                    _maxHeight = coordinate[1] + D.outerHeight(i);
                }
                self.asyncize(function () {
                    self.callAnim(i, coordinate);
                });
            });
            /**
             * 清空缓存队列
             */
            self.clearCache(curQuery, _items);
            /**
             * 排序之后触发
             */
            self._self.fire('afterSort', {
                autoResponsive: {
                    elms: _items,
                    height: self._getMinMaxHeight(),
                    frame: self._self.frame
                }
            });
            self.setHeight(_maxHeight);
        },
        _getMinMaxHeight:function(){
            var self = this;
            return self.doneQuery;
        },
        _setFrame: function () {
            var self = this;
            self._self.frame++;
        },
        _cellSort: function (_items) {
            var self = this,
                _maxHeight = 0,
                _row = 0,
                curQuery = [];
            S.each(_items, function (i, key) {
                S.log('star from here!');
                curQuery.push(self._getCells());
                //self.callAnim(i,coordinate);
            });
        },
        _getCells: function () {
            return this._getCols();
        },
        _getCols: function () {
            var self = this;
            if (self._self.curQuery && self.cache) {
                return self._self.curQuery;
            } else {
                var curQuery = new LinkedList({});
                for (var i = 0; i < Math.ceil(D.outerWidth(self.container) / self.colWidth); i++) {
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
            S.each(_curQuery, function (i, key) {
                var _query = [];
                if (key + _num >= _curQuery.length) {
                    return;
                }
                for (var j = key; j < key + _num; j++) {
                    _query.push(curQuery.get(j));
                }
                if (cur[1] > Math.max.apply(Math, _query)) {
                    cur = [key, Math.max.apply(Math, _query)];
                }
            });
            return cur;
        },
        /**
         * 返回x，y轴坐标
         */
        _autoFit: function (curQuery, cW, cH) {
            var self = this,
                _num = Math.ceil((cW + self.colMargin.x) / self.colWidth),
                cur = self._getCur(_num, curQuery);
            for (var i = cur[0]; i < _num + cur[0]; i++) {
                curQuery.update(i, cur[1] + cH + self.colMargin.y);
            }
            self.doneQuery.push(cur[1] + cH + self.colMargin.y);
            return [cur[0] * self.colWidth + self.colMargin.x, cur[1] + self.colMargin.y];
        },
        /**
         * 设置容器高度
         */
        setHeight: function (height) {
            var self = this;
            if (!self.autoHeight) {
                return;
            }
            D.height(self.container, height + self.colMargin.y);
        }
    });
    return GridSort;
}, {requires: ['./anim', './linkedlist', 'dom']});