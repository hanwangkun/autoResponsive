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
               <table class="table table-bordered table-striped">
                    <thead>
                    <tr>
                        <th style="width: 100px;">参数名</th>
                        <th style="width: 50px;">类型</th>
                        <th style="width: 130px;">默认值</th>
                        <th style="width: 200px;">读写权限</th>
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
                        <td>"on"</td>
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
                        <td>"off"</td>
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
                        <td>drag</td>
                        <td>Boolean</td>
                        <td>"off"</td>
                        <td>r/w</td>
                        <td>拖拽功能开关</td>
                    </tr>
                    <tr>
                        <td>autoHeight</td>
                        <td>Boolean</td>
                        <td>"on"</td>
                        <td>r/w</td>
                        <td>容器高度自适应开关</td>
                    </tr>
                    <tr>
                        <td>resize</td>
                        <td>Boolean</td>
                        <td>"on"</td>
                        <td>r</td>
                        <td>浏览器resize适应开关</td>
                    </tr>
                    <tr>
                        <td>hash</td>
                        <td>Boolean</td>
                        <td>"on"</td>
                        <td>r/w</td>
                        <td>hash回溯开关</td>
                    </tr>
                    </tbody>
                </table>
