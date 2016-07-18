
title: node 实践
speaker: tb
transition: zoomin
theme: moon


[slide]
## 系统简介
### 用户体验提升计划系统
随着node的流行，通过对开发用户体验提升计划系统来对node进行尝试。系统主要功能是收集用户提交的建议，后台流转到各个部门，促使用户反馈落实到系统，改善易购体验。

### 线上地址
- pc端：[http://s.suning.com/](http://s.suning.com/) 
- app端：[http://s.suning.com/app.htm](http://s.suning.com/app.htm) 
- 后台：[http://s.cnsuning.com/predo.htm](http://s.cnsuning.com/predo.htm) 


[slide]
##系统结构
![vss结构](/images/vss.png)

[slide]
## Node.js结构
![node结构](/images/node_arc.jpg)
* Node.js 标准库，这部分是由 Javascript 编写的，即我们使用过程中直接能调用的 API 
* Node bindings，这一层是 Javascript 与底层 C/C++ 能够沟通的关键，前者通过 bindings 调用后者，相互交换数据。实现在 node.cc
* 这一层是支撑 Node.js 运行的关键，由 C/C++ 实现
    V8：Google 推出的 Javascript VM，也是 Node.js 为什么使用的是 Javascript 的关键，它为 Javascript 提供了在非浏览器端运行的环境，它的高效是 Node.js 之所以高效的原因之一。
    Libuv：它为 Node.js 提供了跨平台，线程池，事件池，异步 I/O 等能力，是 Node.js 如此强大的关键。
    C-ares：提供了异步处理 DNS 相关的能力。
    http_parser、OpenSSL、zlib 等：提供包括 http 解析、SSL、数据压缩等其他的能力。



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
##v8内存
* 新生区：大多数对象被分配在这里。新生区是一个很小的区域，垃圾回收在这个区域非常频繁，与其他区域相独立。
* 老生指针区：这里包含大多数可能存在指向其他对象的指针的对象。大多数在新生区存活一段时间之后的对象都会被挪到这里。
* 老生数据区：这里存放只包含原始数据的对象（这些对象没有指向其他对象的指针）。字符串、封箱的数字以及未封箱的双精度数字数组，在新生区存活一段时间后会被移动到这里。
* 大对象区：这里存放体积超越其他区大小的对象。每个对象有自己mmap产生的内存。垃圾回收器从不移动大对象。
* 代码区：代码对象，也就是包含JIT之后指令的对象，会被分配到这里。这是唯一拥有执行权限的内存区（不过如果代码对象因过大而放在大对象区，则该大对象所对应的内存也是可执行的。译注：但是大对象内存区本身不是可执行的内存区）。
* Cell区、属性Cell区、Map区：这些区域存放Cell、属性Cell和Map，每个区域因为都是存放相同大小的元素，因此内存结构很简单。

[slide]
## 内存泄漏排查
devtool

[slide ]
## 集群&监控
* child_process
* cluster
* pm2

[slide]
## 系统安全
* xss
* csrf
* 文件上传

[slide]
## 实践总结
* 总体来说node性能良好，而且稳定
* 难以与公司现有的系统对接，比如接入日志收集系统、监控系统、中台服务等
* 做好单元测试等保障系统稳定的基础
