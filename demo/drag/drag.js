/**
 * @Description:    ��ק���ܣ�����constrain��scroll����dd���
 * @Author:         dafeng.xdf[at]taobao.com
 * @Date:           2013.3.5
 * @Log:            1.2�汾��drag�ع�
 */
KISSY.add('gallery/autoResponsive/1.2/plugin/drag',function (S,Constrain,Scroll) {
    'use strict';
    var D = S.DOM,
        DD = S.DD, DDM = DD.DDM,
        DraggableDelegate = DD.DraggableDelegate,
        DroppableDelegate = DD.DroppableDelegate,
        prifixCls = 'ks-autoResponsive-dd-',
        placeHolderCls = prifixCls+'placeHolder',
        draggingCls = prifixCls+'dragging',
        placeHolderTPL = '<div class="'+placeHolderCls+'"></div>';

    /**
     * Drag
     * @param cfg
     * @constructor
     */
    function Drag(cfg) {
        var self = this;
        self.closeConstrain = cfg.closeConstrain || false; //�Ƿ�رձ߽����ƣ�Ĭ�Ͽ���
        self.selector = cfg.selector;                      //��קdomѡ����
        self.handlers = cfg.handlers || [];                //��ק��������dom
        self.threshold = cfg.threshold || 300;             //��קĬ��ʱ�������
    }
    Drag.prototype={
        /**
         * drag�����ʼ��
         * @public �����������ڲ����ʼ��ʱ����
         * @param owner Ϊ�������
         */
        init: function (owner) {
            var self = this;
            /**
             * ��ȡ��������
             * @type {*}
             */
            self.owner = owner;
            /**
             * ǿ�Ƹ���owner����ΪfixedAnim
             * @type {*}
             */
            self.owner.changeCfg({
                animType:'fixedAnim'
            });
            /**
             * ����ȡ����������
             * @type {*}
             */
            self.container = self.owner.userConfig.container;
            /**
             * ��ʼ����ק�������
             * @type {DraggableDelegate}
             */
            self.dragDelegate = new DraggableDelegate({
                container:self.container,
                selector:self.selector,
                move:true,
                plugins:[new Constrain({
                    constrain: self.container
                }),new Scroll({
                    node: self.container
                })],
                handlers:self.handlers
            });
            /**
             * ��ʼ���ϷŶ���
             * @type {DroppableDelegate}
             */
            self.dropDelegate = new DroppableDelegate({
                container:self.container,
                selector:self.selector
            });
            /**
             * �Ϸ��Զ����¼�����
             */
            self._bindOperate();
            S.log('drag init!');
        },
        reset:function(){

        },
        stop:function(){

        },
        _bindOperate:function(){
            var self = this;
            DDM.on('dragstart',self._debounce(self._dragStartOperate))
                .on('dragend',self._debounce(self._dragEndOperate))
                .on('dropover',self._debounce(self._dropOverOperate));
        },
        _dragStartOperate:function(e){
            var self = this,
                _drag = e.drag,
                _node =  _drag.get("node");
            self.select = _node[0];
            /**
             * ��ȡ�������
             * @type {*}
             */
            self.originPosition = self.select.autoResponsiveCoordinate;
            /**
             * �����м�ģ��
             * @type {*}
             */
            self._renderPlaceHolder();
            /**
             * ����selectΪ������ʽ
             */
            D.addClass(self.select,draggingCls);
            /**
             * �����������ã�������Ԫ���Թ�����
             */
            self.owner.changeCfg({
                exclude:draggingCls
            });
        },
        _dragEndOperate:function(){
            var self = this;
            /**
             * �϶���������������Ԫ��Ϊ�м�Ԫ�ص�����
             */
            D.css(self.select,{
                left: D.offset(self.placeHolder).left,
                top: D.offset(self.placeHolder).top
            });
            console.log(D.offset(self.placeHolder))
            /**
             * ȥ���м�Ԫ��
             */
            D.remove(self.placeHolder);
            /**
             * ��ԭ����Ԫ����ʽ
             */
            D.removeClass(self.select,draggingCls);
        },
        _dropOverOperate:function(e){
            var self = this,
                _drop = e.drop,
                _node = _drop.get("node");
            /**
             * �м�չλԪ�ز���overԪ��֮ǰ
             */
            D.insertBefore(self.placeHolder,_node);
            /**
             * ����autoResponsive����
             */
            self.owner.adjust();
        },
        _renderPlaceHolder:function(){
            var self = this;
            /**
             * ����ռλdom
             * @type {*}
             */
            self.placeHolder = D.create(placeHolderTPL);
            /**
             * ����ռλ��ʽ
             */
            D.css(self.placeHolder,{
                left:self.originPosition.x,
                top:self.originPosition.y,
                width: D.width(self.select),
                height: D.height(self.select)
            });
            /**
             * dom������ռλԪ��
             */
            D.insertBefore(self.placeHolder,self.select);
        },
        _debounce:function(fn){
            var self = this,
                _threshold = self.threshold;
            /**
             * ��ͬ��kissy��buffer������β֡�������ӳ�ָ��ʱ��threshold����ִ�У�
             * ��kissy��buffer��Խ��һ���ǿ������ñ�����֡����β֡����execAsap=true��ʾ������֡��
             *
             * @param fn reference to original function
             * @param threshold
             * @param context the context of the original function
             * @param execAsap execute at start of the detection period
             * @returns {Function}
             * @private
             */
            function debounce (fn, threshold, context, execAsap) {
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
            }
            return debounce(fn,_threshold,self,true);
        }
    };
    return Drag;
}, {requires: ['dd/plugin/constrain','dd/plugin/scroll','dd','dom','event']});