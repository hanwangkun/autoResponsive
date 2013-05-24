综述
============

autoResponsive，是基于kissy 1.3.0或者更高版本的自适应组件。

* 版本：1.0
* 作者：达峰


#### autoResponsive的特点


* 支持条件排序、随机排序，过滤排序
* 支持css3特效
* 兼容kissy瀑布流组件
* 支持自定义配置

### [demo汇总](http://xudafeng.github.io/autoResponsive/cat/demos/)

## 快速上手

kissy1.2需要配置gallery的包：

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

kissy1.3无需配置配置。

### init

```javascript
    KISSY.use('gallery/autoResponsive/1.0/index', function (S, AutoResponsive) {
        var AutoResponsive = new AutoResponsive({
            container:'.J_container',
            selector:'div',
            colMargin:{
                x :10,
                y:10
            }
        });
    })
```
**提醒**：use()的回调，第一个参数是KISSY，第二个参数才是组件。

### 组件依赖的html结构

```xml
    <div class="ks-autoResponsive-container J_container">
        ……
    </div>
```

组件的容器请设置为relative

### 2.配置项

## 组件事件说明

<table class="table table-bordered table-striped">
    <thead>
    <tr>
        <th style="width: 100px;">事件名</th>
        <th>描述</th>
    </tr>
    </thead>
    <tbody>
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
```javascript
    KISSY.use('gallery/autoResponsive/1.0/index', function (S, AutoResponsive) {
        var AutoResponsive = new AutoResponsive({
            container:'.J_container',
            selector:'div',
            colMargin:{
                x :10,
                y:10
            }
        });
        var getRandomColor = function(){
            return (function(m,s,c){
                return (c ? arguments.callee(m,s,c-1) : '#') +
                    s[m.floor(m.random() * 16)]
            })(Math,'0123456789abcdef',5)
        };
        AutoResponsive.on('resize',function(d){
            D.css(S.get('body'),{
             background:getRandomColor()
            })
        })
    })
```

####常用参数：*****

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

##Uploader方法说明

####upload (index)：上传指定队列索引的文件

```javascript
//上传队列中的第一个文件
uploader.upload(0)
```

####uploadFiles (status)：批量上传队列中的指定状态下的文件

```javascript
//上传队列中所有等待的文件
uploader.uploadFiles("waiting")
```

####cancel  (index)：取消文件上传

当index参数不存在时取消当前正在上传的文件的上传。cancel并不会停止其他文件的上传（对应方法是stop）。

```javascript
//取消当前正在上传的文件的上传
uploader.cancel();
```

####stop()：停止上传动作

```javascript
//停止上传
uploader.stop();
```

####theme():运行主题实例

```javascript
uploader.theme(new DefaultTheme({
    queueTarget:'#J_UploaderQueue'
}))
```

####plug():将插件插入到uploader中

```javascript
//验证插件
uploader.plug(new Auth({
        //最多上传个数
        max:3,
        //图片最大允许大小
        maxSize:100
    }))
     //url保存插件
    .plug(new UrlsInput({target:'#J_Urls'}))
```

####getPlugin(pluginName):获取插件

```javascript
//验证插件
uploader.getPlugin('auth');
```

插件名称可以对照插件的模块路径上的名称<code>gallery/uploader/1.4/plugins/auth/auth</code>。



##Queue的控制说明

Queue用于控制队列的文件，非常常用，实例存储在Uploader中。


```javascript
var queue = uploader.get('queue');
```



####Queue的files属性

queue的属性只有<code>files</code>，可以获取到所有上传的文件数据，为一个数组。

```javascript
var queue = uploader.get('queue');
var files = queue.get('files');
S.log(files.length);
```

####add():向队列添加文件

```javascript
//测试文件数据
var testFile = {'name':'test.jpg',
    'size':2000,
    'input':{},
    'file':{'name':'test.jpg', 'type':'image/jpeg', 'size':2000}
};
//向队列添加文件
var file = queue.add(testFile);
S.log('添加的文件数据为：'+file);
```

