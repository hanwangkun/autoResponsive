/**
 * @Description: 兼容css3和低版本浏览器动画效果
 * @Author:      dafeng.xdf[at]taobao.com
 * @Date:        2013.3.5
 */
KISSY.add(function (S) {
    'use strict';
    var D = S.DOM, Anim = S.Anim, BLANK = ' ',
        letIE10 = S.UA.ie < 11;

    /**
     * @name AutoAnim
     * @class css动画，采用帧重复
     * @constructor
     */
    function AutoAnim(cfg) {
        var self = this;
        self.cfg = cfg;
        self._init();
    }

    S.augment(AutoAnim, {
        _init: function () {
            var self = this;
            letIE10 ? self.fixedAnim() : self.css3Anim();
        },
        /**
         * css3动画
         */
        cssPrefixes: function (styleKey, styleValue) {
            var fixedRule = {};
            S.each('-webkit- -moz- -o- -ms-  '.split(BLANK), function (i) {
                fixedRule[i + styleKey] = styleValue;
            });
            return fixedRule;
        },
        css3Anim: function () {
            /**
             * css3效果代码添加
             * 为了减少对象读取css3模式去除duration配置，改为css中读取
             */
            var self = this,
                cfg = self.cfg;
            D.css(cfg.elm, self.cssPrefixes('transform', 'translate(' + ((cfg.direction !== 'right') ? cfg.x : (cfg.owner.gridSort.containerWH - cfg.elm.__width - cfg.x)) + 'px,' + cfg.y + 'px) '));
            /**
             * 单元素计算排序后触发
             */
            cfg.owner.fire('afterUnitSort', {
                autoResponsive: {
                    elm: cfg.elm,
                    position: {
                        x: cfg.x,
                        y: cfg.y
                    },
                    frame: cfg.owner.frame
                }
            });
        },
        /**
         * 降级模拟css3动画
         */
        fixedAnim: function () {
            var self = this,
                cfg = self.cfg,
                cssRules = {'top': cfg.y},
                direction = 'left';
            if (cfg.closeAnim) {
                self.noneAnim();
                return;
            }
            if (cfg.direction == 'right') {
                direction = 'right';
            }
            cssRules[direction] = cfg.x;
            new Anim(cfg.elm, cssRules, cfg.duration, cfg.easing, function () {
                /**
                 * 单元素计算排序后触发
                 */
                cfg.owner.fire('afterUnitSort', {
                    autoResponsive: {
                        elm: cfg.elm,
                        position: {
                            x: cfg.x,
                            y: cfg.y
                        },
                        frame: cfg.owner.frame
                    }
                });
            }).run();
        },
        /**
         * 无动画
         */
        noneAnim: function () {
            var self = this,
                cfg = self.cfg;
            D.css(cfg.elm, {
                left: cfg.x,
                top: cfg.y
            });
            /**
             * 单元素计算排序后触发
             */
            cfg.owner.fire('afterUnitSort', {
                autoResponsive: {
                    elm: cfg.elm,
                    position: {
                        x: cfg.x,
                        y: cfg.y
                    },
                    frame: cfg.owner.frame
                }
            });
        }
    });
    return AutoAnim;
}, {requires: ['dom', 'anim']});
