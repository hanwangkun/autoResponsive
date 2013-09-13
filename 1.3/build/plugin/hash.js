/*
combined files : 

gallery/autoResponsive/1.3/plugin/hash

*/
/**
 * @Description:    hash回溯、功能路由
 * @Author:         dafeng.xdf[at]taobao.com
 * @Date:           2013.3.5
 * @Log:            2013.7.20重构hash插件
 */
KISSY.add('gallery/autoResponsive/1.3/plugin/hash',function (S) {
    'use strict';
    var AND = '&',
        EQUAL = '=';

    /**
     * @name hash
     * @class 自适应布局
     * @constructor
     */
    function Hash(cfg) {
        var self = this;
        self.prefix = cfg.prefix || 'ks-';
    }

    /**
     * 启用插件便开始解析
     */
    S.augment(Hash, {
        init: function (owner) {
            var self = this;
            self.owner = owner;
            S.log('hash init!');
            if (!self.hasHash()) {
                return;
            }
            self.parse();
        },
        hasHash: function () {
            return location.hash ? true : false;
        },
        parse: function () {
            var self = this;
            self.getParam();
        },
        /**
         * 解析hash
         * priority,filter
         */
        getParam: function () {
            var self = this;
            self.hash = location.hash.split(AND);
            S.each(self.hash, function (param) {
                self.getPriority(param);
                self.getFilter(param);
            });
        },
        getPriority: function (str) {
            var self = this,
                _priority = self.prefix + 'priority';
            if (str.indexOf(_priority) != -1) {

            }
        },
        getFilter: function (str) {
            var self = this,
                _filter = self.prefix + 'filter';
            if (str.indexOf(_filter) != -1) {

            }
        }
    });
    return Hash;
}, {requires: ['event']});