当组件向队列添加文件时，会自动生成一个唯一id，比如'file-10'，'file-'前缀是一样的，可以通过id来获取指定的文件。


####remove():删除队列中的文件

```javascript
var removeFile = queue.remove(0);
S.log('删除的文件数据为：'+removeFile);
```

**提醒**：remove()的参数可以是队列数组的索引，比如上面代码的0，是取队列第一个文件数据；也可以是文件的id（唯一），比如remove('file-26')。

####clear():删除队列内的所有文件

```javascript
    queue.clear();
```
####getFiles(status):获取指定状态下的文件

```javascript
var files = queue.getFiles('waiting'),
        ids = [];
S.each(files, function (file) {
    ids.push(file.id);
});
alert('所有等待中的文件id为：' + ids);
```
####getIndexs(type):获取等指定状态的文件对应的文件数组索引值组成的数组

```javascript
var indexs = queue.getIndexs('waiting');
alert('所有等待中的文件index为：' + indexs);
```

getFiles()和getIndexs()的作用是不同的，getFiles()类似过滤数组，获取的是指定状态的文件数据，而getIndexs()只是获取指定状态下的文件对应的在文件数组内的索引值。

##Theme说明

####Theme的使用

使用<code>theme()</code>方法初始化主题逻辑，代码如下：

```javascript
    uploader.theme(new DefaultTheme({
        queueTarget:'#J_UploaderQueue'
    }))
```

####如何理解主题的概念

Uploader的主题包含二个部分：脚本（index.js）和样式（style.css）。

主题的脚本可以理解为uploader事件监听器集合，主题脚本的模版如下：

```javascript
KISSY.add(function (S, Node, ImageUploader) {
    var EMPTY = '', $ = Node.all;

    /**
     * @name RefundUploader
     * @class 退款凭证上传主题，继承于imageUploader主题
     * @constructor
     * @extends Theme
     * @requires Theme
     * @requires  ProgressBar
     * @author 明河
     */
    function RefundUploader(config) {
        var self = this;
        //调用父类构造函数
        RefundUploader.superclass.constructor.call(self, config);
    }

    S.extend(RefundUploader, ImageUploader, /** @lends RefundUploader.prototype*/{
        /**
         * 在上传组件运行完毕后执行的方法（对上传组件所有的控制都应该在这个函数内）
         * @param {Uploader} uploader
         */
        render:function () {
            var self = this;
            var uploader = self.get('uploader');
        },
        /**
         * 在完成文件dom插入后执行的方法
         * @param {Object} ev 类似{index:0,file:{},target:$target}
         */
        _addHandler:function(ev){

        },
         /**
         * 文件处于上传错误状态时触发
         */
        _errorHandler:function (ev) {

        }
    }, {ATTRS:/** @lends RefundUploader.prototype*/{
        name:{value:'refundUploader'}
    }});
    return RefundUploader;
}, {requires:['node', 'gallery/uploader/1.4/themes/imageUploader/index']});
```

主题中的<code>_errorHandler</code>，在上传失败时会自动触发，当然像"_addHandler"或"_successHandler"也是一样的道理。

####Theme的属性

<table class="table table-bordered table-striped">
        <thead>
        <tr>
            <th style="width: 100px;">属性名</th>
            <th style="width: 50px;">类型</th>
            <th style="width: 130px;">默认值</th>
            <th style="width: 200px;">是否只读</th>
            <th>描述</th>
        </tr>
        </thead>
        <tbody>
             <tr>
                 <td>name</td>
                 <td>String</td>
                 <td>''</td>
                 <td>只读</td>
                 <td>
                    主题名，是主题对应的模拟按钮和队列容器的样式名的前缀
                 </td>
             </tr>
              <tr>
                  <td>fileTpl</td>
                  <td>String</td>
                  <td>''</td>
                  <td>只读</td>
                  <td>
                  主题模版，用于定制主题的DOM样式
                  </td>
              </tr>
              <tr>
                  <td>authMsg</td>
                  <td>Object</td>
                  <td>{}</td>
                  <td>只读</td>
                  <td>
                  验证插件的消息文案
                  </td>
              </tr>
              <tr>
                  <td>allowExts</td>
                  <td>String</td>
                  <td>''</td>
                  <td>只读</td>
                  <td>
                    文件格式限制
                  </td>
              </tr>
              <tr>
                  <td>queueTarget</td>
                  <td>NodeList</td>
                  <td>''</td>
                  <td>只读</td>
                  <td>
                    队列容器目标元素
                  </td>
              </tr>
              <tr>
                  <td>uploader</td>
                  <td>Uploader</td>
                  <td>''</td>
                  <td>只读</td>
                  <td>
                    Uploader的实例
                  </td>
              </tr>
        </tbody>
