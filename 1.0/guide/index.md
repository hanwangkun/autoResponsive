## 综述

autoResponse，是基于kissy 1.3.0或者更高版本的自适应组件。

* 版本：1.0
* 作者：达峰


#### autoResponse的特点


* 支持条件排序、随机排序，过滤排序
* 支持css3特效
* 兼容kissy瀑布流组件

## demo

[更多文档](http://xudafeng.github.io/autoResponse/cat/demos/)

## 组件使用





### 1.加载AutoResponse模块,初始化AutoResponse

```javascript
    KISSY.use('gallery/offline/1.0/autoResponse', function (S, AutoResponse) {
        var autoResponse = new AutoResponse();
    })
```
**提醒**：use()的回调，第一个参数是KISSY，第二个参数才是组件。
