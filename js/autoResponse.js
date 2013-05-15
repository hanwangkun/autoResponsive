/**
 * @Description:    网页自适应布局，默认配置
 * @Author:         dafeng.xdf[at]taobao.com
 * @Date:           2013.3.5
 * @Todo:
 */
;KISSY.add('gallery/autoResponse/1.0/config',function(){
    "use strict";
    var EMPTY = '';
    function config(){
        return {
            container:{value:EMPTY},
            selector:{value:EMPTY},
            filter:{value:EMPTY},
            fixedSelector:{value:EMPTY},
            priority:{value:EMPTY},
            colWidth:{value:10},
            colMargin:{value:{x:0,y:0}},
            animate:{value:'on'},
            duration:{value:1},
            easing:{value:'easeNone'},
            direction:{value:'left'},
            random:{value:'off'},
            sort:{value:EMPTY},
            layout:{value:EMPTY},
            drag:{value:'off'},
            autoHeight:{value:'on'},
            resize:{value:'on'}
        };
    }
    return config;
});
/**
 * @Description:    网页自适应布局
 * @Author:         dafeng.xdf[at]taobao.com
 * @Date:           2013.3.5
 * @Todo:
 *                  7.支持动画效果和barrel
 *                  8.固定位置
 */
;KISSY.add('gallery/autoResponse/1.0/base',function(S,config,xdfSort,Base){
    "use strict";
    var D = S.DOM,E = S.Event,win = window;
    /**
     * @name autoResponse
     * @class 自适应布局
     * @constructor
     * @extends Base
     */

    function autoResponse() {
        var self = this;
        autoResponse.superclass.constructor.apply(self,arguments);
        self._init();
    };
    /**
     * autoResponse class
     * cfg
     */
    S.extend(autoResponse, Base, {
        _init:function(){
            var self = this;
            self.render();
            self._bindEvent();
        },
        render:function(){
            var self = this,
                userCfg = new config();
            S.each(userCfg,function(i,key){
                userCfg[key] = self.get(key);
            });
            S.each(arguments,function(i){
                S.each(i,function(j,_key){
                    userCfg[_key] = j;
                });
            });
            new xdfSort(userCfg,self);
        },
        _bind:function(handle){
            var self = this;
            if(self.get('resize') !='on'){
                return;
            }
            E.on(win,'resize',function(){
                handle.call(self);
            });
        },
        _bindEvent:function(){
            var self = this;
            self._bind(S.throttle(function(){
                self.render();
            }, 100, self));
        },
        adjust:function(){
            var self = this;
            self.render();
        },
        priority:function(selector){
            var self = this;
            self.render({
                priority:selector
            });
        },
        filter:function(selector){
            var self = this;
            self.render({
                filter:selector
            });
        },
        margin:function(margin){
            var self = this;
            self.render({
                colMargin:margin
            });
        },
        direction:function(direction){
            var self = this;
            self.render({
                direction:direction
            });
        },
        random:function(){
            var self = this;
            self.render({
                random:'on'
            });
        },
        option:function(option){
            var self = this;
            self.render(option);
        },
        append:function(node){
            var self = this;
            D.append(node,self.get('container'));
            self.render();
        },
        prepend:function(node){
            var self = this;
            D.prepend(node,self.get('container'));
            self.render();
        }
    },{ ATTRS : new config()});
    return autoResponse;
},{requires:['./config','./xdfSort','base','dom','event']});
/**
 * @Description:    计算排序
 * @Author:         dafeng.xdf[at]taobao.com
 * @Date:           2013.3.5
 * @Todo:           xdfSort
 */