</table>

####在html页面直接写主题模版

这是1.4新增功能，用于用户可以更直观的控制主题模版。

```javascript
<ul id="J_JsUploaderQueue">
      <script type="text/uploader-theme">
                  <li id="queue-file-{id}" class="g-u" data-name="{name}">
                      <div class="pic-wrapper">
                         <div class="pic">
                             <span><img class="J_Pic_{id} preview-img" src="" /></span>
                         </div>
                         <div class=" J_Mask_{id} pic-mask"></div>
                         <div class="status-wrapper J_FileStatus">
                             <div class="status waiting-status"><p>等待上传</p></div>
                             <div class="status start-status progress-status success-status">
                                 <div class="J_ProgressBar_{id}">上传中...</div>
                             </div>
                             <div class="status error-status">
                                 <p class="J_ErrorMsg_{id}">上传失败，请重试！</p></div>
                         </div>
                     </div>'+
                     <div>
                         <a class="J_Del_{id} del-pic" href="#">删除</a>
                     </div>
                 </li>'
      </script>
</ul>
```

模版代码必须包含在<code>script</code>标签内

```javascript
<script type="text/uploader-theme">
</script>
```


####如何自己写一套主题？

//TODO:日后补充

##插件说明

**如何获取插件呢？**

```javascript
    var auth = uploader.getPlugin('auth');
    //只允许上传一个文件
    auth.set('max',1);
```

**如何自己写一个uploader的插件呢？**

//TODO:日后补充

###auth：表单验证

####配置项（属性）

<table class="table table-bordered table-striped">
        <thead>
        <tr>
            <th style="width: 100px;">属性名</th>
            <th style="width: 50px;">类型</th>
            <th style="width: 130px;">默认值</th>
            <th style="width: 200px;">是否只读</th>
            <th>描述</th>
        </tr>
        </thead>
        <tbody>
             <tr>
                 <td>allowExts</td>
                 <td>String</td>
                 <td>''</td>
                 <td>读/写</td>
                 <td> 图片格式验证控制 </td>
             </tr>
             <tr>
                 <td>required</td>
                 <td>Boolean</td>
                 <td>''</td>
                 <td>读/写</td>
                 <td> 必须至少上传一个文件 <div class="alert alert-info">组件默认不触发，可以使用uploader的testRequired()方法手动验证。</div></td>
             </tr>
             <tr>
                 <td>max</td>
                 <td>Number</td>
                 <td>''</td>
                 <td>读/写</td>
                 <td>最多上传N个图片，当达到N个图片后按钮会增加禁用样式<code>uploader-button-disabled</code>，用户可以通过这个样式名定制需要的置灰样式。 </td>
             </tr>
             <tr>
                 <td>maxSize</td>
                 <td>Number</td>
                 <td>''</td>
                 <td>读/写</td>
                 <td>单图片最大允许上传的文件大小，单位是<code>KB</code> <div class="alert alert-info">如果是iframe上传方式，此验证无效。</div></td>
             </tr>
             <tr>
                 <td>allowRepeat</td>
                 <td>Boolean</td>
                 <td>''</td>
                 <td>读/写</td>
                 <td>是否允许多次上传同一个文件</td>
             </tr>
             <tr>
                 <td>widthHeight</td>
                 <td>Array</td>
                 <td>''</td>
                 <td>读/写</td>
                 <td>v1.4新增的验证规则，用于限制图片尺寸，非常特殊的验证方式：1.异步验证；2.值为一个函数数组[fnWidth,fnHeight]，比如限制宽度大于60，高度大于160，代码如下：

                        widthHeight:function(width,height){
                            return width > 160 && height > 160;
                        }
                 </td>
             </tr>
             <tr>
                 <td>msg</td>
                 <td>Object</td>
                 <td>{}</td>
                 <td>读/写</td>
                 <td>验证的消息集合，请使用msg()方法来设置消息</td>
             </tr>
        </tbody>
