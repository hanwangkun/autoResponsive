KISSY.use('gallery/autoResponsive/1.3/index',function(S,T){

    var E = S.Event,D = S.DOM;
    var container = S.get('.J_container_roll');
    var test = new T({
        container:container,
        selector:'.block',
        unitMargin:{
            x :0,
            y:0
        },
        fixedSize:{
            width:320,
            height:108
        },
        gridWidth:160,
        autoInit:false,
        suspend:true,
        whensRecountUnitWH:['resize','adjust']
    });
    test.on('beforeUnitArrange',function(d){
        var _elm = d.autoResponsive.elm;
        D.removeClass(_elm,'animation');
    });
    test.on('afterUnitArrange',function(d){
        var _elm = d.autoResponsive.elm;
        D.addClass(_elm,'animation');
    });
    test.on('afterArrange',function(){

    })
    test.init();
    E.on('.j_change','click',function(){
    
        if(D.hasClass(container,'col1')){
            test.changeCfg({
                fixedSize:{
                    width:160,
                    height:229
                }
            });
                    test.adjust();



            setTimeout(function(){
                        D.removeClass(container,'col1');
            D.addClass(container,'col2');

            },20)



        }else if(D.hasClass(container,'col2')){
            test.changeCfg({
                fixedSize:{
                    width:320,
                    height:393
                }
            });
        test.adjust();


            setTimeout(function(){
                        D.removeClass(container,'col2');
            D.addClass(container,'col3');

            },20)

        }else if(D.hasClass(container,'col3')){
                        test.changeCfg({
                fixedSize:{
                    width:320,
                    height:108
                }
            });
        test.adjust();

            setTimeout(function(){
                        D.removeClass(container,'col2');
            D.addClass(container,'col1');

            },20)

        }
    })  
});
