KISSY.Config.debug = true;
KISSY.config({
    packages:[
        {
            name:"gallery",
            tag:"20130305",
            path:"../../gallery/",
            ignorePackageNameInUri:true,
            charset:"utf-8"
        }
    ]
});
KISSY.use('gallery/autoResponsive/1.1/index',function(S,T){

    var E = S.Event,D = S.DOM;
    var hash1 = new T.Hash({
        prefix:'ks-'
    });

    var hash = new T({
        container:'.J_container_hash',
        selector:'div',
        unitMargin:{
            x :30,
            y:30
        },
        autoInit:false,
        plugins:[hash1]
    });

    var getRandomColor = function(){
        return (function(m,s,c){
            return (c ? arguments.callee(m,s,c-1) : '#') +
                s[m.floor(m.random() * 16)]
        })(Math,'0123456789abcdef',5)
    };
    hash.on('beforeUnitArrange',function(d){
        var _elm = d.autoResponsive.elm;
        D.css(_elm,{
            visibility:'hidden',
            opacity:0,
            background:getRandomColor()
        });
    });
    hash.on('afterUnitArrange',function(d){

        var _elm = d.autoResponsive.elm;
        setTimeout(function(){
            D.css(_elm,{
                visibility:'visible',
                opacity:1
            });
        },parseInt(Math.random()*(1000+1)))
    });
    hash.init();
    E.on(window,'hashchange',function(i){
        hash.init();
    })
});