</table>

####auth的方法

**msg(rule,msg)**：获取/设置验证消息

```javascript
    var auth = uploader.getPlugin('auth');
    //设置max规则消息
    auth.msg('max','每次最多上传{max}个文件！');
    //获取max消息
    S.log(auth.msg('max'));
```

**testRequired()**：检验是否已经上传了至少一个文件

```javascript
    var auth = uploader.getPlugin('auth');
    var isPass = auth.testRequired();
    S.log(isPass);
```

其他的规则一样拥有test方法（"test+规则名()"）。

####auth的事件

当校验不通过是auth会触发uploader的error事件：

```javascript
uploader.on('error',function(ev){
    S.log(ev.rule);
})
```

###urlsInput：存储服务器返回的url并可以渲染默认数据

使用<code>urlsInput</code>插件，uploader会自动将服务器返回的url插入到一个input上。

需要有个目标容器：

```javascript
    <input type="hidden" id="J_Urls" name="refundImageUrls">
```


```javascript
    uploader.use('urlsInput',{target:'.J_Urls'});
```

####配置项（属性）

<table class="table table-bordered table-striped">
        <thead>
        <tr>
            <th style="width: 100px;">属性名</th>
            <th style="width: 50px;">类型</th>
            <th style="width: 130px;">默认值</th>
            <th style="width: 200px;">是否只读</th>
            <th>描述</th>
        </tr>
        </thead>
        <tbody>
             <tr>
                 <td>target</td>
                 <td>String</td>
                 <td>''</td>
                 <td>读</td>
                 <td>用于存储文件路径的目标容器</td>
             </tr>
             <tr>
                 <td>urls</td>
                 <td>Array</td>
                 <td>[]</td>
                 <td>读</td>
                 <td>容器内的所有路径</td>
             </tr>
             <tr>
                 <td>autoRestore</td>
                 <td>Boolean</td>
                 <td>true</td>
                 <td>读</td>
                 <td>是否自动渲染默认数据</td>
             </tr>
             <tr>
                 <td>split</td>
                 <td>String</td>
                 <td>","</td>
                 <td>读/写</td>
                 <td>多个路径间的分隔符</td>
             </tr>
        </tbody>
</table>

####urlsInput的方法


**add(url)**：向input添加路径

```javascript
    var urlsInput = uploader.getPlugin('urlsInput');
    urlsInput.add('http://www.36ria.com/test.jpg');
```

**remove(url)**：删除input内的指定路径

**isExist(url)**：是否已经存在指定路径

**restore()**：添加默认数据到队列

###tagConfig：从input上拉取配置覆盖组件配置

如果你希望可以在html配置组件属性，需要use("tagConfig")。

