/**
 * @Description:    loader
 * @Author:         dafeng.xdf[at]taobao.com
 * @Date:           2013.3.5
 */
;KISSY.add(function(S){
    "use strict";
    var E = S.Event;
    /**
     * @name Loader
     * @class 加载器
     * @constructor
     */
    function Loader(cfg) {
        var self = this;
    };
    /**
     * 启用插件便开始解析
     */
    S.augment(Loader, {
        init:function(){
            var self = this;
        }
    });
    return Loader;
},{requires:['event']});