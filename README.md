## HTTP
超文本传输协议，是一种Web协议，它为Web注入了很多强大的功能，属于TCP上层的协议。
HTTP协议构建在请求和响应的概念上。`http.ServerRequest` & `http.ServerResponse`。

### 头信息
HTTP在请求和响应信息前使用头信息来描述不同的消息内容。

```js
res.writeHead(200, {
	'Content-Type': 'text/html'
});
```

我们用 `telnet` 连接会得到如下

```js
HTTP/1.1 200 OK
Content-Type: text/html
Connection: keep-alive
Transfer-Encoding: chunked 
```

node会把两外两个头信息加进去 `Connection` & `Transfer-Encoding`。
`Transfer-Encoding: chunked`: 数据以一系列分块的形式进行发送。得益于Node天生的异步机制。
在调用 `end`	前可以多次调用 `write` 发送数据，首次调用 `write` Node会把所有的响应头信息以及第一块 `write` 数据发送出去。

### 连接
TCP VS HTTLP 都会调用 `createServer`, 都会在连接时执行一个回调，区别是回调中的参数，TCP中是连接对象，HTTP中是请求对象和响应对象。

注意 客户端响应（res）的 `end` 事件必须由 `data` 事件触发才能发生。
在客户端调用完request后还要调用其end，因为创建完一个请求后在发送给服务端前还可以和request对象进行交互。
process.argv: 第一个是node路径， 第二个是执行文件的路径，暂时认为是工作目录，后面的是命令行跟着的参数。


## Connect
body.parser中间件
connext.static（目录）需要安装up(需要翻墙安装)

## Express
### 设置模版
需要的包如下：

```js
{
	dependencies: {
		express: "^2.5.9",
		ejs: "0.4.2",
		superagent: "0.3.0"
	}
}
```

```js
app.set('view engine', 'ejs');	// 设置视图模版引擎
app.set('views', __dirname + '/my-view');	// 设置模版的目录
app.set('view options', {layout: false})	//
<!-- 第三个 `view options` 定义在渲染视图时会传递到每个模版中，这里是为了兼容express3 -->
```

### express缓存模版

```js
app.configure('production', function() {
	app.enable('view cache');
});
<!-- 或者 -->
app.set('view cache', true);

<!-- 在环境变量NODE_ENV为production时上面的回调函数会执行 -->
<!-- NODE_ENV = production node <server.js> -->
<!-- 相应的还有开发环境的配置 -->
app.configure('development', function() {
	// do somethings here
});

```

### express查看配置是否启用
app.enabled, app.disabled


### 模版引擎
express会以模版文件的扩展名或者 `view engin` 去调 require， 也能通过 `app.register` 去匹配模版, 新版本的express要用 `app.engine`

```js
app.register('.html', require('jade'));
```

### 错误处理
app.error(callback[err, req, res, next]);
