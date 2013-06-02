/*
combined files : 

gallery/autoResponsive/1.0/config
gallery/autoResponsive/1.0/anim
gallery/autoResponsive/1.0/linkedlist
gallery/autoResponsive/1.0/gridsort
gallery/autoResponsive/1.0/base
gallery/autoResponsive/1.0/plugin/hash
gallery/autoResponsive/1.0/plugin/drag
gallery/autoResponsive/1.0/index

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
     * @param {Boolean} autoHeight  容器高度自适应开关
     * @param {Boolean} async       动画队列异步开关
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
            animate:{value:true},
            duration:{value:1},
            easing:{value:'easeNone'},
            direction:{value:'left'},
            random:{value:false},
            sort:{value:EMPTY},
            layout:{value:EMPTY},
            autoHeight:{value:true},
            resize:{value:true},
            init:{value:true},
            plugin:{value:[]},
            async:{value:false}
        };
    }
    return Config;
});
/**
 * @Description: 兼容css3和低版本浏览器动画效果
 * @Author:      dafeng.xdf[at]taobao.com
 * @Date:        2013.3.5
 */
;KISSY.add('gallery/autoResponsive/1.0/anim',function(S){
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
            if(!self.animate){
                self.noneAnim();
                return;
            }
            notSupport || self.direction == 'right' ? self.fixedAnim() : self.css3Anim();
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
            D.css(self.elm, S.merge(
                self.cssPrefixes('transform','translate('+ self.x +'px,'+ self.y +'px) '),
                self.cssPrefixes('transition-duration',self.duration +'s'))
            );
            /**
             * 单元素计算排序后触发
             */
            self._self.fire('afterElemSort',{
                autoResponsive:{
                    elm:self.elm,
                    position:{
                        x:self.x,
                        y:self.y
                    },
                    frame:self._self.frame
                }
            });
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
            new Anim(self.elm,cssRules,self.duration,self.easing,function(){
                /**
                 * 单元素计算排序后触发
                 */
                self._self.fire('afterElemSort',{
                    autoResponsive:{
                        elm:self.elm,
                        position:{
                            x:self.x,
                            y:self.y
                        },
                        frame:self._self.frame
                    }
                });
            }).run();
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
            /**
             * 单元素计算排序后触发
             */
            self._self.fire('afterElemSort',{
                autoResponsive:{
                    elm:self.elm,
                    position:{
                        x:self.x,
                        y:self.y
                    },
                    frame:self._self.frame
                }
            });
        }
    });
    return AutoAnim;
},{requires:['dom','anim']});
/**
 * @Description: 集成一个双向链表方便操作
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
    function LinkedList(cfg){
        var self = this;
        self.length = 0;
        self.head = null;
        self.tail = null;
        self.type = cfg.type || 'array';
        self.query = [];
        self.init();
    }
    S.augment(LinkedList,{
        /**
         * 初始化，增加随机序列
         */
        init:function(){
            S.augment(Array,{
                shuffle:function(){
                    for(var j, x, i = this.length;
                        i;
                        j = parseInt(Math.random() * i), x = this[--i], this[i] = this[j], this[j] = x);
                    return this;
                }
            });
        },
        /**
         * 新增节点
         */
        add:function(value){
            var self = this;
            if(self.type === 'array'){
                self.query.push(value);
                return;
            }
            var node = {
                value:value,
                next:null,//前驱
                prev:null//后继
            };
            if(self.length == 0){
                self.head = self.tail = node;
            }else{
                self.tail.next = node;
                node.prev = self.tail;
                self.tail = node;
            }
            self.length ++;
        },
        /**
         * 删除节点
         */
        remove:function(index){
            var self = this;
            if ( index > self.length - 1 || index < 0 ) {
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
            self.length --;
        },
        /**
         * 获取链表值
         */
        get:function(index){
            var self = this;
            if(self.type === 'array'){
                return self.query[index];
            }
            return self.node(index).value;
        },
        /**
         * 返回链表节点
         */
        node:function(index){
            var self = this;
            if (index > self.length - 1 || index < 0 ) {
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
        update:function(index,value){
            var self = this;
            if(self.type === 'array'){
                self.query[index] = value;
                return;
            }
            self.node(index).value = value;
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
    var D = S.DOM,EMPTY = '';
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
            var self = this;
            if(!self.selector){
                S.log('lack selector');
                return;
            }
            var items = S.query(self.selector,self.container);
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
                frame:self._self.frame,
                _self:self._self
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
        asyncize:function(handle){
            var self = this;
            if(self._self.get('async')){
                setTimeout(function(){
                    handle.call(self);
                },0);
            }else{
                handle.call(self);
            }
        },
        _gridSort:function(_items){
            var self = this,
                _maxHeight = 0,
                curQuery = self._getCols();
            self._setFrame();
            if(self.random){
                _items = _items.shuffle();
            }
            /**
             * 排序之前触发beforeSort
             */
            self._self.fire('beforeSort',{
                autoResponsive:{
                    elms:_items
                }});
            S.each(_items,function(i){
                if(self._filter(i)){
                    return;
                }
                if(self._cache(i)){
                    return;
                }
                /**
                 * 遍历单个元素之前触发
                 */
                self._self.fire('beforeElemSort',{
                    autoResponsive:{
                        elm:i,
                        frame:self._self.frame
                    }});
                var coordinate = self.coordinate(curQuery,i);
                if(_maxHeight<coordinate[1]+ D.outerHeight(i)){
                    _maxHeight = coordinate[1]+D.outerHeight(i);
                }

                self.callAnim(i,coordinate);
            });
            S.each(self.cacheQuery,function(i){
                /**
                 * 遍历单个元素之后触发
                 */
                self._self.fire('beforeElemSort',{
                    autoResponsive:{
                        elm:i,
                        frame:self._self.frame
                    }});
                var coordinate = self.coordinate(curQuery,i);
                if(_maxHeight<coordinate[1]+ D.outerHeight(i)){
                    _maxHeight = coordinate[1]+D.outerHeight(i);
                }
                self.asyncize(function(){
                    self.callAnim(i,coordinate);
                });
            });
            /**
             * 排序之后触发
             */
            self._self.fire('afterSort',{
                autoResponsive:{
                    elms:_items
                }});
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
        _getCols:function(){
            var self = this,
                curQuery = new LinkedList({});
            for(var i = 0; i < Math.ceil(D.outerWidth(self.container)/self.colWidth);i++){
                curQuery.add(0);
            }
            return curQuery;
        },
        /**
         * 获取当前指针
         */
        _getCur:function(_num,curQuery){
            var cur = [null,Infinity],
                _curQuery = curQuery.query.length ? curQuery.query : curQuery;
            S.each(_curQuery,function(i,key){
                var  _query = [];
                if(key + _num >= _curQuery.length){
                    return;
                }
                for(var j = key; j < key+_num; j++){
                    _query.push(curQuery.get(j));
                }
                if(cur[1] > Math.max.apply(Math,_query)){
                    cur = [key,Math.max.apply(Math,_query)];
                }
            });
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
            if(!self.autoHeight){
                return;
            }
            D.height(self.container,height+self.colMargin.y);
        }
    });
    return GridSort;
},{requires:['./anim','./linkedlist','dom']});
/**
 * @Description:    网页自适应布局Base
 * @Author:         dafeng.xdf[at]taobao.com
 * @Date:           2013.3.5
 */
;KISSY.add('gallery/autoResponsive/1.0/base',function(S,Config,GridSort,Base){
    "use strict";
    var D = S.DOM,E = S.Event,win = window;
    /**
     * @name AutoResponsive
     * @class 网页自适应布局
     * @constructor
     * @extends Base
     */
    function AutoResponsive() {
        var self = this;
        AutoResponsive.superclass.constructor.apply(self,arguments);
        if(!S.get(self.get('container'))){
            S.log('lack container!');
            return;
        }
        self.fire('beforeInit',{
            autoResponsive:self
        });
        if(self.get('init')){
            self.init();
        }
        self.fire('afterInit',{
            autoResponsive:self
        });
    };
    S.extend(AutoResponsive, Base, {
        /**
         * 初始化组件
         * @return  排序实例
         */
        init:function(){
            var self = this;
            self._bindEvent();
            self.initPlugin();
            self.render();
            S.log('init!');
        },
        initPlugin:function(){
            var self = this;
            self.api = {};
            /**
             * 添加插件
             */
            S.each(self.get('plugin'),function(i){
                i.init(self);
                S.mix(self.api,i.api);
            });
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
            /**
             * 应用插件属性
             */
            S.mix(userCfg,self.api);
            new GridSort(userCfg,self);
        },
        /**
         * 绑定浏览器resize事件
         */
        _bind:function(handle){
            var self = this;
            if(!self.get('resize')){
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
                /**
                 * 浏览器改变触发resize事件
                 */
                self.fire('resize');
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
                random:true
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
    return AutoResponsive;
},{requires:['./config','./gridsort','base','dom','event']});
/**
 * @Description:    hash回溯、功能路由
 * @Author:         dafeng.xdf[at]taobao.com
 * @Date:           2013.3.5
 */
;KISSY.add('gallery/autoResponsive/1.0/plugin/hash',function(S){
    "use strict";
    var E = S.Event,
        win = window,
        AND = '&',
        EQUAL = '=';
    /**
     * @name hash
     * @class 自适应布局
     * @constructor
     */
    function Hash(cfg) {
        var self = this;
        self.prefix = cfg.prefix || 'ks-';
        self.api = {};
    };
    /**
     * 启用插件便开始解析
     */
    S.augment(Hash, {
        init:function(_self){
            var self = this;
            S.log('hash init!');
            if(!self.hasHash()){
                return;
            }
            self.parse();
        },
        hasHash:function(){
            return location.hash ? true : false;
        },
        parse:function(){
            var self = this;
            self.getParam();
        },
        /**
         * 解析hash
         * priority,filter
         */
        getParam:function(){
            var self = this;
            self.hash = location.hash.split(AND);
            S.each(self.hash,function(param){
                self.getPriority(param);
                self.getFilter(param);
            });
        },
        getPriority:function(str){
            var self = this,
                _priority = self.prefix+'priority';
            if(str.indexOf(_priority)!=-1){
                S.mix(self.api,{
                    priority: str.split(EQUAL)[1]
                });
            }
        },
        getFilter:function(str){
            var self = this,
                _filter = self.prefix+'filter';
            if(str.indexOf(_filter)!=-1){
                S.mix(self.api,{
                    filter: str.split(EQUAL)[1]
                });
            }
        }
    });
    return Hash;
},{requires:['event']});
/**
 * @Description:    拖拽功能
 * @Author:         dafeng.xdf[at]taobao.com
 * @Date:           2013.3.5
 */
;KISSY.add('gallery/autoResponsive/1.0/plugin/drag',function(S){
    "use strict";
    var E = S.Event,DD = S.DD,
        DraggableDelegate = DD.DraggableDelegate,
        Droppable = DD.Droppable;;
    /**
     * @name Drag
     * @class 拖拽功能
     * @constructor
     */
    function Drag(cfg) {
    };
    /**
     *
     */
    S.augment(Drag, {
        init:function(){
            var self = this;
            S.log('drag init!');
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
        }
    });
    return Drag;
},{requires:['event','dd']});
/**
 * @Description: 目前先挂载base，effect效果插件，hash插件
 * @Author:      dafeng.xdf[at]taobao.com
 * @Date:        2013.3.5
 */
;KISSY.add('gallery/autoResponsive/1.0/index',function(S,AutoResponsive,Hash,Drag){
    AutoResponsive.Hash = Hash;
    AutoResponsive.Drag = Drag;
    return AutoResponsive;
},{requires:['./base','./plugin/hash','./plugin/drag']});
