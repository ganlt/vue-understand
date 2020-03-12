### MVVM 原理

##### MVVM (Model - View - ViewModel) 模型 - 视图 - 视图模型
##### MVC (Model - View - Controler) 模型 - 视图 - 控制器

1. MVVM 是什么？
> Model => 后端返回的数据
> View => 用户看到的视图
> ViewModel => 搭建两者之间的桥梁，其中Model通过**数据绑定**的方式渲染在视图，View通过**DOM事件监听**的方式来修改数据

2. MVC 是什么？
> Model => 后端返回的数据
> View => 用户看到的视图
> Controller => 控制器，通过其控件将响应传给数据源，由数据源改变数据直接改变视图

3. MVVM 和 MVC 的区别是什么？
> MVVM 实现数据与视图的分离，MVC 中 模型是可以直接操作视图的
> MVVM 通过数据来驱动视图的更新，开发者只需要关心数据的变化，DOM操作被封装了

3. Vue 的 MVVM 实现方式：
> 双向数据绑定
> Model -> Data Bindings -> View
> View -> DOM listeners -> Model

> 核心原理：
> 1. [响应式](https://github.com/jinshuilinxi/vue-understand/blob/master/README.md)：vue如何实现对data的监听
> 2. 模板解析：vue如何实现模板的解析，解析为真实DOM
> 3. 渲染：vue如何更新视图，将模板渲染为HTML