;KISSY.add('gallery/autoResponse/1.0/xdfSort',function(S,autoAnim,linkedList){
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
     * @name autoResponse
     * @class 自适应布局
     * @constructor
     * @extends Base
     */
    function xdfSort(cfg,_self) {
        var self = this;
        S.mix(self,S.merge(cfg,{
            _self: _self
        }));
        self._init();
    };
    /**
     * autoResponse class
     * cfg
     */
    S.augment(xdfSort, {
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
            new autoAnim({
                elm : elm,
                x : coordinate[0],
                y : coordinate[1],
                animate: self.animate,
                duration : self.duration,
                easing : self.easing,
                direction : self.direction
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
            /*
             * 遍历计算各个坐标
             */
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
            console.log(curQuery)
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
        /*
         * 获取列数组，暂时线性划分
         */
        _getCols:function(){
            var self = this,
                curQuery = new linkedList();
            for(var i = 0; i < Math.ceil(D.outerWidth(self.container)/self.colWidth);i++){
                curQuery.add(0);
            }
            return curQuery;
        },
        /*
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
        /*
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
        /*
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
    return xdfSort;
},{requires:['./anim','./linkedList','dom','event','dd']});
/**
 * @Description: 兼容css3和低版本浏览器动画效果
 * @Author:      dafeng.xdf[at]taobao.com
 * @Date:        2013.3.5
 */
;KISSY.add('gallery/autoResponse/1.0/anim',function(S){
    "use strict";
    var D = S.DOM, Anim = S.Anim,
        notSupport = S.UA.ie < 11;
    function autoAnim(cfg){
        var self = this;
        S.mix(self,cfg);
        self._init();
    };
    S.augment(autoAnim,{
        _init:function(){
            var self = this;
            if(self.animate == 'off'){
                self.noneAnim();
                return;
            }
            notSupport || self.direction == 'right' || self.drag == 'on' ? self.fixedAnim() : self.css3Anim();
        },
        cssPrefixes:function(styleKey,styleValue){
            var fixedRule = {};
            S.each('-webkit- -moz- -o- -ms-  '.split(' '),function(i){
                fixedRule[i+styleKey] = styleValue;
            });
            return fixedRule;
        },
        css3Anim:function(){
            var self = this;
            D.css(self.elm, S.merge(
                self.cssPrefixes('transform','translate('+ self.x +'px,'+ self.y +'px)'),
                self.cssPrefixes('transition-duration',self.duration +'s'))
            );
        },
        fixedAnim:function(){
            var self = this,
                cssRules = {'top':self.y},
                direction = 'left';
            if(self.direction == 'right'){
                direction = 'right';
            }
            cssRules[direction] = self.x;
            new Anim(self.elm,cssRules,self.duration,self.easing).run();
        },
        noneAnim:function(){
            var self = this;
            D.css(self.elm,{
                left: self.left,
                top: self.top
            });
        }
    });
    return autoAnim;
},{requires:['dom','anim']});
/**
 * @Description: 动画效果
 * @Author:      dafeng.xdf[at]taobao.com
 * @Date:        2013.3.5
 */
;KISSY.add('gallery/autoResponse/1.0/effect',function(S){
    "use strict";
    var D = S.DOM, Anim = S.Anim,
        notSupport = S.UA.ie < 11;

    function effect(cfg){

        var self = this;

        S.mix(self,cfg);

        self._init();

    };
    S.augment(effect,{

        _init:function(){

            var self = this;

            if(self.animate == 'off'){

                self.noneAnim();

                return;
            }

        }
    });
    return effect;
},{requires:['dom','anim']});
/**
 * @Description:    网页自适应布局
 * @Author:         dafeng.xdf[at]taobao.com
 * @Date:           2013.3.5
 * @Todo:           1.hash回溯  add方式
 */
;KISSY.add('gallery/autoResponse/1.0/hash',function(S){
    "use strict";
    var D = S.DOM, E = S.Event,
        EMPTY = '';
    /**
     * @name hash
     * @class 自适应布局
     * @constructor
     */
    function hash() {

        var self = this;

        self._init();

    };
    /**
     */
    S.augment(hash, {

        _init:function(){


        }

    });
    return hash;
});
/**
 * @Description: 为了灵活操作方便，集成一个双向链表
 * @Author:      dafeng.xdf[at]taobao.com
 * @Date:        2013.3.5
 */
;KISSY.add('gallery/autoResponse/1.0/linkedList',function(S){
    "use strict";
    function linkedList(){
        this.length = 0;
        this.head = null;
        this.tail = null;
    }
    S.augment(linkedList,{
        add:function(value){
            var node = {
                value:value,
                next:null,   //前驱
                prev:null    //后继
            };
            if(this.length == 0){
                this.head = this.tail = node;
            }else{
                this.tail.next = node;
                node.prev = this.tail;
                this.tail = node;
            }
            this.length ++;
        },
        remove:function(index){
            if ( index > this.length - 1 || index < 0 ) {
                return null;
            }
            var node = this.head,
                i = 0;
            if (index == 0) {
                this.head = node.next;
                if (this.head == null) {
                    this.tail = null;
                }
                else {
                    this.head.previous = null;
                }
            }
            else if (index == this.length - 1) {
                node = this.tail;
                this.tail = node.prev;
                this.tail.next = null;
            }
            else {
                while (i++ < index) {
                    node = node.next;
                }
                node.prev.next = node.next;
                node.next.prev = node.prev;
            }
            this.length --;
        },
        get:function(index){
            return this.node(index).value;
        },
        node:function(index){
            if (index > this.length - 1 || index < 0 ) {
                return null;
            }
            var node = this.head,
                i = 0;
            while (i++ < index) {
                node = node.next;
            }
            return node;
        },
        update:function(index,value){
            this.node(index).value = value;
        }
    });
    return linkedList;
});
;KISSY.add('gallery/autoResponse/1.0/index',function(S,autoResponse){
    return autoResponse;
},{requires:['./base','./hash']});