/**
 * @Description:    网页自适应布局全局配置模块
 * @Author:         dafeng.xdf[at]taobao.com
 * @Date:           2013.3.5
 */
KISSY.add('gallery/autoResponsive/1.0/config', function () {
    'use strict';
    var EMPTY = '';

    /**
     * @name Config
     * @param {String}  container            外层容器
     * @param {String}  selector             单元选择器
     * @param {String}  filter               单元过滤器
     * @param {String}  fixedSelector        [*]占位选择器
     * @param {String}  priority             优先选择器
     * @param {Number}  gridWidth            最小栅格单元宽度<code>px</code>
     * @param {Object}  unitMargin           单元格外边距<code>px</code>
     * @param {Boolean} closeAnim            是否关闭动画（默认开启）
     * @param {Number}  duration             补间动画时间
     * @param {String}  easing               补间动画算子
     * @param {String}  direction            排序起始方向（可选值：<code>'right'</code>）
     * @param {Boolean} random               随机排序开关（默认关闭）
     * @param {String}  sortBy               排序算法（可选值：<code>'grid'</code>或<code>'cell'</code>，默认为<code>'grid'</code>）
     * @param {Boolean} autoHeight           容器高度自适应开关（默认为true）
     * @param {Boolean} suspend              渲染任务队列是否支持挂起（挂起时主动将执行交给UI线程 | 默认为true）
     * @param {Array}   plugins              插件队列
     * @param {Boolean} autoInit             是否自动初始化（默认为true）
     * @param {Boolean} closeResize          是否关闭resize绑定（默认不关闭）
     * @param {Number}  resizeFrequency      resize触发频率
     * @param {Array}   whensRecountUnitWH   重新计算单元宽高的行为时刻（可选值：<code>'closeResize', 'adjust'</code>）
     */
    function Config() {
        return {
            container: {value: EMPTY},
            selector: {value: EMPTY},
            filter: {value: EMPTY},
            fixedSelector: {value: EMPTY},
            priority: {value: EMPTY},
            gridWidth: {value: 10},
            unitMargin: {value: {x: 0, y: 0}},
            closeAnim: {value: false},
            duration: {value: 1},
            easing: {value: 'easeNone'},
            direction: {value: 'left'},
            random: {value: false},
            sortBy: {value: EMPTY},
            autoHeight: {value: true},
            closeResize: {value: false},
            autoInit: {value: true},
            plugins: {value: []},
            suspend: {value: true},
            cache: {value: false},
            resizeFrequency: {value: 200},
            whensRecountUnitWH: {value: []}
        };
    }
    return Config;
});