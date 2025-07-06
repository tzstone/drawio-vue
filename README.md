# vue-cli

## Project setup

```
yarn install
```

### Compiles and hot-reloads for development

```
yarn run serve
```

### Compiles and minifies for production

```
yarn run build
```

### Run your tests

```
yarn run test
```

### Lints and fixes files

```
yarn run lint
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).

## 请求哪里发

- webfilterarea
  - 好处:
    - 方便 data 私有, 不跟 filter 走, 不会因多次拷贝造成内存占用
    - 请求逻辑封装在 webfilterarea
  - 坏处:
    - 不好区分首次请求
    - 不好区分级联监听的初始化
    - filter 初始化逻辑散落各处, 日期类型在 webtemplate, 其他类型在 webfilterarea
    - 接口回来后可能需要设置默认值, 需要通知父级更新 context
- webtemplate
  - 好处:
    - 方便区分首次请求及级联初始化
    - filter 初始化逻辑统一
  - 坏处:
    - data 需放在 filter 内部, 或者给每一个 filter 添加 id, 维护一个 id->data 的 map, 传给 webfilterarea

1. filter 初始化 id
2. filter 值初始化(计算日期默认值, 请求)
   1. updateContext
   2. 初始化 id->data map, 传给 webfilterarea
3. filter 级联监听初始化
   1. 重走步骤 2
4. 右侧 filter 配置获取数据
   1. 请求完成后重新设置默认值(根据需要)(提取公共逻辑)
   2. eventbus 发送 filter.id, data 通知 webtemplate 更新 id->data map

每个组件暴露

- $$exportContext, 底层组件通过父级节点遍历查找形成作用域链, 然后可以暴露两个变量, 一个是原始作用域链, 一个是合并后的 context(越近合并优先级越高, 即近的覆盖远的)
- $$outerContextChange, 上层 context 变化时 broadcast 调用下层的该方法

context 要点(下文提及的父级包括父级及祖先级)

- 父级可以影响子级, 子级不能影响父级
- 子级对父级 context 可能有显性依赖, 也可能没有(除了 rendercard, 可认为必须有显性依赖)
- 父级 context 的更新可能是异步的, 比如接口响应回来后将数组第一项设置为默认值

- 因为渲染的顺序是由父到子, 子级初始化 context 的时候往上查找, 拿到父级的$$exportContext(找到最近的一个则停止), 根据父级的 context 初始化子级的 context, 这样子级就携带了父级的 context 信息. 同 key 会进行覆盖. 这样到 rendercard 这一层, 取父级 context 时已经包括了其所有祖先 context.
- 父级 context 变化(手动触发, 非初始化时的变化)的时候查找子级暴露的$$outerContextChange, 传递父级 context, 子级更新自己的 context, 同时可能会触发筛选器回调. 子级也做同样处理, 往下更新自己构造完的 context.
- url 这一层级的 context 比较特殊, 目前来讲在 rendercard 这层可做如下处理, rendercard 查找父级的 context, 如果没有父级 context 的话, 则取 url 上的 context, 不过这样可能也有问题, 要是后面父级 context 也定义了类似接口规范一样的东西, 参数可能就传不下到卡片了. 不过这种情况好像可以不考虑?
- 以上是预览, 对于新建和编辑的情况如下:
  - 右侧发请求时可以通过事件总线广播出来, 同时携带回调函数, 每层 context 自己判断传过来的 filter uuid 是否在当前 context 里面, 是则发送请求, context 请求完成后将接口数据通过回调传给右侧. 同时更新当前 context, 更新子级 context.
  - 新增 context 层
    - 拖入新的 context 层时就去初始化当前的 context(亦即读取父级 context 作为初始化 context), 这样对下层 context 并无影响, 因为其本来就已初始化了上层所有的 context
    - 右侧配置发请求的时候同时去重建当前 context 及子级 context, 因为 filter 的 key 可能已经被修改了. context 的修改对下层影响比较小. 首先普通的 context 层只会监听少数几个属性, 而 rendercard context 可以通过接口规格过滤参数
  - 删除 context 层
    - 可以暂不处理?
  - 新增 filter
    - 右侧配置发请求的时候同时去重建当前 context 及子级 context
  - 删除 filter
    - 可以暂不处理?
