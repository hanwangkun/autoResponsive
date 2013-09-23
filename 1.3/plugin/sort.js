/**
 * @Description:    Sort
 * @Author:         dafeng.xdf[at]taobao.com
 * @Date:           2013.09.01
 */
KISSY.add(function (S) {
    'use strict';
    var D = S.DOM;
    /**
     * @name Sort
     * @class 算法排序组件
     * @constructor
     */
    function Sort(cfg) {
        if (!(this instanceof Sort)) {
            return new Sort(cfg);
        }
    }
    /**
     * 启用插件便开始解析
     */
    S.augment(Sort, {
        /**
         * sort插件初始化
         * @public 供宿主对象在插件初始化时调用
         * @param owner Base对象（即插件宿主对象）
         */
        init: function (owner) {

            this.owner = owner;
        },
        /**
         * 暴露成外部接口，主要目的是让使用者可以动态改变loader某些配置（如mod），而不需要重新实例化
         * 修改的配置会立即生效
         * @param cfg
         */
        changeCfg: function(cfg){
        },
     });
    return Sort;

}, {requires: ['dom']});

