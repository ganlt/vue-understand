### 组件间通信
1. ***父子组件***:
* **`props`, `$emit`**
  > 父组件A传值给子组件B，使用 `props`, 子组件B通过 `$emit` 触发事件将值传给父组件A
```
// 组件B
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

// 组件A
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
* **`$attr`, `$listeners`**
  > 父组件A传值给子组件B的子组件C，使用 `$attr`
```
// 组件A
<B :message="message" :messagec="messagec" v-on:getCData="getCData" v-on:getChildData="getChildData"></B>

data() {
  return {
    message: '',
    messagec: ''
  }
},
methods: {
  getChildData(message) {
    console.log('来自B组件的数据：', message)
  },
  getCData(val) {
    console.log('来自C组件的数据：', val)
  }
}

// 组件B
<input v-model="message" @change="getMessage"></input>
<C v-bind="$attrs" v-on="$listeners">
<!-->通过v-bind绑定$attrs将A的值通过B传给C</-->
<!-->通过v-on绑定$listeners将C的值通过$emit传给A</-->

props: [
  // B接收A的值
  'message'
],
methods: {
  getMessage(value) {
    // B组件传值给A组件
    this.$emit('getChildData', value)
  }
}

// 组件C
<input v-model="messagec" @change="getData">

props: [
  // C接收A的值
  'messagec'
],
methods: {
  getData(value) {
    // C传值给A
    this.$emit('getCData', value)
  }
}
```
* **`provider`, `inject`**
  > 父组件通过 provider 提供变量，子组件通过 inject 注入变量。不论子组件有多深，只要调用了inject那么就可以注入provider中的数据。而不是局限于只能从当前父组件的prop属性来获取数据，只要在父组件的生命周期内，子组件都可以调用。
```
// 父组件parent
Vue.component('parent', {
  template: `
    <child></child>
  `,
  provider: {
    text: 'text'
  }
})
// 子组件child
Vue.componet('child', {
  template: `
    <span>这是从父组件拿到的{{ this.text }}</span>
  `,
  inject: ['text']
})
```
* **`$parent`, `$children`**
  > 父组件中通过 this.$children 获取并设置子组件的值，子组件中通过 this.$parent 获取并设置父组件的值
```
// 父组件parent
Vue.component('parent', {
  template: `
    <child></child>
  `,
  data() {
    return {
      parentMessage: ''
    }
  }
  mounted: {
    this.$children[0].childMessage = 'hhh'
  }
})
// 子组件child
Vue.componet('child', {
  template: `
    <span>这是一段信息： {{ childMessage }}</span>
    <button @click="changeParent">改变父组件的值</button>
  `,
  data() {
    return {
      childMessage: ''
    }
  },
  methods: {
    changeParent() {
      this.$parent.parentMessage = 'hhh'
    }
  }
})
```

2. ***中央事件总线：`event bus`***
> 新建一个Vue实例bus对象，通过 `bus.$emit` 触发事件，通过 `bus.$on` 监听触发的事件
```
// 新建bus对象
const bus = new Vue()
const app = new Vue({
  $el: '#app',
  template: `
    <div>
      <component-a></component-a>
      <component-b></component-b>
    </div>
  `
})
// 在兄弟组件中使用event bus
// componentA
Vue.component('componentA', {
  data() {
    return {
      messagea: ''
    }
  },
  template: `
    <div>
      <input type="text" v-model="messagea" @change="getAData" />
    </div>
  `,
  methods: {
    getAData(value) {
      // 在componentA中，使用bus触发globalGetAData事件，设置messagea的值
      bus.$emit('globalGetAData', value)
    }
  }
})
// componentB
Vue.component('componentB', {
  template: `
    <div>
      <button @click="getAData">
    </div>
  `,
  methods: {
    getAData(value) {
      // 在componentB中，使用bus监听globalGetAData事件，得到messagea的值
      bus.$on('globalGetAData', (value) => {
        console.log('这是componentA的messagea的值：', value)
      })
    }
  }
})
```

3. ***共享状态管理: `vuex`***
> 多个组件共享数据时，可以使用Vuex进行共享状态管理。将应用中的多个**状态（state）**，存储在一个**容器（store）**中，不能直接改变写值store里的内容，只能通过显示的**提交（commit）mutation**，从而改变state的值。
* Getter：当多个组件需要使用到一个对state处理过的属性时，可以通过定义**getter**（可以理解为store的计算属性），getter 的返回值会根据它的依赖被缓存起来，且只有当它的依赖值发生了改变才会被重新计算。mapGetters 辅助函数仅仅是将 store 中的 getter 映射到局部计算属性。
* Mutation：每个 mutation 都有一个字符串的**事件类型 (type)**和一个**回调函数(handler)**，代码规范约定使用常量替代 mutation 事件类型，规则：**mutation 必须是同步函数**。
* Action：Action 类似于 mutation，但区别是Action提交的是mutation，且可以处理异步操作；通过**dispatch调用**action。

> 使用vuex的项目结构：
> ```
> ├── index.html
> ├── main.js
> ├── api
> │   └── ... # 抽取出API请求
> ├── components
> │   ├── App.vue
> │   └── ...
> └── store
>     ├── index.js          # 我们组装模块并导出 store 的地方
>     ├── actions.js        # 根级别的 action
>     ├── mutations.js      # 根级别的 mutation
>     └── modules
>         ├── cart.js       # 购物车模块
>         └── products.js   # 产品模块
> ```

![vuex](./vuex.png)