KISSY.use('gallery/autoResponsive/1.3/index',function(S,T){

    var E = S.Event,D = S.DOM,
        closeAnimate = false;
    
    var _random = false;

    var prioritySort = new T.Sort();

    var priority = new T({
        container:'.J_container_priority',
        selector:'div',
        unitMargin:{
            x :10,
            y:10
        },
        gridWidth:10,
        plugins:[prioritySort],
        autoInit:false,
        closeAnim:false
    });


    priority.init();

    E.on('.J_button_priority','click',function(e){

        var _target = e.target;
        prioritySort.clear();

        if(D.hasClass(_target,'red')){

            prioritySort.priority({
                classAttr:'red'
            });


        }else if(D.hasClass(_target,'yellow')){
            prioritySort.priority({
                classAttr:'yellow'
            });

        }else if(D.hasClass(_target,'blue')){

            prioritySort.priority({
                classAttr:'blue'
            });

        }else if(D.hasClass(_target,'green')){

            prioritySort.priority({
                classAttr:'green'
            });

        }else if(D.hasClass(_target,'circle')){

            prioritySort.priority({
                classAttr:'circle'
            });

        }else if(D.hasClass(_target,'random')){
            prioritySort.random();
            
        }
        priority.adjust();
    });
    setTimeout(function(){
        prioritySort.random();

        var Timer = setInterval(function(){
            
            priority.adjust();
        },400);
        setTimeout(function(){
            clearInterval(Timer);
        },1500);
    },800)

    var filterSort = new T.Sort();

    var filter = new T({
        container:'.J_container_filter',
        selector:'div',
        unitMargin:{
            x :10,
            y:10
        },
        plugins:[filterSort],
        closeAnim:closeAnimate,
        autoInit:false
    });

    filter.init();
    E.on('.J_button_filter','click',function(e){

        var _target = e.target;

        
            filterSort.clear();

        if(D.hasClass(_target,'red')){

            filterSort.filter({
                classAttr:'red',
                hide:true
            });

        }else if(D.hasClass(_target,'yellow')){


            filterSort.filter({
                classAttr:'yellow',
                hide:true
            });

        }else if(D.hasClass(_target,'blue')){


            filterSort.filter({
                classAttr:'blue',
                hide:true
            });

        }else if(D.hasClass(_target,'green')){


            filterSort.filter({
                classAttr:'green',
                hide:true
            });

        }else if(D.hasClass(_target,'circle')){

            filterSort.filter({
                classAttr:'circle',
                hide:true
            });

        }
        filter.adjust();
    });
    var unitMargin = new T({
        container:'.J_container_margin',
        selector:'div',
        closeAnim:closeAnimate
    });

    E.on('.J_button_margin','click',function(e){

        var _target = e.target;

        if(D.hasClass(_target,'margin-0')){

            unitMargin.margin({
                x :0,
                y:0
            });

        }else if(D.hasClass(_target,'margin-10')){

            unitMargin.margin({
                x :10,
                y:10
            });

        }else if(D.hasClass(_target,'margin-20')){

            unitMargin.margin({
                x :10,
                y:20
            });

        }
    });
    var direction = new T({
        container:'.J_container_direction',
        selector:'div',
        unitMargin:{
            x :10,
            y:10
        },
        direction:'right',
        closeAnim:closeAnimate
    });

    E.on('.J_button_direction','click',function(e){

        var _target = e.target;

        if(D.hasClass(_target,'left')){
            S.each(D.query('div','.J_container_direction'),function(i){
                D.removeAttr(i,'style');
            })
            direction.direction('left');

        }else if(D.hasClass(_target,'right')){

            S.each(D.query('div','.J_container_direction'),function(i){
                D.removeAttr(i,'style');
            });
            direction.direction('right');
        }
    });
    /**
     * 先初始化插件
     */
    var drag = new T.Drag({
        closeConstrain :false,       //是否关闭边界限制
        selector:'.block',           //拖拽元素过滤器
        handlers:[],                 //拖拽操作代理dom
        threshold :300               //时间敏感粒度ms
    });
    /**
     * 初始化宿主
     */
    var dragOwner = new T({
        container:'.J_container_drag',
        selector:'div',
        unitMargin:{
            x :10,
            y:10
        },
        plugins:[drag],              //插件实例传入插件队列
        duration:0.1,
        closeAnim:false
    });
    E.on('.J_button_drag','click',function(e){

        var _target = e.target;

        if(D.hasClass(_target,'off')){
            drag.stop();
        }else{
            drag.restore();
        }
    });
});
