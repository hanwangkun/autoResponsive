KISSY.use('gallery/autoResponsive/1.1/index',function(S,T){

    var E = S.Event,D = S.DOM;
    var great = new T({
        container:'.J_container_great',
        selector:'div',
        unitMargin:{
            x :10,
            y:10
        },
        autoInit:false
    });
    var transform;
//    var eff = new T.Effect({
//        effect:'appear'
//    });
    //great.plugin(eff);
    great.on('afterSort',function(d){

        S.each(d.autoResponsive.elms,function(_elm){
            appear(_elm);
        });

    });
    great.on('complete',function(d){

        //console.log(d.autoResponsive.elms)
    });
    great.on('beforeSort',function(d){

        //console.log(d.autoResponsive.elms);
    });
    great.on('beforeUnitSort',function(d){
        var _elm = d.autoResponsive.elm;
        D.css(_elm,{
            visibility:'hidden',
            opacity:0
        });

    });
    function appear(_elm){
        setTimeout(function(){
            D.css(_elm,{
                visibility:'visible',
                opacity:1

            });
            D.css(_elm,{
                '-webkit-transform':_elm.style.MozTransform +' scale(1)'
            });
        },parseInt(Math.random()*(600-400+1)+400))
    }
    great.on('afterUnitSort',function(d){

        var _elm = d.autoResponsive.elm;
        var _frame = d.autoResponsive.frame;
        D.css(_elm,{
            '-webkit-transform':_elm.style.MozTransform +' scale(0)'
        });
    });
    great.init();
});
