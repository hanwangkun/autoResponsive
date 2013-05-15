KISSY.use('gallery/autoResponse/1.0/index',function(S,T){

    var E = S.Event,D = S.DOM;

    var append = new T({
        container:'.J_container_append',
        selector:'div',
        colMargin:{
            x :10,
            y:10
        }
    });

    E.on('.J_button_append','click',function(e){

        var _target = e.target;

        if(D.hasClass(_target,'append')){

            append.append(D.create('<div class="block red">1</div><div class="block yellow">2</div><div class="block blue circle">3</div>'));

        }else if(D.hasClass(_target,'prepend')){

            append.prepend(D.create('<div class="block red">1</div><div class="block yellow">2</div><div class="block blue circle">3</div>'));

        }else if(D.hasClass(_target,'remove')){

            D.remove(D.query('.block')[0]);

            append.adjust();
        }
    });
    new T({
        container:'.J_container_waterfall',
        selector:'div',
        colMargin:{
            x :10,
            y:10
        }
    });
    new T({
        container:'.J_container_resize',
        selector:'div',
        colMargin:{
            x :10,
            y:10
        }
    });


});
