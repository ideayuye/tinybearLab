
### debug
rollup配置sourcemap然后就可以对源代码调试

###GlobalAPI

    initUse(Vue) //绑定运用插件方法
    initMixin(Vue) //绑定混合参数方法
    initExtend(Vue) //绑定扩展方法
    initAssetRegisters(Vue) 

###初始化流程
1. this._init(options) --调用 core/instance/init.js 里的初始化函数
2. 开始解析options

    initLifecycle(vm)
    initEvents(vm)
    callHook(vm, 'beforeCreate')
    initState(vm)
    callHook(vm, 'created')
    initRender(vm)

2.1 initState 包装data、menthods、props、computed、watch等
    initProps(vm)
    initData(vm)
    initComputed(vm)
    initMethods(vm)
    initWatch(vm)

 2.1.1 initData
    _data代理传入的data
    调用observe，observe内部创建Observer对象开始监听data。
    Observer调用 defineReactive为data的每个属性创建一个对应的属性，通过属性的get和set来监听。注意处理嵌套属性和数组。
    每个属性变更时通过Dep通知。Dep内部记录订阅的函数。


