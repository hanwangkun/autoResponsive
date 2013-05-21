/*
combined files : 

gallery/autoResponsive/1.0/config
gallery/autoResponsive/1.0/plugin/effect
gallery/autoResponsive/1.0/anim
gallery/autoResponsive/1.0/linkedlist
gallery/autoResponsive/1.0/gridsort
gallery/autoResponsive/1.0/base
gallery/autoResponsive/1.0/plugin/hash
gallery/autoResponse/1.0/index

*/
/**
 * @Description:    网页自适应布局
 * @Author:         dafeng.xdf[at]taobao.com
 * @Date:           2013.3.5
 */
;KISSY.add('gallery/autoResponsive/1.0/config',function(){
    "use strict";
    var EMPTY = '';
    /**
     * @name config
     * @param {String}  container   外层容器
     * @param {String}  selector    生效选择器
     * @param {String}  filter      过滤选择器
     * @param {String}  priority    优先排序选择器
     * @param {Number}  colWidth    最小栅格单元设置px
     * @param {Object}  colMargin   单元格边距设置
     * @param {Boolean} animate     动画效果开关
     * @param {Number}  duration    动画缓动时间
     * @param {String}  easing      动画缓动算子
     * @param {Number}  colWidth    最小栅格单元设置px
     * @param {String}  direction   排序方向,可以选择right
     * @param {Boolean} random      随机顺序开关
     * @param {Boolean} drag        动画缓动算子
     * @param {Boolean} autoHeight  容器高度自适应开关
     */
    function Config(){
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
            resize:{value:'on'},
            effect:{value:'off'}
        };
    }
    return Config;
});
/**
 * @Description: css3动画效果插件
 * @Author:      dafeng.xdf[at]taobao.com
 * @Date:        2013.3.5
 */
;KISSY.add('gallery/autoResponsive/1.0/plugin/effect',function(S){
    "use strict";
    var EMPTY = '';
    function effect(cfg){
        var self = this;
        S.mix(self,cfg);
        self._init();
    };
    S.augment(effect,{
        _init:function(){
            var self = this;
            self.router();
        },
        router:function(){
            var self = this;
            switch (self.effect){
                case 'roll':
                    self.roll();
                    break;
                case 'appear':
                    self.appear();
                    break;
                case 'off':
                default:
                    self.still();
                    break;
            }
        },
        /**
         * 增添二级缓存
         */
        roll:function(){
            var self = this;
            S.mix(self,{
                type:'rotate('+360*self.frame+'deg)'
            });
        },
        appear:function(){
            var self = this;
            S.mix(self,{
                type:'scale(1)'
            });
        },
        still:function(){
            var self = this;
            S.mix(self,{
                type:EMPTY
            })
        }
    });
    return effect;
},{requires:['dom','anim']});
/**
 * @Description: 兼容css3和低版本浏览器动画效果
 * @Author:      dafeng.xdf[at]taobao.com
 * @Date:        2013.3.5
 */
;KISSY.add('gallery/autoResponsive/1.0/anim',function(S,Effect){
    "use strict";
    var D = S.DOM, Anim = S.Anim,BLANK = ' ',
        notSupport = S.UA.ie < 11;
    /**
     * @name AutoAnim
     * @class css动画，采用帧重复
     * @constructor
     */
    function AutoAnim(cfg){
        var self = this;
        S.mix(self,cfg);
        self._init();
    };
    S.augment(AutoAnim,{
        _init:function(){
            var self = this;
            if(self.animate == 'off'){
                self.noneAnim();
                return;
            }
            notSupport || self.direction == 'right' || self.drag == 'on' ? self.fixedAnim() : self.css3Anim();
        },
        /**
         * css3动画
         */
        cssPrefixes:function(styleKey,styleValue){
            var fixedRule = {};
            S.each('-webkit- -moz- -o- -ms-  '.split(BLANK),function(i){
                fixedRule[i+styleKey] = styleValue;
            });
            return fixedRule;
        },
        css3Anim:function(){
            /**
             * css3效果代码添加
             */
            var self = this;
            var _type = new Effect({
                effect:self.effect,
                frame:self.frame
            }).type;
            D.css(self.elm, S.merge(
                self.cssPrefixes('transform','translate('+ self.x +'px,'+ self.y +'px) '+_type),
                self.cssPrefixes('transition-duration',self.duration +'s'))
            );
        },
        /**
         * 降级模拟css3动画
         */
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
        /**
         * 无动画
         */
        noneAnim:function(){
            var self = this;
            D.css(self.elm,{
                left: self.left,
                top: self.top
            });
        }
    });
    return AutoAnim;
},{requires:['./plugin/effect','dom','anim']});
/**
 * @Description: 为了灵活操作方便，集成一个双向链表
 * @Author:      dafeng.xdf[at]taobao.com
 * @Date:        2013.3.5
 */
