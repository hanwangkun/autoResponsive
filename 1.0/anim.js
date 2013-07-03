/**
 * @Description: 兼容css3和低版本浏览器动画效果
 * @Author:      dafeng.xdf[at]taobao.com
 * @Date:        2013.3.5
 */
KISSY.add('gallery/autoResponsive/1.0/anim', function (S) {
    'use strict';
    var D = S.DOM, Anim = S.Anim, BLANK = ' ';

    /**
     * @name AutoAnim
     * @class css动画，采用帧重复
     * @constructor
     */
    function AutoAnim(cfg) {
        var self = this;
        S.mix(self, cfg);
        self.notSupport = S.UA.ie < 11 || self.direction == 'right';
        self._init();
    }

    S.augment(AutoAnim, {
        _init: function () {
            var self = this;
            if (!self.animate) {
                self.noneAnim();
                return;
            }
            self.notSupport ? self.fixedAnim() : self.css3Anim();
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
             */
            var self = this;
            D.css(self.elm, S.merge(
                self.cssPrefixes('transform', 'translate(' + self.x + 'px,' + self.y + 'px) '),
                self.cssPrefixes('transition-duration', self.duration + 's'))
            );
            /**
             * 单元素计算排序后触发
             */
            self.caller.fire('afterElemSort', {
                autoResponsive: {
                    elm: self.elm,
                    position: {
                        x: self.x,
                        y: self.y
                    },
                    frame: self._self.frame
                }
            });
        },
        /**
         * 降级模拟css3动画
         */
        fixedAnim: function () {
            var self = this,
                cssRules = {'top': self.y},
                direction = 'left';
            if (self.direction == 'right') {
                direction = 'right';
            }
            cssRules[direction] = self.x;
            new Anim(self.elm, cssRules, self.duration, self.easing, function () {
                /**
                 * 单元素计算排序后触发
                 */
                self._self.fire('afterElemSort', {
                    autoResponsive: {
                        elm: self.elm,
                        position: {
                            x: self.x,
                            y: self.y
                        },
                        frame: self._self.frame
                    }
                });
            }).run();
        },
        /**
         * 无动画
         */
        noneAnim: function () {
            var self = this;
            D.css(self.elm, {
                left: self.x,
                top: self.y
            });
            /**
             * 单元素计算排序后触发
             */
            self._self.fire('afterElemSort', {
                autoResponsive: {
                    elm: self.elm,
                    position: {
                        x: self.x,
                        y: self.y
                    },
                    frame: self._self.frame
                }
            });
        }
    });
    return AutoAnim;
}, {requires: ['dom', 'anim']});
