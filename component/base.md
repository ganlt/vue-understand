### 组件相关
1. **组件全局注册**(全局注册的行为必须在根 Vue 实例 (通过 new Vue) 创建之前发生)
步骤：
* 创建组件Vue.extend()，指定组件的名称
* 注册组件Vue.component()
* 挂载作用域下实例化
```
Vue.Component('my-component', {
  props: ['title'],
  template: `<h3> {{ title }} </h3>
  <button @click="handleClick"></button>
  `,
  methods: {
    handleClick() {
      console.log(this.title)
    }
  }
})
```

2. **组件局部注册**：
```
// 在components中定义组件内的子组件
components: {
  'component-a': ComponentA,
  'component-b': ComponentB
}
```
3. **组件传值**：使用 `props` 向下传值，使用 `$emit` 监听子组件事件，向上传值
```
// 子组件
props: ['title'],
data() {
  return {
    content: ''
  }
},
methods: {
  handleSubmit() {
    this.$emit('submit', this.content)
  }
}

// 父组件
<child-component
  :title="title"
  @submit="submitContent"
></child-component>

data() {
  return {
    title: ''
  }
},
methods: {
  submitContent(content) {
    console.log(content)
  }
}
```

4. 每个组件模板必须只能包含**单个根元素**。

5. **动态组件**：在组件切换过程中想要保留组件的状态，在动态组件上使用 `<keep-alive></keep-alive>` ，注意此时动态组件必须拥有自己的名字name

6. **异步组件**：当需要时才从服务器获取要加载的组件时，可以采用异步组件的方式，Vue 允许你以一个工厂函数的方式定义你的组件，这个工厂函数会异步解析你的组件定义。Vue 只有在这个组件需要被渲染的时候才会触发该工厂函数，且会把结果缓存起来供未来重渲染。

> 工厂函数：
> 1. 可以使用 `setTimeOut` 方法的 `resolve`回调加载组件，使用 `reject`表示加载失败。
> 2. 将异步组件和 `webpack` 的 `code-splitting` 功能一起配合使用
> 3. 调用方法，返回一个 `Promise`，加载组件

异步组件工厂函数也可以返回一个如下格式的对象
```
const AsyncComponent = () => ({
  // 需要加载的组件 (应该是一个 `Promise` 对象)
  component: import('./MyComponent.vue'),
  // 异步组件加载时使用的组件
  loading: LoadingComponent,
  // 加载失败时使用的组件
  error: ErrorComponent,
  // 展示加载时组件的延时时间。默认值是 200 (毫秒)
  delay: 200,
  // 如果提供了超时时间且组件加载也超时了，
  // 则使用加载失败时使用的组件。默认值是：`Infinity`
  timeout: 3000
})
```

7. **组件访问**：
> 1. `$root`: 根元素
> 2. `$parent`: 父元素
> 3. `$refs`: 子元素
> 4. 依赖注入：`provide` 和 `inject`

8. **插槽**
父级模板里的所有内容都是在父级作用域中编译的；子模板里的所有内容都是在子作用域中编译的。