KISSY.use('gallery/autoResponsive/1.3/index',function(S,T){

    var E = S.Event,D = S.DOM;

    var append = new T({
        container:'.J_container_append',
        selector:'div',
        unitMargin:{
            x :10,
            y:10
        },
        autoInit:false
    });
    append.init();
    E.on('.J_button_append','click',function(e){

        var _target = e.target;

        if(D.hasClass(_target,'append')){

            append.append(D.create('<div class="block red">1+</div><div class="block yellow">2+</div><div class="block blue circle">3+</div>'));

        }else if(D.hasClass(_target,'prepend')){

            append.prepend(D.create('<div class="block red">1</div><div class="block yellow">2</div><div class="block blue circle">3</div>'));

        }else if(D.hasClass(_target,'remove')){

            D.remove(D.get('.block','.J_container_append'));

            append.adjust();
        }
    });
    new T({
        container:'.J_container_waterfall',
        selector:'div',
        unitMargin:{
            x :10,
            y:10
        }
    });
    new T({
        container:'.J_container_resize',
        selector:'div',
        unitMargin:{
            x :10,
            y:10
        }
    });
    var getRandomColor = function(){
        return (function(m,s,c){
            return (c ? arguments.callee(m,s,c-1) : '#') +
                s[m.floor(m.random() * 16)]
        })(Math,'0123456789abcdef',5)
    };
    var test = new T({
        container:'.J_container_roll',
        selector:'div',
        unitMargin:{
            x :10,
            y:10
        },
        autoInit:false
    });
    test.on('resize',function(d){
        D.css(S.get('.J_container_roll'),{
            background:getRandomColor()
        });
    });
    test.on('afterUnitArrange',function(d){
        var _elm = d.autoResponsive.elm;
        D.css(_elm,{
            color:getRandomColor()
        });
        var _frame = d.autoResponsive.frame;
        D.css(_elm,{
            visibility:'visible',
            opacity:1,
            '-webkit-transform':_elm.style.MozTransform +'rotate('+360*_frame+'deg)'
        });
    })
    S.get('.J_container_roll')&&test.init();
});
