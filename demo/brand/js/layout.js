/**
 *品牌运营后台布局模块
 */
;KISSY.add('layout',function(S,$,AutoResponsive,LineChart,barChart,pieChart,Template){
        'use strict';
        var D = S.DOM,E = S.Event,
            colPrifix = 'aRps-col',
            filterPrifix = 'filter-',
            TPL = D.val('#template'),
            ltIE8 = S.UA.ie < 9;

        /**
         *
         * @param cfg
         * @constructor
         */
        function Layout(cfg){
            var self = this;
            self.auto = {};
            self.container = cfg.container;
            self.init();
        }
        S.augment(Layout,{
            init:function(){
                var self = this;
                self.layout();
            },
            getData:function(){
                var self = this;
            },
            getRender:function(){
                var self = this;
                self.renderType = self.globalCurrentType;
                return new Template(TPL).render({
                    type:colPrifix + self.globalCurrentType
                });
            },
            layout:function(){
                var self = this;
                self.response();
                //self.getData();
            },
            response:function(){
                var self = this,
                    container = self.container,
                    currentWidth = D.outerWidth(container),
                    _colType = self.widthRouter(currentWidth).colType,
                    _colWidth = self.widthRouter(currentWidth).colWidth;
                self.auto = new AutoResponsive({
                    container: container,
                    selector: '.block',
                    autoInit:false,
                    unitMargin:{
                        x:_colWidth,
                        y:12
                    },
                    gridWidth:2,
                    duration: 0.1,
                    whensRecountUnitWH:['resize','adjust'],
                    delayOnResize:ltIE8 ? -1 :100,
                    priority: '.col'+_colType+'-priority',
                    closeAnim:false
                });
                self.auto.on('afterUnitSort',function(e){
                    var target = e.autoResponsive.elm;
                    setTimeout(function(){
                        self.drawChart(target);
                    },10);
                    setTimeout(function(){
                        D.css(target,{
                            visibility:'visible'
                        });
                    },30);
                });
                self.auto.on('afterSort',function(){
                    setTimeout(function(){
                        D.removeClass(container,'loading');
                    },1000)
                });
                self.auto.on('beforeResize',function(){
                    self.adjustForChange();
                });
                self.auto.init();
                self.auto.append(D.create(self.getRender()));
            },
            adjustForChange:function(){
                var self = this,i,
                    currentWidth = D.outerWidth(self.container),
                    _colType = self.widthRouter(currentWidth).colType,
                    _colWidth = self.widthRouter(currentWidth).colWidth;
                if(self.renderType !=  _colType){
                    var _index = self.renderType;
                    S.each(S.query('.'+colPrifix+_index),function(i){
                        D.replaceClass(i,colPrifix+_index,colPrifix+_colType);
                    });
                    D.replaceClass('.filter',filterPrifix+colPrifix+_index,filterPrifix+colPrifix+_colType);
                    self.renderType =  _colType;
                }
                self.auto.changeCfg({
                    unitMargin:{
                        x:_colWidth,
                        y:12
                    }
                });
                if(_colType ==3){
                    i = '.col3-priority';
                }else if(_colType ==1){
                    i = '.col1-priority';
                }else if(_colType ==2){
                    i = '.col2-priority';
                }else if(_colType ==4){
                    i = '.col4-priority';
                }else{
                    i = '.user';
                }
                self.auto.changeCfg({
                    priority:i
                });
            },
            widthRouter:function(width){
                var self = this,
                    _width = width,
                    _colType,
                    percents = [96,46,30,24];
                switch(true){
                    case 920 < _width && _width < 1220:
                        _colType = 3;
                        break;
                    case 720 < _width && _width < 920:
                        _colType = 2;
                        break;
                    case _width < 720:
                        _colType = 1;
                        break;
                    default:
                        _colType = 4;
                        break;
                };
                self.globalCurrentType = _colType;
                return {
                    colWidth:parseInt((_width*(1 - percents[_colType-1]/100*_colType))/(_colType + 1))-4,
                    colType:_colType
                };
            },
            drawChart:function(elm){
                if(!D.hasClass(elm,'chart')){
                    return;
                }
                if(D.hasClass(elm,'bord')){

                    new barChart({
                        renderTo:elm,
                        title:{
                            content:'<div>访客数</div>',
                            css:{
                                color:'#333333',
                                textAlign:'left',
                                marginLeft:'20px',
                                fontSize:'14px',
                                marginTop:'10px'
                            }
                        },
                        colors:[{"DEFAULT":"#b41700","HOVER":"#ccc"}],
                        subTitle:{
                            content:""
                        },
                        xAxis: {
                            text:[' ','06-09',' ','06-08',' ','06-10']
                        },
                        canvasAttr:{
                            x:35,
                            y:40
                        },
                        yAxis:{
                            min:1000,
                            max:5500,
                            num:1
                        },
                        series:[
                            {
                                data:[2000,5000,6000,2000,5000,6000]
                            }],
                        tip:{
                            template:"访问量：<span>{{y}}</span> <br/>"
                        }
                    });
//                var data = [{data:30,label:'30%','tip':'per'},{data:30,label:'30%','tip':'per'},{data:40,label:'40%','tip':'percent'}]
//                    ,colors = [
//                        {DEFAULT:"#b41700",HOVER:"#cccccc"},
//                        {DEFAULT:"#cccccc",HOVER:"#cccccc"}
//                    ];
//                var piechart = new pieChart({
//                    renderTo:elm,
//                    cx:150,
//                    cy:150,
//                    R:100,
//                    r:60,
//                    data:data,
//                    colors:colors,
//                    anim:{
//                        type:'sector',
//                        easing:'bounceOut',
//                        duration:1000
//                    },
//                    tip:{
//                        boundryDetect:true,
//                        tpl:"{{tip}} {{percent*100+'%'}}"
//                    }
//                });
                }else{

                    new LineChart({
                        renderTo:elm,
                        title:{
                            content:'<div>访客数</div>',
                            css:{
                                color:'#333333',
                                textAlign:'left',
                                marginLeft:'20px',
                                fontSize:'14px',
                                marginTop:'10px'
                            }
                        },
                        canvasAttr:{
                            x:35,
                            y:40
                        },
                        colors:[{"DEFAULT":"#b41700","HOVER":"#ccc"}],
                        subTitle:{
                            content:""
                        },
                        xAxis: {
                            text:[' ','06-09',' ','06-08',' ','06-10','',' ','06-09',' ','06-08',' ','06-10','',' ','06-09',' ','06-08',' ','06-10','']
                        },
                        yAxis:{
                            min:2000,
                            max:6000,
                            num:1
                        },
                        series:[
                            {
                                data:[2000,3000,2500,2400,5000,3000,2000,2000,3000,2500,2400,5000,3000,2000,2000,3000,2500,2400,4000,3000,2000]
                            }],
                        tip:{
                            template:"访问量：<span>{{y}}</span> <br/>"
                        }
                    });
                }

            }
        });
        return Layout;
    }, {requires: [
        'node','gallery/autoResponsive/1.1/base',
        'gallery/kcharts/1.1/linechart/index',
        'gallery/kcharts/1.1/barchart/index',
        'gallery/kcharts/1.1/piechart/index',
        'xtemplate'
    ]}
);