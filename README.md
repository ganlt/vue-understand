### Vue的响应式数据原理
![Vue运行机制解析图](/vue.png)
在`new Vue()`之后，Vue会调用`_init`进行数据初始化，他会初始化生命周期、事件、props、methods、data、computed、watch等。其中最重要的是通过`Object.defineProperty`来给数据设置`setter`和`getter`函数，用来实现<a href="#observer">响应式</a>和<a href="#dep">依赖收集</a>。在修改一个对象值的时候，会通过`setter -> Watcher -> update`的流程来修改对应的视图。

#### <a name="observer">响应式</a>
##### 1. Object.defineProperty
```
/*
  obj: 目标对象
  prop：要操作的目标对象的属性名
  descriptor：{ // 描述符对象
    enumerable: Boolean 是否可枚举，默认false
    configurable: Boolean 是否可配置，默认false
    get: function getter函数，访问该属性时触发
    set：function setter函数，对属性做修改时触发
  }

  return value 传入对象
*/
Object.defineProperty(obj, prop, descriptor)
```
##### 2. Observer（可观察的）
Observer类的作用就是给对象的属性添加getter和setter，用来依赖收集和派发更新。`observer`函数传入一个`value`（需要响应式化的对象）遍历所有的属性，执行`Object.defineProperty`处理。源码中Observer类的`walk`方法就是对数据进行遍历执行`defineReactive`方法来添加`getter`和`setter`;`observeArray`是将传进来的数组遍历，进行observe。
> defineReactive方法中。数据的get方法执行时，如果存在当前的Watcher对象，对其进行依赖收集，并对其子对象进行依赖收集，如果是数组，则对数组进行依赖收集，如果数组的子成员还是数组，则对其遍历。执行set方法时，新的值需要observe，保证新的值是响应式的；并且dep对象会执行notify方法通知所有的Watcher观察者对象。

#### <a name="dep">依赖收集</a>

##### 1. 为什么要依赖收集？
假如我们的数据`data`中有`text`,当`text`的值发生变化时，若视图中有用到`text`，那我们需要触发方法更新视图；若视图中并没有用到`text`，那就不需要触发更新视图的方法。而【依赖收集】会让`text`这个数据知道有哪些地方有依赖自己的数据，在自身发生变化的时候，需要通知他们进行更新。最终形成数据与视图的一种对应关系。

##### 2. 依赖收集的实现
依赖收集的过程：把Watcher实例存放到对应的Dep对象中去；
依赖收集的前提：触发get方法，新建一个Watcher对象；；
###### 1. 订阅者Dep
订阅者`Dep`的作用，是用来存放`Watcher`观察者对象。
```
class Dep {
  constructor () {
    /* 用来存放Watcher对象的数组 */
    this.subs = [];
  }
  /* 在subs中添加一个Watcher对象 */
  addSub (sub) {
    this.subs.push(sub);
  }
  /* 通知所有Watcher对象更新视图 */
  notify () {
    this.subs.forEach((sub) => {
      sub.update();
    })
  }
}
```
###### 2. 观察者Watcher
```
class Watcher {
  constructor () {
    /* 在new一个Watcher对象时将该对象赋值给Dep.target, 在get中会用到 */
    Dep.target = this;
  }
  /* 更新视图方法 */
  update() {
    console.log('视图已更新)
  }
}
```
###### 3. 依赖收集
使用`defineReactive`方法以及Vue的构造函数，完成依赖收集。在闭包中增加一个`Dep`类的对象，用来收集`Watcher`对象。在对象被【读】时，触发`reactiveGetter`函数将当前`Watcher`对象收集到`Dep`类中(通过存放在`Dep.target`);之后，当对象被【写】时，触发`reactiveSetter`方法通知`Dep`类调用`notify`方法通知所有`Watcher`对象调用`update`方法更新视图。在Vue的构造函数中，新建一个`Watcher`观察者对象，此时`Dep.target`便指向该对象。

### Vue事件机制

#### 1. Vue事件API
Vue.js 为我们提供了四个事件API，分别是`$on`, `$once`, `$off`, `$emit`。
#### 2. 初始化事件
Vue.js 在初始化事件时，使用`initEvents`方法，在`vm`上创建一个`_events`对象，用来存放事件。
```
export function initEvents (vm: Component) {
  /* 在vm上创建一个events对象，用来存放事件*/
  vm._events = Object.create(null)
  /* 这个标志位用来表示是否存在钩子，再不需要通过哈希表的方法来查找是否有钩子 ，减少不必要的花销，优化性能*/
  vm._hasHookEvent = false
  coonst listeners = vm.$options._parentListeners
  if (listeners) {
    updateComponentListeners(vm, listeners)
  }
}
```
在`Vue`原型上添加四个方法：
1. `$on`方法，用来在`vm`实例上监听一个自定义事件，该事件可用`$emit`触发。
2. `$once`方法，用来在`vm`实例上监听一个只能触发一次的事件，在出发之后会自动移除该事件。
3. `$off`方法，用来移除自定义事件。
4. `$emit`方法，用来触发指定的自定义事件。