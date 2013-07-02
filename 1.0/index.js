/**
 * @Description: 目前先挂载base，effect效果插件，hash插件
 * @Author:      dafeng.xdf[at]taobao.com
 * @Date:        2013.3.5
 */
KISSY.add('gallery/autoResponsive/1.0/index', function (S, AutoResponsive, Hash, Drag, Loader) {
    AutoResponsive.Hash = Hash;
    AutoResponsive.Drag = Drag;
    AutoResponsive.Loader = Loader;
    return AutoResponsive;
}, {requires: ['./base', './plugin/hash', './plugin/drag', './plugin/loader']});