demo可以[猛击这里](http://butterfly.36ria.com/uploader/1.4/demo/tag-config-use.html)。

```xml
    <input class="g-u" id="J_UploaderBtn" name="Filedata" type="file" value="上传图片"
           action="upload.php" postData='{"author":"minghe"}' max="3" maxSize="500">
```

**提醒**：html中的配置会覆盖js的配置，这跟1.4前的逻辑相反。

**提醒**：postData等价于js配置中的data。

tagConfig的配置覆盖会在主题初始化成功后才执行，如果你的uploader不使用主题，请手动调用覆盖方法：

```javascript
    var tagConfig = uploader.getPlugin('tagConfig');
    tagConfig.cover();
```

###proBars：进度条集合

**提醒**：proBars是队列中所有的进度条集合，插件还有个ProgressBar子类，对应每个文件的进度条。

进度条插件依赖主题模版中的进度条容器：

```xml
<div class="J_ProgressBar_{id}">上传中...</div>
```

####ProBars的配置项

<table class="table table-bordered table-striped">
        <thead>
        <tr>
            <th style="width: 100px;">属性名</th>
            <th style="width: 50px;">类型</th>
            <th style="width: 130px;">默认值</th>
            <th style="width: 200px;">是否只读</th>
            <th>描述</th>
        </tr>
        </thead>
        <tbody>
             <tr>
                 <td>width</td>
                 <td>Number</td>
                 <td>'auto'</td>
                 <td>读/写</td>
                 <td>进度条的宽度</td>
             </tr>
              <tr>
                  <td>bars</td>
                  <td>Object</td>
                  <td>{}</td>
                  <td>读</td>
                  <td>进度条实例集合</td>
              </tr>
             <tr>
                 <td>isHide</td>
                 <td>Boolean</td>
                 <td>true</td>
                 <td>读/写</td>
                 <td>进度走到100%时是否隐藏</td>
             </tr>
             <tr>
                 <td>speed</td>
                 <td>String</td>
                 <td>0.2</td>
                 <td>读/写</td>
                 <td>进度条跑动速度控制</td>
             </tr>
        </tbody>
</table>

####ProBars的方法

**add(fileId)** ：向集合添加一个进度条

###preview：图片预览插件

**提醒**：该插件在IE10下无效，无效的情况下，主题会使用服务器返回的路径来渲染出图片。

**preview(fileInput, imgElem)**：preview只有这个方法，用于渲染本地图片。

```javascript
    var preview = uploader.getPlugin('preview');
    var fileInput = uploader.get('fileInput');
    preview.preview(fileInput,$img);
```

###filedrop：文件拖拽上传插件

####Filedrop的配置项

<table class="table table-bordered table-striped">
        <thead>
        <tr>
            <th style="width: 100px;">属性名</th>
            <th style="width: 50px;">类型</th>
            <th style="width: 130px;">默认值</th>
            <th style="width: 200px;">是否只读</th>
            <th>描述</th>
        </tr>
        </thead>
        <tbody>
             <tr>
                 <td>target</td>
                 <td>NodeList</td>
                 <td>''</td>
                 <td>读</td>
                 <td>指向模拟按钮</td>
             </tr>
        </tbody>
</table>

####Filedrop的方法

**show()/hide()**：显示和隐藏拖拽区域

###imageZoom：图片放大插件

利用image-dd组件来实现图片放大。

##Q&A

####如何处理跨域上传？

目前跨域处理只支持iframe和flash方式，如果遇到需要跨域的情况，推荐设置<code>type:"iframe"</code>。

假设你表单页面的域是：refund.taobao.com，而处理上传的服务器端路径却是upload.taobao.com。

那么将二个页面使用js将域设置为taobao.com：

```xml
<script>document.domain="taobao.com";</script>
```

处理上传的服务器返回的内容可以如下：

```xml
<script>document.domain="taobao.com";</script>
{"status":1,"type":"ajax","name":"54.png","url":".\/files\/54.png"}
```

脚本部分不用做任何处理，组件会自动处理，只取需要的结果集。

####flash上传进度条不走，上传失败

在url后面加上ks-debug，看下调试工具控制台输出是否有个“缺少crossdomain.xml”的提示。

crossdomain.xml是flash的安全策略文件，需要放在在域名根目录下，比如应用域名为refund.taobao.com，那么就应该有http://www.refund.taobao.com/crossdomain.xml，在调试时可以将这个文件代理到本地。

crossdomain.xml的内容可以如下：

```xml
<?xml version="1.0"?>
<cross-domain-policy>
    <allow-access-from domain="*"/>
    <!--下面这行代码必须有-->
    <allow-access-from domain="*.tbcdn.cn"/>
</cross-domain-policy>
```

tbcdn.cn为swf文件所在的位置，安全策略文件需要加上。

####flash上传时，隐藏上传按钮后再显示，上传组件不可用

flash对象不能设置<code>display:none;</code>，父容器隐藏也是不行的！这点特别留意。

你可以设置<code>position:absolute;top:-2000px</code>，这样的位移方式来处理。







