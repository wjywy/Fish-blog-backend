<a name="vrPqa"></a>
### 解析URL
输入URL后，浏览器会解析出协议、主机、端口、路径等信息，并构造一个HTTP请求。

1. 浏览器发送请求前，根据请求头的expires和cache-control判断是否命中（包括是否过期）强缓存策略，如果命中，直接从缓存获取资源，返回资源给浏览器进程；，并不会发送请求。如果没有命中，则进入下一步。
2. 没有命中强缓存规则，浏览器会发送请求，根据请求头的If-Modified-Since和If-None-Match判断是否命中协商缓存，如果命中，直接从缓存获取资源。如果没有命中，则进入下一步。
3. 如果前两步都没有命中，那么直接进入网络请求流程。
:::info
![image.png](https://cdn.nlark.com/yuque/0/2023/png/22389795/1676087423626-858556ac-f1b7-45af-a561-636b855c5356.png#averageHue=%23f6f5d5&clientId=u2b8da4ed-2142-4&from=paste&height=374&id=ZYuV2&originHeight=374&originWidth=779&originalType=binary&ratio=1&rotation=0&showTitle=false&size=122588&status=done&style=none&taskId=ua582c761-5335-45f2-9621-f1b21b42249&title=&width=779)<br />因为浏览器使用HTTP协议作为应用层协议，用来封装请求的文本信息；<br />并使用TCP/IP作传输层协议将它发到网络上，所以在HTTP工作开始之前，<br />浏览器需要通过TCP与服务器建立连接。<br />也就是说HTTP的内容是通过TCP的传输数据阶段来实现的。<br />所以HTTP网络请求的第一步就是和服务器建立TCP连接，<br />而建立TCP连接的第一步就是准备 IP地址和端口号。
:::

- **准备IP地址和端口**
<a name="Xq7s7"></a>
### DNS 域名解析
:::success
**DNS 的详解**<br />**域名服务器划分类型：**根域名服务器(最重要)、顶级域名服务器、权威域名服务器、本地域名服务器。<br />**工作流程**

1. 浏览器首先查看自己**缓存里面有没有** ，如果没有就询问操作系统的缓存。
- 还没有就检查**本机域名解析文件**`**host**`,如果还是没有就进行下一步。
2. 将请求发给**本地的DNS 服务器**，询问 `www.server.com`对应的IP，本地DNS服务器收到客户端的请求后，如果在缓存里的表格里 找到此域名，则会直接返回对应的 IP 地址，若找不到继续下一步。
3. 本地DNS服务器向**根域名服务器**发起询问  ，询问`www.server.com`对应的IP，根域名服务器是最高层次的，它不直接用于域名解析，但能指明一条道路。
- 根DNS收到本地 DNS 的请求后，检测到后置是 `.com`，于是将`.com` 顶级域名服务器的地址发送给本地 DNS 服务器。
4. 本地DNS服务器向**顶级域名服务器**发起询问，顶级域名服务器查询之后，将负责`www.server.com`区域的权威 DNS 服务器的地址发给 本地DNS。
5. 本地DNS最后向**权威 DNS 服务器**发起询问权威 DNS 服务器查询后将对应的 IP 地址 X.X.X.X 告诉本地 DNS。
6. **本地 DNS 再将 IP 地址返回客户端，客户端和目标建立连接。**
:::

   - 现在第一步浏览器会请求DNS返回域名对应的IP。
   - 当然浏览器还提供了DNS数据缓存服务，如果某个域名已经解析过了，那么浏览器会缓存解析的结果，以供下次查询时直接使用，这样也会减少一次网络请求。
   - 拿到IP之后，接下来就需要获取端口号了。通常情况下，如果URL没有特别指明端口号，那么HTTP协议默认是80端口。如果请求协议是HTTPS，那么还需要建立TLS连接。
- **等待TCP队列**
   - Chrome有个机制，同一个域名同时最多只能建立6个TCP连接，如果在同一个域名下同时有10个请求发生，那么其中4个请求会进入排队等待状态，直至进行中的请求完成。
   - 当然，如果当前请求数量少于6，会直接进入下一步，建立TCP连接。
- **建立TCP连接**
   - 接下来就是利用IP地址和服务器建立TCP连接。这个阶段是通过“三次握手”来建立客户端和服务器之间的连接。
   - TCP 提供面向连接的通信传输。面向连接是指在数据通信开始之前先做好两端之间的准备工作。所谓三次握手，是指在建立一个TCP连接时，客户端和服务器总共要发送三个数据包以确认连接的建立。
- **发送HTTP请求**
   - 一旦建立了TCP连接，浏览器就可以和服务器进行通信了。而HTTP中的数据正是在这个通信过程中传输的。
   - 连接建立之后，浏览器端会构建请求行、请求头等信息，并把和该域名相关的Cookie等数据附加到请求头中，然后向服务器发送构建的请求信息。
- **服务器端处理HTTP请求流程**
   - 服务器接收到请求信息后，会根据请求信息生成响应数据（包括响应行、响应头和响应体等信息），并发给网络进程。等网络进程接收了响应行和响应头之后，就开始解析响应头的内容了。（为了方便讲述，下面我将服务器返回的响应头和响应行统称为响应头。）
- **重定向**`Location`字段
   - 在接收到服务器返回的响应头后，网络进程开始解析响应头，如果发现返回的状态码是301或者302，那么说明服务器需要浏览器重定向到其他URL。
   - 这时网络进程会从响应头的Location字段里面读取重定向的地址，然后再发起新的HTTP或者HTTPS请求，一切又重头开始了。
   - ![image.png](https://cdn.nlark.com/yuque/0/2023/png/22389795/1676079007472-f3ca593e-af11-4ec9-84aa-b412197b883f.png#averageHue=%23cfeaf4&clientId=u2b8da4ed-2142-4&from=paste&height=456&id=u8c17746d&originHeight=456&originWidth=1024&originalType=binary&ratio=1&rotation=0&showTitle=false&size=310373&status=done&style=none&taskId=ueeb14212-c228-4592-8dd0-3b7c6898684&title=&width=1024)
   - 就比如：
   - 给某台服务器发送HTTP请求，服务器会通过重定向的方式把所有HTTP请求转换为HTTPS请求。
- **响应数据类型处理**`Content-Type`
   - 在处理了跳转信息之后，浏览器会根据`Content-Type` 来决定如何显示响应体的内容。
   - `Content-Type` 是HTTP头中一个非常重要的字段， 它告诉浏览器服务器返回的响应体数据是什么类型
   - ![image.png](https://cdn.nlark.com/yuque/0/2023/png/22389795/1676079474843-e91d42c6-e5b3-4dd8-ba0e-99a7509db673.png#averageHue=%23cfe8f2&clientId=u2b8da4ed-2142-4&from=paste&height=383&id=u7a7e62c3&originHeight=383&originWidth=794&originalType=binary&ratio=1&rotation=0&showTitle=false&size=257785&status=done&style=none&taskId=u16d4298b-591e-418a-96b4-d0ea10628c1&title=&width=794)
   - 如果是`text/html`这就是告诉浏览器，服务器返回的数据是HTML格式
   - 如果是其`Content-Type`的值是`application/octet-stream`,显示数据是字节流类型的，通常情况下，浏览器会按照下载类型来处理该请求。
   - 所以不同`Content-Type`的后续处理流程也截然不同。
   - 如果`Content-Type`字段的值被浏览器判断为下载类型，那么该请求会被提交给浏览器的下载管理器，同时该URL请求的导航流程就此结束。
   - 但如果是HTML，那么浏览器则会继续进行导航流程
- **断开TCP连接**
   - 数据传输完毕之后，就要终止连接了，涉及到最后一个阶段“四次挥手”来保证双方都能断开连接。
:::info

   - 通常情况下，一旦服务器向客户端返回了请求数据，它就要关闭 TCP 连接。不过如果浏览器或者服务器在其头信息中加入了：
   - `Connection:Keep-Alive`
   - 那么TCP连接在发送后将仍然保持打开状态，这样浏览器就可以继续通过同一个TCP连接发送请求。
   - 保持TCP连接可以省去下次请求时需要建立连接的时间，提升资源加载速度
:::
<a name="oH5b0"></a>
### 准备渲染进程

- 因为浏览器是**无法直接识别HTML字节流**的，所以会开启渲染进程，与网络进程之间建立管道，将网络进程中的HTML字节流传送给渲染进程。

- 渲染进程内部的HTML解析器会将HTML字节流解析成浏览器能够识别的dom树结构

- **在解析过程中，如果遇到CSS的link元素，那么会由浏览器另一个线程开始下载CSS文件，但是浏览器是无法直接识别 CSS 样式文本的，会先**将其转化为一个结构化的对象，即`styleSheets`，然后在将样式进行`格式化`和`标准化`，接下来就可以计算每个节点的具体样式信息了，浏览器会根据 继承和层叠 的规则将其解析成`CSSOM树`。

- `DOM树` 与 `CSSOM树`合并后形成`渲染树`，渲染树只包含渲染网页所需的节点。但是还需要对dom的位置进行计算，生成对应的`布局树`。

- 因为浏览器页面是由很多个图层结合的，所以还要将布局树进行分层，将需要分层的结点抽离`形成分层树`

- 渲染进程会生成分层树每一层的**绘制指令**，存入绘制列表中，然后将绘制列表发送给合成线程

- 因为有的图层可能很长，一次性解析全部图层会造成性能浪费，所以合成线程会将图层分为一个个的图块，并且优先将离视口近的图块经过光栅化操作转成位图。

- 合成线程完成所有图块的光栅化之后，会给浏览器进程发送绘制图块指令DrawQuad，浏览器就会根据这个DrawQuad指令生成页面了

<a name="A7pkP"></a>
### 回流和重绘

- **重绘**

当页面中元素样式的改变并不影响它在文档流中的位置时（例如：color、background-color、visibility等），浏览器会将新样式赋予给元素并重新绘制它，这个过程称为重绘。

- **回流**

当Render Tree中部分或全部元素的尺寸、结构、或某些属性发生改变时，浏览器重新渲染部分或全部文档的过程称为回流。<br />引起回流：

1. 页面首次渲染
2. 浏览器窗口大小发生改变
3. 元素尺寸或位置发生改变
4. 元素内容变化（文字数量或图片大小等等）
5. 元素字体大小变化
6. 添加或者删除可见的DOM元素
7. 激活CSS伪类（例如：:hover）
8. 查询某些属性或调用某些方法

**引起回流的属性和方法：**

- clientWidth、clientHeight、clientTop、clientLeft
- offsetWidth、offsetHeight、offsetTop、offsetLeft
- scrollWidth、scrollHeight、scrollTop、scrollLeft
- scrollIntoView()、scrollIntoViewIffNeeded()
- getComputedStyle()
- getBoundingClientRect()
- scrollTo()

**如何减少回流**

- **css**
1. 避免使用table布局;
2. 尽可能在DOM树的最末端改变class;
3. 避免设置多层内联样式;
4. 将动画效果应用到position属性为absolute或fixed的元素上;
5. 避免使用CSS表达式（例如：calc()）。
- **JS**
1. 避免频繁操作样式，最好一次性重写style属性，或者将样式列表定义为class并一次性更改class属性。
2. 避免频繁操作DOM，创建一个documentFragment，在它上面应用所有DOM操作，最后再把它添加到文档中。
3. 也可以先为元素设置display: none，操作结束后再把它显示出来。因为在display属性为none的元素上进行的DOM操作不会引发回流和重绘。
4. 避免频繁读取会引发回流/重绘的属性，如果确实需要多次使用，就用一个变量缓存起来。
5. 对具有复杂动画的元素使用绝对定位，使它脱离文档流，否则会引起父元素及后续元素频繁回流。
<a name="Wi8oq"></a>
### 提交文档<br /><br />
所谓提交文档，就是指浏览器进程将网络进程接收到的HTML数据提交给渲染进程，具体流程是这样的：

- 首先当浏览器进程接收到网络进程的响应头数据之后，便向渲染进程发起“提交文档”的消息；
- 渲染进程接收到“提交文档”的消息后，会和网络进程建立传输数据的“管道”；
- 等文档数据传输完成之后，渲染进程会返回“确认提交”的消息给浏览器进程；
- 浏览器进程在收到“确认提交”的消息后，会更新浏览器界面状态，包括了安全状态、地址栏的URL、前进后退的历史状态，并更新Web页面。

其中，当渲染进程确认提交之后，更新内容如下图所示：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/22389795/1676081535879-4942c995-cb43-4940-ab34-5908f2bfda41.png#averageHue=%23bbc7b5&clientId=u2b8da4ed-2142-4&from=paste&height=468&id=u5fa3f284&originHeight=468&originWidth=853&originalType=binary&ratio=1&rotation=0&showTitle=false&size=191798&status=done&style=none&taskId=u5503f4d6-aa03-4e22-9a21-af44d368a97&title=&width=853)
