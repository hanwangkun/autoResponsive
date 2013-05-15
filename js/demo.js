KISSY.use('gallery/autoResponse/1.0/index',function(S,T){

    var E = S.Event,D = S.DOM;

    var priority = new T({
        container:'.J_container_priority',
        selector:'div',
        colMargin:{
            x :10,
            y:10
        },
        layout:'grid'
    });

    E.on('.J_button_priority','click',function(e){

        var _target = e.target;

        if(D.hasClass(_target,'red')){

            priority.priority('.red');

        }else if(D.hasClass(_target,'yellow')){

            priority.priority('.yellow');

        }else if(D.hasClass(_target,'blue')){

            priority.priority('.blue');

        }else if(D.hasClass(_target,'green')){

            priority.priority('.green');

        }else if(D.hasClass(_target,'circle')){

            priority.priority('.circle');

        }else if(D.hasClass(_target,'random')){
            priority.random();
        }
    });

    var filter = new T({
        container:'.J_container_filter',
        selector:'div',
        colMargin:{
            x :10,
            y:10
        }
    });

    E.on('.J_button_filter','click',function(e){

        var _target = e.target;

        if(D.hasClass(_target,'red')){

            filter.filter('.red');

        }else if(D.hasClass(_target,'yellow')){

            filter.filter('.yellow');

        }else if(D.hasClass(_target,'blue')){

            filter.filter('.blue');

        }else if(D.hasClass(_target,'green')){

            filter.filter('.green');

        }else if(D.hasClass(_target,'circle')){

            filter.filter('.circle');

        }
    });
    var colMargin = new T({
        container:'.J_container_margin',
        selector:'div'
    });

    E.on('.J_button_margin','click',function(e){

        var _target = e.target;

        if(D.hasClass(_target,'margin-0')){

            colMargin.margin({
                x :0,
                y:0
            });

        }else if(D.hasClass(_target,'margin-10')){

            colMargin.margin({
                x :10,
                y:10
            });

        }else if(D.hasClass(_target,'margin-20')){

            colMargin.margin({
                x :10,
                y:20
            });

        }
    });
    var direction = new T({
        container:'.J_container_direction',
        selector:'div',
        colMargin:{
            x :10,
            y:10
        }
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
            })

            direction.direction('right');

        }
    });
    var drag = new T({
        container:'.J_container_drag',
        selector:'div',
        colMargin:{
            x :10,
            y:10
        },
        drag:'on'
    });

});
