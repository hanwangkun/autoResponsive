/**
 * @Description:    hash回溯插件
 * @Author:         dafeng.xdf[at]taobao.com
 * @Date:           2013.3.5
 */
;KISSY.add(function(S){
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