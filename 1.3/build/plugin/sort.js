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
    /**
     * @name Sort
     * @class 算法排序组件
     * @constructor
     */
    function Sort(cfg) {
        if (!(this instanceof Loader)) {
            return new Loader(cfg);
        }
        this._makeCfg(cfg);
    }

    /**
     * 启用插件便开始解析
     */
    S.augment(Sort, S.EventTarget, {
        /**
         * loader插件初始化
         * @public 供宿主对象在插件初始化时调用
         * @param owner Base对象（即插件宿主对象）
         */
        init: function (owner) {

            this.owner = owner;

            this.__bindMethods();

            this._reset();

        },
        /**
         * 暴露成外部接口，主要目的是让使用者可以动态改变loader某些配置（如mod），而不需要重新实例化
         * 修改的配置会立即生效
         * @param cfg
         */
        changeCfg: function(cfg){
            this.stop(); // 终止原来的loader
            this._makeCfg(S.merge(this.config, cfg)); // 重新配置
            this._reset(); // 状态及事件重置
        },
     });
    return Sort;

}, {requires: ['dom']});


