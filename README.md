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
