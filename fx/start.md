
title: nodeppt markdown 
speaker: Theo Wang
url: https://github.com/ksky521/nodePPT
transition: zoomin
theme: moon


[slide]
## Node.js结构
![测试文件路径](/images/node_arc.jpg)
* Node.js 标准库，这部分是由 Javascript 编写的，即我们使用过程中直接能调用的 API 
* Node bindings，这一层是 Javascript 与底层 C/C++ 能够沟通的关键，前者通过 bindings 调用后者，相互交换数据。实现在 node.cc
* 这一层是支撑 Node.js 运行的关键，由 C/C++ 实现
    V8：Google 推出的 Javascript VM，也是 Node.js 为什么使用的是 Javascript 的关键，它为 Javascript 提供了在非浏览器端运行的环境，它的高效是 Node.js 之所以高效的原因之一。
    Libuv：它为 Node.js 提供了跨平台，线程池，事件池，异步 I/O 等能力，是 Node.js 如此强大的关键。
    C-ares：提供了异步处理 DNS 相关的能力。
    http_parser、OpenSSL、zlib 等：提供包括 http 解析、SSL、数据压缩等其他的能力。

[slide]
##异步、非阻塞I/O

[slide]
##v8内存&内存泄漏排查
* 新生区：大多数对象被分配在这里。新生区是一个很小的区域，垃圾回收在这个区域非常频繁，与其他区域相独立。
* 老生指针区：这里包含大多数可能存在指向其他对象的指针的对象。大多数在新生区存活一段时间之后的对象都会被挪到这里。
* 老生数据区：这里存放只包含原始数据的对象（这些对象没有指向其他对象的指针）。字符串、封箱的数字以及未封箱的双精度数字数组，在新生区存活一段时间后会被移动到这里。
* 大对象区：这里存放体积超越其他区大小的对象。每个对象有自己mmap产生的内存。垃圾回收器从不移动大对象。
* 代码区：代码对象，也就是包含JIT之后指令的对象，会被分配到这里。这是唯一拥有执行权限的内存区（不过如果代码对象因过大而放在大对象区，则该大对象所对应的内存也是可执行的。译注：但是大对象内存区本身不是可执行的内存区）。
* Cell区、属性Cell区、Map区：这些区域存放Cell、属性Cell和Map，每个区域因为都是存放相同大小的元素，因此内存结构很简单。

[slide ]
## 集群&监控
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

