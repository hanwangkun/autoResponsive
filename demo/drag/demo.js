KISSY.use('gallery/autoResponsive/1.2/index',function(S,T){

    var E = S.Event,D = S.DOM;
    var drag2 = new T.Drag({
        closeConstrain :false,
        selector:'.block'
    });
    var test = new T({
        container:'.J_container_drag',
        selector:'div',
        unitMargin:{
            x :10,
            y:10
        },
        plugins:[drag2],
        duration:0.1,
        closeAnim:false,
        whensRecountUnitWH:['adjust']
    });
});
