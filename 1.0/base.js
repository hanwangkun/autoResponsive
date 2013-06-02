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