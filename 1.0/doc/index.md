##概述

autoResponsive，是基于 KISSY 1.3.0 或更高版本的自适应布局组件。

>* version: 1.1
>* page: [github](http://xudafeng.github.io/autoResponsive/ "github")
>* author: dafeng
>* website: [xdf.me](http://xdf.me/ "blog")
>* email: dafeng.xdf [at] taobao.com

###请使用新版本1.1

## 她的特点
* 支持条件排序、随机排序
* 支持特定条件的过滤排序
* 兼容KISSY瀑布流组件
* 支持动态自定义配置
* 支持css3特效、用户自定义特效
* 支持边距自定义
* 排序元素支持复杂dom结构
* 支持自定义展示方向
* 支持拖拽功能[重构中]
* hash回溯路由

## 快速上手
### 1.依赖如下dom结构
```css
<style>
    .ks-autoResponsive-container{
        position:relative;
        overflow: hidden;
    }
    .ks-autoResponsive-container div{
        position:absolute;
    }
</style>
```
**注意**
* 外层容器为relative
* 排布元素需设置为absolute

```xml
<div class="ks-autoResponsive-container" id="J_container">
    ……
</div>
```
### 2.init 初始化

#### KISSY 1.2.0 需要增加如下包配置
```javascript
KISSY.config({
    packages:[
        {
            name:"gallery",
            path:"http://a.tbcdn.cn/s/kissy/",
            charset:"utf-8"
        }
    ]
});
```
#### KISSY 1.3.0 无需配置,直接初始化即可
```javascript
KISSY.use('gallery/autoResponsive/1.1index', function (S, Ar) {
	var AutoResponsive = new Ar({
			container:'#J_container',
			selector:'div',
			unitMargin:{
				x :10,
				y:10
			}
	});
})
```
**提醒**
* container为外层容器选择器
* selector为排布元素选择器
* use()回调的第一个参数是KISSY，第二个参数才是组件

### 3.配置项
####常用参数：
<table>
    <thead>
    <tr>
        <th>参数名</th>
        <th>类型</th>
        <th>默认值</th>
        <th>读写权限</th>
        <th>描述</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>container</td>
        <td>String</td>
        <td>''</td>
        <td>r/w</td>
        <td>外层容器</td>
    </tr>
    <tr>
        <td>selector</td>
        <td>String</td>
        <td>''</td>
        <td>r/w</td>
        <td>单元选择器</td>
    </tr>
    <tr>
        <td>filter</td>
        <td>String</td>
        <td>''</td>
        <td>r/w</td>
        <td>单元过滤器</td>
    </tr>
    <tr>
        <td>priority</td>
        <td>String</td>
        <td>''</td>
        <td>r/w</td>
        <td>优先选择器</td>
    </tr>
    <tr>
        <td>gridWidth</td>
        <td>Number</td>
        <td>10</td>
        <td>r/w</td>
        <td>最小栅格单元宽度<code>px</code></td>
    </tr>

    <tr>
        <td>unitMargin</td>
        <td>Object</td>
        <td><code>{x:0,y:0}</code></td>
        <td>r/w</td>
        <td>单元格外边距<code>px</code></td>
    </tr>
    <tr>
        <td>closeAnim</td>
        <td>Boolean</td>
        <td>false</td>
        <td>r/w</td>
        <td>是否关闭动画（默认开启）</td>
    </tr>
    <tr>
        <td>duration</td>
        <td>Number</td>
        <td>1</td>
        <td>r/w</td>
        <td>补间动画时间onlyIE</td>
    </tr>
    <tr>
        <td>easing</td>
        <td>String</td>
        <td>"easeNone"</td>
        <td>r/w</td>
        <td>补间动画算子onlyIE</td>
    </tr>
    <tr>
        <td>direction</td>
        <td>String</td>
        <td>"left"</td>
        <td>r/w</td>
        <td>排序起始方向（可选值：<code>'right'</code>）</td>
    </tr>
    <tr>
        <td>random</td>
        <td>Boolean</td>
        <td>false</td>
        <td>r/w</td>
        <td>随机排序开关（默认关闭）</td>
    </tr>
    <tr>
        <td>sortBy</td>
        <td>String</td>
        <td>""</td>
        <td>r/w</td>
        <td>排序算法（可选值：<code>'grid'</code>或<code>'cell'</code>，默认为<code>'grid'</code>）</td>
    </tr>
    <tr>
        <td>suspend</td>
        <td>Boolean</td>
        <td>true</td>
        <td>r/w</td>
        <td>渲染任务队列是否支持挂起（挂起时主动将执行交给UI线程 | 默认为true）</td>
    </tr>
    <tr>
        <td>autoHeight</td>
        <td>Boolean</td>
        <td>true</td>
        <td>r/w</td>
        <td>容器高度自适应开关（默认为true）</td>
    </tr>
    <tr>
        <td>plugins</td>
        <td>Array</td>
        <td>[]</td>
        <td>r/w</td>
        <td>插件队列</td>
    </tr>
    <tr>
        <td>autoInit</td>
        <td>Boolean</td>
        <td>true</td>
        <td>r/w</td>
        <td>是否自动初始化（默认为true）</td>
    </tr>
    <tr>
        <td>closeResize</td>
        <td>Boolean</td>
        <td>false</td>
        <td>r/w</td>
        <td>是否关闭resize绑定（默认不关闭）</td>
    </tr>
    <tr>
        <td>resizeFrequency</td>
        <td>Number</td>
        <td>200</td>
        <td>r/w</td>
        <td>resize触发频率</td>
    </tr>
    <tr>
        <td>whensRecountUnitWH</td>
        <td>Array</td>
        <td>[]</td>
        <td>r/w</td>
        <td>重新计算单元宽高的行为时刻(可选值：<code>'closeResize', 'adjust'</code>)</td>
    </tr>
    </tbody>
</table>
**提醒**
* duration、easing配置只针对IE，css3浏览器请使用<code>transition: all .3s ease-in 0s;</code>设置以提高性能

## 常用方法说明
####init ()：初始化组件

```javascript
/**
* 默认自动初始化 ，如需手动初始化，请设置 autoInit:false
* 用于手动初始化组件的情况
*/
KISSY.use('gallery/autoResponsive/1.1/index', function (S, AutoResponsive) {
	var autoResponsive = new AutoResponsive({
			container:'#J_container',
			selector:'div',
			unitMargin:{
				x :10,
				y:10
			},
			autoInit:false //设置false
	});
	autoResponsive.init();
});

```
####adjust (isRecountUnitWH)：重新布局（所有子元素）

```javascript
//重新调整排序
autoResponsive.adjust();
```
####priority ()：调整优先顺序

```javascript
/**
* 优先排序
* demo:http://xudafeng.github.io/autoResponsive/cat/demos/#priority
*/
autoResponsive.priority('.red');
```
####filter ()：过滤排序

```javascript
/**
* 过滤排序
* demo:http://xudafeng.github.io/autoResponsive/cat/demos/#filter
*/
autoResponsive.filter();
```
####margin ()：边距设置

```javascript
/**
* 边距设置
* demo:http://xudafeng.github.io/autoResponsive/cat/demos/#unitMargin
*/
autoResponsive.margin({
	x: 10, 
	y: 20 
});
```
####random ()：随机排序

```javascript
//随机排序
autoResponsive.random();
```
####option ()：自定义配置

```javascript
/**
* 动态改变配置
*/
autoResponsive.option({
	unitMargin:{
		x :10,
		y:1
	},
	priority : '.green'
});
```
#### append ()：动态append、prepend节点

```javascript
/**
* demo: http://xudafeng.github.io/autoResponsive/cat/custom/#append
*/
KISSY.use('gallery/autoResponsive/1.1/index',function(S,T){
    var E = S.Event,D = S.DOM;

    var append = new T({
        container:'.J_container_append',
        selector:'div',
        unitMargin:{
            x :10,
            y:10
        }
    });

    E.on('.J_button_append','click',function(e){
        var _target = e.target;
        if(D.hasClass(_target,'append')){
            append.append(D.create('<div class="block red">1+</div>'));
        }else if(D.hasClass(_target,'prepend')){
            append.prepend(D.create('<div class="block red">1</div>'));
        }else if(D.hasClass(_target,'remove')){
            D.remove(D.get('.block','.J_container_append'));
            append.adjust();
        }
    });
});
```
**注意**
* 针对瀑布流对append方法做了性能优化：[性能压测](http://xudafeng.github.io/autoResponsive/demo/waterfall/stress.html)

## 事件说明
<table>
    <thead>
    <tr>
        <th>事件名</th>
        <th>描述</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>beforeInit </td>
        <td>初始化前触发</td>
    </tr>
    <tr>
        <td>afterInit </td>
        <td>初始化后触发</td>
    </tr>
    <tr>
        <td>resize </td>
        <td>浏览器resize时添加动作</td>
    </tr>
    <tr>
        <td>beforeSort </td>
        <td>排序前触发</td>
    </tr>
    <tr>
        <td>afterSort </td>
        <td>排序后触发</td>
    </tr>
    <tr>
        <td>beforeUnitSort </td>
        <td>单元素排序前触发</td>
    </tr>
    <tr>
        <td>afterUnitSort  </td>
        <td>单元素排序后触发</td>
    </tr>
    </tbody>
</table>
**注意**
* 具体使用例子参见各demo

##插件说明

####drag：拖拽功能
####loader：加载器
####hash：hash回溯路由
##优秀demo
####<a href="http://xudafeng.github.io/autoResponsive/demo/crossend/" target="_blank">专辑跨终端（resize例子）</a>
####<a href="http://xudafeng.github.io/autoResponsive/cat/demos/xfs.html" target="_blank">新风尚大促（filter例子）</a>
####<a href="http://xudafeng.github.io/autoResponsive/demo/loader/" target="_blank">专题List(loader例子)</a>
##License
>The MIT License (MIT)

>Permission is hereby granted, free of charge, to any person obtaining a copy
>of this software and associated documentation files (the "Software"), to deal
>in the Software without restriction, including without limitation the rights
>to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
>copies of the Software, and to permit persons to whom the Software is
>furnished to do so, subject to the following conditions:

>The above copyright notice and this permission notice shall be included in
>all copies or substantial portions of the Software.

>THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
>IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
>FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
>AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
>LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
>OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
>THE SOFTWARE.