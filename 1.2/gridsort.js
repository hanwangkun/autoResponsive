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

            if (cfg.random) {
                items = items.shuffle();
            }

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
                isRecountUnitWH = cfg.isRecountUnitWH;

            if (isRecountUnitWH || !elm.__width) {
                elm.__width = D.outerWidth(elm);
                elm.__height = D.outerHeight(elm);
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
            _position = [cur[0] * cfg.gridWidth + cfg.unitMargin.x, cur[1] + cfg.unitMargin.y];
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
                i = 0, idx = 0;

            for (var len = curQuery.size(); i < len - num + 1; i++) {
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
            cfg.landscapeOrientation ? D.width(cfg.container, height + cfg.unitMargin.x) :D.height(cfg.container, height + cfg.unitMargin.y);
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