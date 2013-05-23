/**
 * @Description:    计算排序
 * @Author:         dafeng.xdf[at]taobao.com
 * @Date:           2013.3.5
 * @Todo:           gridSort
 */
;KISSY.add(function(S,AutoAnim,LinkedList){
    "use strict";
    var D = S.DOM,EMPTY = '' ,DD = S.DD,
        DraggableDelegate = DD.DraggableDelegate,
        Droppable = DD.Droppable;
    S.augment(Array,{
        shuffle:function(){
            for(var j, x, i = this.length;
                i;
                j = parseInt(Math.random() * i), x = this[--i], this[i] = this[j], this[j] = x);
            return this;
        }
    });
    /**
     * @name GridSort
     * @class 栅格布局算法
     */
    function GridSort(cfg,_self) {
        var self = this;
        S.mix(self,S.merge(cfg,{
            _self: _self
        }));
        self._init();
    };
    S.augment(GridSort, {
        _init:function(){
            var self = this,
                items = S.query(self.selector,self.container);
            switch (self.layout){
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
        _filter:function(elm){
            var self = this;
            D.show(elm);
            if(D.hasClass(elm,self.filter)){
                D.hide(elm);
                return  true;
            }
        },
        coordinate:function(curQuery,elm){
            return this._autoFit(curQuery,D.outerWidth(elm),D.outerHeight(elm));
        },
        callAnim:function(elm,coordinate){
            var self = this;
            new AutoAnim({
                elm : elm,
                x : coordinate[0],
                y : coordinate[1],
                animate: self.animate,
                duration : self.duration,
                easing : self.easing,
                direction : self.direction,
                effect:self.effect,
                frame:self._self.frame
            });
        },
        _cache:function(elm){
            var self = this,isCache = false;
            if(self.priority == EMPTY){
                return  isCache;
            }
            !self.cacheQuery && S.mix(self,{
                cacheQuery :[]
            });
            if(!D.hasClass(elm,self.priority)){
                isCache =  true;
                self.cacheQuery.push(elm);
            }
            return isCache;
        },
        _gridSort:function(_items){
            var self = this,
                _maxHeight = 0,
                curQuery = self._getCols();
            self._setFrame();
            if(self.random == 'on'){
                _items = _items.shuffle();
            }
            S.each(_items,function(i){
                if(self._filter(i)){
                    return;
                }
                if(self._cache(i)){
                    return;
                }
                var coordinate = self.coordinate(curQuery,i);
                if(_maxHeight<coordinate[1]+ D.outerHeight(i)){
                    _maxHeight = coordinate[1]+D.outerHeight(i);
                }
                self.callAnim(i,coordinate);
                self._bindDrop(i);
            });
            S.each(self.cacheQuery,function(i){
                var coordinate = self.coordinate(curQuery,i);
                if(_maxHeight<coordinate[1]+ D.outerHeight(i)){
                    _maxHeight = coordinate[1]+D.outerHeight(i);
                }
                self.callAnim(i,coordinate);
                self._bindDrop(i);
            });
            self._bindBrag();
            self.setHeight(_maxHeight);
        },
        _setFrame:function(){
            var self = this;
            self._self.frame ++;
        },
        _cellSort:function(_items){
            var self = this,
                _maxHeight = 0,
                _row = 0,
                curQuery = [];
            S.each(_items,function(i,key){

                S.log('star from here!');

                curQuery.push(self._getCells());
                //self.callAnim(i,coordinate);
            });
        },
        _getCells:function(){
            return this._getCols();
        },
        _bindDrop:function(elm){
            var self =this;
            if(self.drag != 'on'){
                return;
            }
            new Droppable({
                node: elm
            }).on("dropenter",function(ev){
                    D.insertAfter( ev.drag.get("node"), ev.drop.get("node"));
                    self._self.render();
                });
        },
        _bindBrag:function(){
            var self = this;
            if(self.drag != 'on'){
                return;
            }
            new DraggableDelegate({
                container:self.container,
                selector:self.selector,
                move:true
            }).on('dragstart',function(ev){
                    var _target = ev.drag.get("node")[0];
                    this.p = {
                        left : _target.offsetLeft,
                        top : _target.offsetTop
                    };
                }).on('drag',function(){
                }).on('dragend',function(ev){
                    D.css(ev.drag.get("node"),this.p);
                });
        },
        _getCols:function(){
            var self = this,
                curQuery = new LinkedList();
            for(var i = 0; i < Math.ceil(D.outerWidth(self.container)/self.colWidth);i++){
                curQuery.add(0);
            }
            return curQuery;
        },
        /**
         * 获取当前指针
         */
        _getCur:function(_num,curQuery){
            var cur = [null,Infinity];
            S.each(curQuery,function(i,key){
                var  _query = [];
                if(key + _num >= curQuery.length){
                    return;
                }
                for(var j = key; j < key+_num; j++){
                    _query.push(curQuery.get(j));
                }
                if(cur[1] > Math.max.apply(Math,_query)){
                    cur = [key,Math.max.apply(Math,_query)];
                }
            })
            return cur;
        },
        /**
         * 返回x，y轴坐标
         */
        _autoFit:function(curQuery,cW,cH){
            var self = this,
                _num = Math.ceil((cW+self.colMargin.x) / self.colWidth),
                cur = self._getCur(_num,curQuery);
            for(var i = cur[0]; i < _num+cur[0]; i++){
                curQuery.update(i,cur[1] + cH + self.colMargin.y);
            }
            return [cur[0]*self.colWidth+self.colMargin.x,cur[1]+self.colMargin.y];
        },
        /**
         * 设置容器高度
         */
        setHeight:function(height){
            var self = this;
            if(self.autoHeight!='on'){
                return;
            }
            D.height(self.container,height+self.colMargin.y);
        }
    });
    return GridSort;
},{requires:['./anim','./linkedlist','dom','event','dd']});