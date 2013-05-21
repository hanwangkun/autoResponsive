/**
 * @Description:    网页自适应布局
 * @Author:         dafeng.xdf[at]taobao.com
 * @Date:           2013.3.5
 */
;KISSY.add(function(){
    "use strict";
    var EMPTY = '';
    /**
     * @name config
     * @param {String}  container   外层容器
     * @param {String}  selector    生效选择器
     * @param {String}  filter      过滤选择器
     * @param {String}  priority    优先排序选择器
     * @param {Number}  colWidth    最小栅格单元设置px
     * @param {Object}  colMargin   单元格边距设置
     * @param {Boolean} animate     动画效果开关
     * @param {Number}  duration    动画缓动时间
     * @param {String}  easing      动画缓动算子
     * @param {Number}  colWidth    最小栅格单元设置px
     * @param {String}  direction   排序方向,可以选择right
     * @param {Boolean} random      随机顺序开关
     * @param {Boolean} drag        动画缓动算子
     * @param {Boolean} autoHeight  容器高度自适应开关
     */
    function Config(){
        return {
            container:{value:EMPTY},
            selector:{value:EMPTY},
            filter:{value:EMPTY},
            fixedSelector:{value:EMPTY},
            priority:{value:EMPTY},
            colWidth:{value:10},
            colMargin:{value:{x:0,y:0}},
            animate:{value:'on'},
            duration:{value:1},
            easing:{value:'easeNone'},
            direction:{value:'left'},
            random:{value:'off'},
            sort:{value:EMPTY},
            layout:{value:EMPTY},
            drag:{value:'off'},
            autoHeight:{value:'on'},
            resize:{value:'on'},
            effect:{value:'off'}
        };
    }
    return Config;
});