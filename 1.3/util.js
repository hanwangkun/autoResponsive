/**
 * @Description: 公用工具类
 * @Author:      dafeng.xdf[at]taobao.com zhuofeng.ls@taobao.com
 * @Date:        2013.3.5
 */
KISSY.add(function (S) {
    'use strict';
    var util = {};

    S.mix(util,{
        /**
         * 等同于kissy的buffer（保留尾帧的任务，延迟指定时间threshold后再执行）
         * 比kissy的buffer优越的一点是可以设置保留首帧还是尾帧任务（execAsap=true表示保留首帧）
         *
         * @param fn reference to original function
         * @param threshold
         * @param context the context of the original function
         * @param execAsap execute at start of the detection period
         * @returns {Function}
         * @private
         */
        debounce:function (fn, threshold, context, execAsap) {
            var timeout; // handle to setTimeout async task (detection period)
            // return the new debounced function which executes the original function only once
            // until the detection period expires
            return function debounced() {
                var obj = context || this, // reference to original context object
                    args = arguments; // arguments at execution time
                // this is the detection function. it will be executed if/when the threshold expires
                function delayed() {
                    // if we're executing at the end of the detection period
                    if (!execAsap)
                        fn.apply(obj, args); // execute now
                    // clear timeout handle
                    timeout = null;
                }

                // stop any current detection period
                if (timeout)
                    clearTimeout(timeout);
                // otherwise, if we're not already waiting and we're executing at the beginning of the detection period
                else if (execAsap)
                    fn.apply(obj, args); // execute now
                // reset the detection period
                timeout = setTimeout(delayed, threshold || 100);
            };
        },
        /**
         * 时间片轮询函数
         * @param items
         * @param process
         * @param context
         * @param callback
         * @returns {{}}
         */
        timedChunk:function(items, process, context, callback) {

            var monitor = {}, timer, todo = []; // 任务队列 | 每一个时间片管理函数（timedChunk）都维护自己的一个任务队列

            var userCfg = context.config,
                qpt = userCfg.qpt || 15;

            monitor.start = function () {

                todo = todo.concat(S.makeArray(items)); // 压入任务队列

                // 轮询函数
                var polling = function () {
                    var start = +new Date;
                    while (todo.length > 0 && (new Date - start < 50)) {
                        var task = todo.splice(0, qpt);
                        process.call(context, task);
                    }

                    if (todo.length > 0) { // 任务队列还有任务，放到下一个时间片进行处理
                        timer = setTimeout(polling, 25);
                        return;
                    }

                    callback && callback.call(context, items);

                    // 销毁该管理器
                    monitor.stop();
                    monitor = null;
                };

                polling();
            };

            monitor.stop = function () {
                if (timer) {
                    clearTimeout(timer);
                    todo = [];
                }
            };
            return monitor;
        }

    });
    return util;
});

