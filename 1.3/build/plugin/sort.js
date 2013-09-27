/*
combined files : 

gallery/autoResponsive/1.3/plugin/sort

*/
/**
 * @Description:    Sort
 * @Author:         dafeng.xdf[at]taobao.com
 * @Date:           2013.09.01
 */
KISSY.add('gallery/autoResponsive/1.3/plugin/sort',function (S) {
    'use strict';
    var D = S.DOM;

    var config = {};
    /**
     * @name Sort
     * @class 排序插件
     * @constructor
     */
    function Sort(cfg) {
        if (!(this instanceof Sort)) {
            return new Sort(cfg);
        }
        this._makeCfg(cfg);
    }
    /**
     * 启用插件便开始解析
     */
    S.augment(Sort, {
        /**
         * loader插件初始化
         * @public 供宿主对象在插件初始化时调用
         * @param owner Base对象（即插件宿主对象）
         * 重度依赖beforeLocate事件
         */
        init: function (owner) {
            var self = this;
            self.owner = owner;
            self.actions = [];
            self.owner.on('beforeLocate',function(d){
                self.elms = d.autoResponsive.elms;
                for (var i = 0;i<self.actions.length;i++){
                    d.autoResponsive.actions.push(self.actions[i]);
                }
            });
            S.log('plugin sort::init');
        },
        /**
         * 用户配置修正
         * @param cfg
         * @private
         */
        _makeCfg: function(cfg){
            cfg = config
            this.config = cfg;
        },
        /**
         * 暴露成外部接口
         * 修改的配置会立即生效
         * @param cfg
         */
        changeCfg: function(cfg){
            this._makeCfg(S.merge(this.config, cfg)); // 重新配置
        },
        /**
         * 随机排序
         */
        random:function(cfg){
            var self = this;
            self.clear();
            self.actions.push(function(queue,index,items){
                return parseInt(Math.random() * queue.length);
            });
        },
        /**
         * 优先排序
         */
        priority:function(cfg){
            var self = this;
            var attrName = cfg.attrName || 'data-priority';
            var cache = [],_p =-1;
            S.each(self.elms,function(i){
                if( cfg.dataAttr && ( D.attr(i,attrName) == cfg.dataAttr ) || D.hasClass(i,cfg.classAttr)){
                    cache.push(i);
                }
            });
            self.actions.push(function(queue,index,items){
                if(S.inArray(items[index],cache)){
                    _p++;
                    return _p;
                }else{
                    return queue.length;
                }
            });
        },
        /**
         * 倒序
         */
        reverse:function(){
            var self = this;
            self.actions.push(function(queue,index,items){
                return 0;
            });
        },
        /**
         * 过滤排序
         */
        filter:function(cfg){
            var self = this;
            self.clear();
            var attrName = cfg.attrName || 'data-filter';
            self.actions.push(function(queue,index,items){
               if( (D.hasAttr(items[index],attrName) &&  D.attr(items[index],attrName) == cfg.dataAttr)){
                    D.show(items[index]);
               }else if(D.hasClass(items[index],cfg.classAttr)){
                    D.show(items[index]);
               }else if(S.inArray(D.attr(items[index],attrName),cfg.dataAttr)){
                    D.show(items[index]);
               }else {
                    cfg.hide && D.hide(items[index]);
                    return true;
               }
            });
        },
        /**
         * 用户自定义算法
         */
        custom:function(action){
            var self = this;
            self.actions.push(action);
        },
        /**
         * 清除规则
         */
        clear:function(){
            var self = this;
            //清除所有自定义规则
            self.actions = [];
        },
        /**
         * 撤销操作
         */
        restore:function(){
            var self = this;
            self.actions.pop();
        }
    });
    return Sort;

}, {requires: ['dom']});

