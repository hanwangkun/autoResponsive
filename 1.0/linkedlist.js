/**
 * @Description: 集成一个双向链表方便操作
 * @Author:      dafeng.xdf[at]taobao.com
 * @Date:        2013.3.5
 */
;KISSY.add('gallery/autoResponsive/1.0/linkedlist',function(S){
    "use strict";
    /**
     * @name LinkedList
     * @class 双向更新链表
     * @constructor
     */
    function LinkedList(){
        this.length = 0;
        this.head = null;
        this.tail = null;
    }
    S.augment(LinkedList,{
        /**
         * 新增节点
         */
        add:function(value){
            var node = {
                value:value,
                next:null,   //前驱
                prev:null    //后继
            };
            if(this.length == 0){
                this.head = this.tail = node;
            }else{
                this.tail.next = node;
                node.prev = this.tail;
                this.tail = node;
            }
            this.length ++;
        },
        /**
         * 删除节点
         */
        remove:function(index){
            if ( index > this.length - 1 || index < 0 ) {
                return null;
            }
            var node = this.head,
                i = 0;
            if (index == 0) {
                this.head = node.next;
                if (this.head == null) {
                    this.tail = null;
                }
                else {
                    this.head.previous = null;
                }
            }
            else if (index == this.length - 1) {
                node = this.tail;
                this.tail = node.prev;
                this.tail.next = null;
            }
            else {
                while (i++ < index) {
                    node = node.next;
                }
                node.prev.next = node.next;
                node.next.prev = node.prev;
            }
            this.length --;
        },
        /**
         * 获取链表值
         */
        get:function(index){
            return this.node(index).value;
        },
        /**
         * 返回链表节点
         */
        node:function(index){
            if (index > this.length - 1 || index < 0 ) {
                return null;
            }
            var node = this.head,
                i = 0;
            while (i++ < index) {
                node = node.next;
            }
            return node;
        },
        /**
         * 更新节点值
         */
        update:function(index,value){
            this.node(index).value = value;
        }
    });
    return LinkedList;
});