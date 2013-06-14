概述
=
autoResponsive，是基于 KISSY 1.3.0 或更高版本的自适应布局组件。
>
>* version: 1.0
>* page: [github](http://xudafeng.github.io/autoResponsive/ "github")
>* author: dafeng
>* website: [xdf.me](http://xdf.me/ "blog")
>* email: dafeng.xdf [at] taobao.com

#### 她的特点
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
KISSY.use('gallery/autoResponsive/1.0/index', function (S, AutoResponsive) {
	var AutoResponsive = new AutoResponsive({
			container:'#J_container',
			selector:'div',
			colMargin:{
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
        <td>生效选择器
        </td>
    </tr>
    <tr>
        <td>init</td>
        <td>Boolean</td>
        <td>true</td>
        <td>r/w</td>
        <td>默认自动初始化
        </td>
    </tr>
    <tr>
        <td>filter</td>
        <td>String</td>
        <td>''</td>
        <td>r/w</td>
        <td>过滤选择器
        </td>
    </tr>
    <tr>
        <td>priority</td>
        <td>String</td>
        <td>''</td>
        <td>r/w</td>
        <td>优先排序选择器</td>
    </tr>
    <tr>
        <td>colWidth</td>
        <td>Number</td>
        <td>10</td>
        <td>r/w</td>
        <td>最小栅格单元设置<code>px</code></td>
    </tr>

    <tr>
        <td>colMargin</td>
        <td>Object</td>
        <td><code>{x:0,y:0}</code></td>
        <td>r/w</td>
        <td>单元格边距设置</td>
    </tr>
    <tr>
        <td>animate</td>
        <td>Boolean</td>
        <td>true</td>
        <td>r/w</td>
        <td>动画效果开关</td>
    </tr>
    <tr>
        <td>duration</td>
        <td>Number</td>
        <td>1</td>
        <td>r/w</td>
        <td>动画缓动时间</td>
    </tr>
    <tr>
        <td>easing</td>
        <td>String</td>
        <td>"easeNone"</td>
        <td>r/w</td>
        <td>动画缓动算子</td>
    </tr>
    <tr>
        <td>direction</td>
        <td>String</td>
        <td>"left"</td>
        <td>r/w</td>
        <td>排序方向,可以选择<code>right</code></td>
    </tr>
    <tr>
        <td>random</td>
        <td>Boolean</td>
        <td>false</td>
        <td>r/w</td>
        <td>随机顺序开关</td>
    </tr>
    <tr>
        <td>sort</td>
        <td>String</td>
        <td>""</td>
        <td>r/w</td>
        <td>排序优先算法</td>
    </tr>
    <tr>
        <td>async</td>
        <td>Boolean</td>
        <td>false</td>
        <td>r/w</td>
        <td>动画异步队列开关</td>
    </tr>
    <tr>
        <td>autoHeight</td>
        <td>Boolean</td>
        <td>true</td>
        <td>r/w</td>
        <td>容器高度自适应开关</td>
    </tr>
    <tr>
        <td>resize</td>
        <td>Boolean</td>
        <td>true</td>
        <td>r</td>
        <td>浏览器resize适应开关</td>
    </tr>
    <tr>
        <td>plugin</td>
        <td>Array</td>
        <td>[]</td>
        <td>r/w</td>
        <td>插件队列</td>
    </tr>
    <tr>
        <td>resizeFrequency</td>
        <td>Number</td>
        <td>200</td>
        <td>r/w</td>
        <td>resize触发频率</td>
    </tr>
    </tbody>
</table>

## 常用方法说明
####init ()：初始化组件

```javascript
/**
* 默认自动初始化 ，如需手动初始化，请设置 init:false
* 用于手动初始化组件的情况
*/
KISSY.use('gallery/autoResponsive/1.0/index', function (S, AutoResponsive) {
	var AutoResponsive = new AutoResponsive({
			container:'#J_container',
			selector:'div',
			colMargin:{
				x :10,
				y:10
			},
			init:false //设置false
	});
	autoResponsive.init();
});

```
####adjust ()：重新布局（所有子元素）

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
* demo:http://xudafeng.github.io/autoResponsive/cat/demos/#colMargin
*/
autoResponsive.margin({ x:10, y:20 });
```
####random ()：随机排序

```javascript
//随机排序
autoResponsive.random();
```
####option ()：自定义配置

```javascript
//自定义配置
autoResponsive.option();
```
####append ()：动态append节点

```javascript
//append节点
autoResponsive.append();
```
####prepend ()：动态prepend节点

```javascript
//prepend节点
autoResponsive.prepend();
```

## 事件说明

<table class="table table-bordered table-striped">
    <thead>
    <tr>
        <th style="width: 100px;">事件名</th>
        <th>描述</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>init </td>
        <td>组件初始化完成后触发</td>
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
        <td>beforeElemSort </td>
        <td>单元素排序前触发</td>
    </tr>
    <tr>
        <td>afterElemSort  </td>
        <td>单元素排序后触发</td>
    </tr>
    </tbody>
</table>

##插件说明

###effect：效果增强

###hash：hash回溯定位

##Q&A