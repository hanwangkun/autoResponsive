/**
 * @Description: 兼容css3和低版本浏览器动画效果
 * @Author:      dafeng.xdf[at]taobao.com
 * @Date:        2013.3.5
 */
;KISSY.add(function(S,Effect){
    "use strict";
    var D = S.DOM, Anim = S.Anim,BLANK = ' ',
        notSupport = S.UA.ie < 11;
    /**
     * @name AutoAnim
     * @class css动画，采用帧重复
     * @constructor
     */
    function AutoAnim(cfg){
        var self = this;
        S.mix(self,cfg);
        self._init();
    };
    S.augment(AutoAnim,{
        _init:function(){
            var self = this;
            if(self.animate == 'off'){
                self.noneAnim();
                return;
            }
            notSupport || self.direction == 'right' || self.drag == 'on' ? self.fixedAnim() : self.css3Anim();
        },
        /**
         * css3动画
         */
        cssPrefixes:function(styleKey,styleValue){
            var fixedRule = {};
            S.each('-webkit- -moz- -o- -ms-  '.split(BLANK),function(i){
                fixedRule[i+styleKey] = styleValue;
            });
            return fixedRule;
        },
        css3Anim:function(){
            /**
             * css3效果代码添加
             */
            var self = this;
            var _type = new Effect({
                effect:self.effect,
                frame:self.frame
            }).type;
            D.css(self.elm, S.merge(
                self.cssPrefixes('transform','translate('+ self.x +'px,'+ self.y +'px) '+_type),
                self.cssPrefixes('transition-duration',self.duration +'s'))
            );
        },
        /**
         * 降级模拟css3动画
         */
        fixedAnim:function(){
            var self = this,
                cssRules = {'top':self.y},
                direction = 'left';
            if(self.direction == 'right'){
                direction = 'right';
            }
            cssRules[direction] = self.x;
            new Anim(self.elm,cssRules,self.duration,self.easing).run();
        },
        /**
         * 无动画
         */
        noneAnim:function(){
            var self = this;
            D.css(self.elm,{
                left: self.left,
                top: self.top
            });
        }
    });
    return AutoAnim;
},{requires:['./plugin/effect','dom','anim']});