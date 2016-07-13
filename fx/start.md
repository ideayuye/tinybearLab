
title: nodeppt markdown 
speaker: Theo Wang
url: https://github.com/ksky521/nodePPT
transition: zoomin
theme: moon


[slide]
## 简介node
*  Node.js结构

![测试文件路径](/images/node_arc.jpg)
* Node.js 标准库，这部分是由 Javascript 编写的，即我们使用过程中直接能调用的 API 
* Node bindings，这一层是 Javascript 与底层 C/C++ 能够沟通的关键，前者通过 bindings 调用后者，相互交换数据。实现在 node.cc
* 这一层是支撑 Node.js 运行的关键，由 C/C++ 实现
    V8：Google 推出的 Javascript VM，也是 Node.js 为什么使用的是 Javascript 的关键，它为 Javascript 提供了在非浏览器端运行的环境，它的高效是 Node.js 之所以高效的原因之一。
    Libuv：它为 Node.js 提供了跨平台，线程池，事件池，异步 I/O 等能力，是 Node.js 如此强大的关键。
    C-ares：提供了异步处理 DNS 相关的能力。
    http_parser、OpenSSL、zlib 等：提供包括 http 解析、SSL、数据压缩等其他的能力。


[slide]
## Libuv


[slide ]
## 所应用的技术点
good{:&.moveIn}

[slide]
## 介绍http模块 顺带介绍stream eventEmitter

    console.log('hi ok');{:&.fadeIn}

[slide]
## 介绍express

[slide]
## 介绍注意安全

[slide]
## 

