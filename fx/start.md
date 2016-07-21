
title: node 实践
speaker: tb
transition: slide
theme: moon

[slide]
##Node在易购的实践
- 分享人：朱进雄
- 工号：15050971
- 部门：消费者核心交易研发中心前端开发部

[slide]
## 用户体验提升计划系统
随着node的流行，我们对node做了小规模的尝试，开发了用户体验提升计划系统。系统主要功能是收集用户提交的建议，后台流转到各个部门，促使用户反馈落实到系统，改善易购体验。

### 线上地址
- pc端：[http://s.suning.com/](http://s.suning.com/) 
- app端：[http://s.suning.com/app.htm](http://s.suning.com/app.htm) 
- 后台：[http://s.cnsuning.com/predo.htm](http://s.cnsuning.com/predo.htm) 

[slide]
##系统结构
![vss结构](/images/vss.png)

[slide]
##使用的第三方模块
```
    "dependencies": {
        "art-template": "^3.0.3",
        "body-parser": "^1.12.3",
        "compression": "^1.4.4",
        "connect-redis": "^2.3.0",
        "connect-timeout": "^1.6.2",
        "cookie-parser": "^1.3.4",
        "eventproxy": "^0.3.3",
        "express": "~4.12.3",
        "express-session": "^1.11.1",
        "framework-helper": "^0.1.0",
        "fs-extra": "^0.26.0",
        "moment": "^2.10.2",
        "moment-timezone": "^0.3.1",
        "multer": "^0.1.8",
        "mysql": "^2.6.2",
        "redis": "^0.12.1",
        "response-time": "^2.3.0",
        "superagent": "^1.2.0",
        "superagent-auth": "^0.0.1",
        "superagent-prefix": "0.0.2",
        "underscore": "^1.8.3",
        "xss": "^0.2.1"
    }
```

[slide]
## Node.js结构
![vss结构](/images/node_arc.jpg)


[slide]
<div style="positon:relative;">
<img src="/images/node_arc.jpg" style="width:200px;height:150px;position:absolute;left:-200px;top:0;">
</div>
* Node.js 标准库，这部分是由 Javascript 编写的，即我们使用过程中直接能调用的 API 
* Node bindings，这一层是 Javascript 与底层 C/C++ 能够沟通的关键，前者通过 bindings 调用后者，相互交换数据。实现在 node.cc
* 这一层是支撑 Node.js 运行的关键，由 C/C++ 实现
    * V8：Google 推出的 Javascript VM，也是 Node.js 为什么使用的是 Javascript 的关键，它为 Javascript 提供了在非浏览器端运行的环境，它的高效是 Node.js 之所以高效的原因之一ssss
    * Libuv：它为 Node.js 提供了跨平台，线程池，事件池，异步 I/O 等能力，是 Node.js 如此强大的关键
    * C-ares：提供了异步处理 DNS 相关的能力。
    * http_parser、OpenSSL、zlib 等：提供包括 http 解析、SSL、数据压缩等其他的能力。


[slide]
## 介绍http模块 
    
 ```
    var http = require('http');
    var server = http.createServer((req, res) => {
        res.end('hello world');
    });
    server.listen(1202, '127.0.0.1');
```

- server-- http.Server http服务端
- res   -- http.ServerResponse  可写流 实现了 stream.Writable
- req   -- http.IncomingMessage 可读流 实现了 stream.Readable
- http.Agent 管理http使用的sockets连接池
- http.ClientRequest 可以发起http客户端请求

[slide]
## 介绍express
* 应用级中间件
* 路由级中间件
* 错误处理中间件
* 内置中间件
* 第三方中间件

[slide]
## C/C++ AddOns
* node-gyp 用于编译c++代码的模块
* binding.gyp 
    ```
    {
    "targets": [
            {
            "target_name": "hello",
            "sources": [ "cppAddons_demo.cc" ]
            }
        ]
    }
    ```
* 编写.cc程序
* configure&build

注：windows平台还需要安装vs


[slide]
##v8内存
* 新生区：大多数对象被分配在这里。新生区是一个很小的区域，垃圾回收在这个区域非常频繁，与其他区域相独立。
* 老生指针区：这里包含大多数可能存在指向其他对象的指针的对象。大多数在新生区存活一段时间之后的对象都会被挪到这里。
* 老生数据区：这里存放只包含原始数据的对象（这些对象没有指向其他对象的指针）。字符串、封箱的数字以及未封箱的双精度数字数组，在新生区存活一段时间后会被移动到这里。
* 大对象区：这里存放体积超越其他区大小的对象。每个对象有自己mmap产生的内存。垃圾回收器从不移动大对象。
* 代码区：代码对象，也就是包含JIT之后指令的对象，会被分配到这里。这是唯一拥有执行权限的内存区。

## 内存泄漏排查工具
devtool:基于electron,在chrome devTools里运行node

[slide ]
## 集群&监控
* child_process 提供创建子进程的能力
* cluster 让node程序充分利用多核系统
* pm2 管理node程序，监控并保持程序一直运行

[slide]
## 关注系统安全
* xss（跨站脚本攻击）
* csrf（跨站请求伪造）
* 文件上传漏洞 
* 其他已知的web漏洞 

[slide]
## 实践总结
* 总体来说node性能良好，而且稳定
* 前后端可以共用代码，有助于提升开发效率
* 难以与公司现有的系统对接，比如接入日志收集系统、监控系统、中台服务等
* 仅有Node.js核心本身并不能够解决所有问题,还需要掌握数据库、redis缓存、nginx等，对前端开发人员是个不小的挑战
* 做好单元测试，是保证系统稳定的基础


[slide]
#谢谢！
