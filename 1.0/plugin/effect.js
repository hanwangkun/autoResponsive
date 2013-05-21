/**
 * @Description: css3动画效果插件
 * @Author:      dafeng.xdf[at]taobao.com
 * @Date:        2013.3.5
 */
;KISSY.add(function(S){
    "use strict";
    var EMPTY = '';
    function effect(cfg){
        var self = this;
        S.mix(self,cfg);
        self._init();
    };
    S.augment(effect,{
        _init:function(){
            var self = this;
            self.router();
        },
        router:function(){
            var self = this;
            switch (self.effect){
                case 'roll':
                    self.roll();
                    break;
                case 'appear':
                    self.appear();
                    break;
                case 'off':
                default:
                    self.still();
                    break;
            }
        },
        /**
         * 增添二级缓存
         */
        roll:function(){
            var self = this;
            S.mix(self,{
                type:'rotate('+360*self.frame+'deg)'
            });
        },
        appear:function(){
            var self = this;
            S.mix(self,{
                type:'scale(1)'
            });
        },
        still:function(){
            var self = this;
            S.mix(self,{
                type:EMPTY
            })
        }
    });
    return effect;
},{requires:['dom','anim']});