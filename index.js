/**
 * Dep 订阅者类，是数据和观察者之间的桥梁，进行依赖收集
 * 1. addSub用来将目前的Dep对象中加入一个观察者的订阅行为
 * 2. notify方法用来通知已经订阅该数据的所有观察者去更新他们的视图
 */
class Dep {
  constructor() {
    this.subs = []
  }
  addSub(sub) {
    // 往subs里添加Watcher对象
    this.subs.push(sub)
  }
  notify() {
    // 通知所有Watcher更新视图
    this.subs.forEach(sub => {
      sub.update()
    })
  }
}
/**
 * 观察者类
 * new 一个Wacther 时，将该Wacther对象绑定到Dep的target中
 */
class Watcher {
  constructor() {
    // Dep.target表示当前正在进行计算的Watcher
    Dep.target = this
  }
  // 更新视图
  update() {
    console.log('视图更新啦~')
  }
}

Dep.target = null

class Vue {
  // vue构造类
  constructor(options) {
    this._data = options.data
    this.observer(this._data)
    new Watcher() // 实例化观察者对象，这时候Dep.target会指向这个对象
    console.log('render', this._data.message)
  }
  // 给对象动态添加setter getter方法，使用Object.defineProperty方法
  defineReactive(obj, key, val) {
    const dep = new Dep()
    Object.defineProperty(obj, key, {
      enumerable: true,
      configurable: true,
      get: function reactiveGetter() {
        // 往Dep中添加Dep.target，即当前观察者对象
        dep.addSub(Dep.target)
        return val
      },
      set: function reactiveSetter(newVal) {
        if (newVal === val) return
        // 在set时通知观察者更新视图
        dep.notify()
      }
    })
  }
  // 对传进来的对象遍历执行defineReactive
  observer(value) {
    if (!value || (typeof value !== 'object')) {
      return
    }
    Object.keys(value).forEach(key => {
      this.defineReactive(value, key, value[key])
    })
  }
}

let obj = new Vue({
  el: '#app',
  data: {
    message: 'test'
  }
})

obj._data.message = 'update'