KISSY.use('gallery/autoResponsive/1.3/index',function(S,T){

    var E = S.Event,D = S.DOM;

    var getRandomColor = function(){
        return (function(m,s,c){
            return (c ? arguments.callee(m,s,c-1) : '#') +
                s[m.floor(m.random() * 16)]
        })(Math,'0123456789abcdef',5)
    };

    var range = new T.Sort();

    var test = new T({
        container:'.J_container_roll',
        selector:'div',
        unitMargin:{
            x :10,
            y:10
        },
        plugins:[range],
        autoInit:false,
        suspend:true,
        whensRecountUnitWH:['resize','adjust']
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
        D.show(_elm)
        var _frame = d.autoResponsive.frame;
        D.css(_elm,{
            visibility:'visible',
            opacity:1,
            '-webkit-transform':_elm.style.MozTransform +'rotate('+360*_frame+'deg)'
        });
    })
    test.init();
     setTimeout(function(){

          range.filter({
                dataAttr:'fil',

                attrName:'data-filter',
                hide:true
            });
        
        test.adjust();

        setTimeout(function(){
        range.priority({
            dataAttr:'ex',

            attrName:'data-priority'
        });
        test.adjust();
        setTimeout(function(){

                range.clear();
                test.adjust();
        },1000)

        },1000)

     },1000)      
});
