/*
 combined files :

 gallery/autoResponsive/1.0/plugin/drag

 */
/**
 * @Description:    拖拽功能
 * @Author:         dafeng.xdf[at]taobao.com
 * @Date:           2013.3.5
 */
KISSY.add('gallery/autoResponsive/1.0/plugin/drag', function (S) {
    'use strict';
    var E = S.Event, DD = S.DD,
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
        },
        _bindDrop: function (elm) {
            var self = this;
            if (self.drag != 'on') {
                return;
            }
            new Droppable({
                node: elm
            }).on("dropenter", function (ev) {
                    D.insertAfter(ev.drag.get("node"), ev.drop.get("node"));
                    self._self.render();
                });
        },
        _bindBrag: function () {
            var self = this;
            if (self.drag != 'on') {
                return;
            }
            new DraggableDelegate({
                container: self.container,
                selector: self.selector,
                move: true
            }).on('dragstart',function (ev) {
                    var _target = ev.drag.get("node")[0];
                    this.p = {
                        left: _target.offsetLeft,
                        top: _target.offsetTop
                    };
                }).on('drag',function () {
                }).on('dragend', function (ev) {
                    D.css(ev.drag.get("node"), this.p);
                });
        }
    });
    return Drag;
}, {requires: ['event', 'dd']});
