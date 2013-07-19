/*
combined files : 

gallery/autoResponsive/1.2/plugin/drag

*/
/**
 * @Description:    拖拽功能
 * @Author:         dafeng.xdf[at]taobao.com
 * @Date:           2013.3.5
 * @Log:            1.2版本对drag重构
 */
KISSY.add('gallery/autoResponsive/1.2/plugin/drag',function (S) {
    'use strict';
    var D = S.DOM, E = S.Event, DD = S.DD,
        DraggableDelegate = DD.DraggableDelegate,
        Droppable = DD.Droppable;

    /**
     * @name Drag
     * @class 拖拽功能
     * @constructor
     */
    function Drag(cfg) {
    }

    /**
     *
     */
    S.augment(Drag, {
        init: function () {
            var self = this;
            S.log('drag init!');
        }
    });
    return Drag;
}, {requires: ['dom','event','dd']});