;KISSY.add('gallery/autoResponsive/1.0/linkedlist',function(S){
    "use strict";
    /**
     * @name LinkedList
     * @class 双向更新链表
     * @constructor
     */
    function LinkedList(){
        this.length = 0;
        this.head = null;
        this.tail = null;
    }
    S.augment(LinkedList,{
        /**
         * 新增节点
         */
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
        /**
         * 删除节点
         */
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
        /**
         * 获取链表值
         */
        get:function(index){
            return this.node(index).value;
        },
        /**
         * 返回链表节点
         */
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
        /**
         * 更新节点值
         */
        update:function(index,value){
            this.node(index).value = value;
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
;KISSY.add('gallery/autoResponsive/1.0/gridsort',function(S,AutoAnim,LinkedList){
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
            console.log(self._self.frame)
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
/**
 * @Description:    网页自适应布局Base
 * @Author:         dafeng.xdf[at]taobao.com
 * @Date:           2013.3.5
 */
;KISSY.add('gallery/autoResponsive/1.0/base',function(S,Config,GridSort,Base){
    "use strict";
    var D = S.DOM,E = S.Event,win = window;
    /**
     * @name AutoResponse
     * @class 网页自适应布局
     * @constructor
     * @extends Base
     */
    function AutoResponse() {
        var self = this;
        AutoResponse.superclass.constructor.apply(self,arguments);
        self._init();
    };
    S.extend(AutoResponse, Base, {
        /**
         * 初始化组件
         * @return  排序实例
         */
        _init:function(){
            var self = this;
            self.render();
            self._bindEvent();
        },
        /**
         * 渲染排序结果
         */
        render:function(){
            var self = this,
                userCfg = new Config();
            self.frame =  self.frame || 0;
            S.each(userCfg,function(i,key){
                userCfg[key] = self.get(key);
            });
            S.each(arguments,function(i){
                S.each(i,function(j,_key){
                    userCfg[_key] = j;
                });
            });
            new GridSort(userCfg,self);
        },
        /**
         * 绑定浏览器resize事件
         */
        _bind:function(handle){
            var self = this;
            if(self.get('resize') !='on'){
                return;
            }
            E.on(win,'resize',function(e){
                handle.call(self);
            });
        },
        /**
         * 添加事件节流阀
         */
        _bindEvent:function(){
            var self = this;
            self._bind(S.throttle(function(){
                self.render();
            }, 200, self));
        },
        /**
         * 重新布局调整
         */
        adjust:function(){
            var self = this;
            self.render();
        },
        /**
         * 优先排序方法
         * @param {String} 选择器
         */
        priority:function(selector){
            var self = this;
            self.render({
                priority:selector
            });
        },
        /**
         * 过滤方法
         * @param {String} 选择器
         */
        filter:function(selector){
            var self = this;
            self.render({
                filter:selector
            });
        },
        /**
         * 调整边距
         * @param {Object} 边距
         */
        margin:function(margin){
            var self = this;
            self.render({
                colMargin:margin
            });
        },
        /**
         * 方向设置
         * @param {String} 方向
         */
        direction:function(direction){
            var self = this;
            self.render({
                direction:direction
            });
        },
        /**
         * 随机排序
         */
        random:function(){
            var self = this;
            self.render({
                random:'on'
            });
        },
        /**
         * 改变组件设置
         * @param {Object} 设置对象
         */
        option:function(option){
            var self = this;
            self.render(option);
        },
        /**
         * dom append 方法
         * @param {Object} 节点对象
         */
        append:function(node){
            var self = this;
            D.append(node,self.get('container'));
            self.render();
        },
        /**
         * dom prepend 方法
         * @param {Object} 节点对象
         */
        prepend:function(node){
            var self = this;
            D.prepend(node,self.get('container'));
            self.render();
        }
    },{ ATTRS : new Config()});
    return AutoResponse;
},{requires:['./config','./gridsort','base','dom','event']});
/**
 * @Description:    hash回溯插件
 * @Author:         dafeng.xdf[at]taobao.com
 * @Date:           2013.3.5
 */
;KISSY.add('gallery/autoResponsive/1.0/plugin/hash',function(S){
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
;KISSY.add('gallery/autoResponse/1.0/index',function(S,AutoResponse){
    return AutoResponse;
},{requires:['./base','./plugin/hash']});
