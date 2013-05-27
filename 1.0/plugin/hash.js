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
    function Hash() {
        var self = this;
        self._init();
    };
    /**
     */
    S.augment(Hash, {
        _init:function(){
        }
    });
    return Hash;
});