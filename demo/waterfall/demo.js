KISSY.use("gallery/autoResponsive/1.1/index,waterfall,node,ajax", function (S,autoResponse, Waterfall, Node,IO) {
    var $ = Node.all,D = S.DOM,E= S.Event;

    var support = S.UA.ie<11;

    var auto;

    var tpl = ($('#tpl').html()),
        nextpage = 1,
        waterfall = new Waterfall.Loader({
            container:"#ColumnContainer",
            adjustEffect:{
                duration:0.5,
                easing:"easeInStrong"
            },
            load:function (success, end) {

                $('#loadingPins').show();
                IO({
                    data:{
                        'method':'flickr.photos.search',
                        'api_key':'5d93c2e473e39e9307e86d4a01381266',
                        'tags':'rose',
                        'page':nextpage,
                        'per_page':20,
                        'format':'json'
                    },
                    url:'http://api.flickr.com/services/rest/',
                    dataType:"jsonp",
                    jsonp:"jsoncallback",
                    success:function (d) {

                        if (d['stat'] !== 'ok') {
                            alert('load data error!');
                            end();
                            return;
                        }
                        nextpage = d['photos'].page + 1;
                        if (nextpage > d['photos'].pages) {
                            end();
                            return;
                        }
                        var items = [];
                        S.each(d['photos']['photo'], function (item) {
                            item.height = Math.round(Math.random() * (300 - 180) + 180); // fake height
                            items.push(new S.Node(S.substitute(tpl,item)));
                        });

                        success(items);

                    },
                    complete:function () {
                        $('#loadingPins').hide();
                        setTimeout(function(){
                            auto.adjust();
                        },10)

                    }
                });
            },
            minColCount:0,
            colWidth:228
        });
    E.detach(window,'resize');
    auto = new autoResponse({
        container:'#ColumnContainer',
        selector:'.pin',
        unitMargin:{
            x :10,
            y:20
        },
        autoInit:false,
        suspend:true,
        duration:support ? 0.1 :0.6,
        closeAnim:support ? true : false,
        whensRecountUnitWH:['adjust']
    });
    auto.on('beforeUnitArrange',function(d){
        var i = d.autoResponsive.elm;
        D.removeAttr(i,'data-waterfall-col');
        !support&&D.css(i,{
            left:0,
            top:0
        });
        D.data(i, 'data-done', true);
    })
    auto.on('afterUnitArrange',function(d){
        var _elm = d.autoResponsive.elm;
        var _frame = d.autoResponsive.frame;
        D.css(_elm,{
            visibility:'visible',
            opacity:1
        });
    })
    auto.init();
    // scrollTo
    $('#BackToTop').on('click', function (e) {
        e.halt();
        e.preventDefault();
        $(window).stop();
        $(window).animate({
            scrollTop:0
        }, 1, "easeOut");
    });

    $("#ColumnContainer").delegate("click", ".del", function (event) {
        var w = $(event.currentTarget).parent(".ks-waterfall");
        w.remove();
        auto.adjust();
    });


    $("#ColumnContainer").delegate("click", ".grow", function (event) {
        var w = $(event.currentTarget).parent(".ks-waterfall");
        waterfall.adjustItem(w, {
            effect:{
                easing:"easeInStrong",
                duration:0.1
            },
            process:function () {
                w.append("<p>i grow height by 100</p>");
                auto.adjust();
            },
            callback:function () {

            }
        });
    });
    $("#ColumnContainer").delegate("click", ".expand", function (e) {

        var w = $(e.currentTarget).parent(".ks-waterfall");

        if(D.hasData(w,'data-css')){
            D.html(e.currentTarget,'ok');
            var _data = D.data(w,'data-css');
            D.removeData(w,'data-css');
            D.css(w[0],{
                width:_data.width,
                height:_data.height
            })
        }else{
            D.html(e.currentTarget,'ok');
            D.data(w,'data-css',{
                width: D.width(w),
                height: D.height(w)
            });
            D.css(w[0],{
                width:D.outerWidth(w)*2-10,
                height:D.outerHeight(w)*1.5,
                zIndex:999
            })
        }

        setTimeout(function(){
            auto.adjust();
        },1000)

    });
});

