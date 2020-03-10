### 生命周期钩子
`beforeCreate -> created -> beforeMount -> mounted -> beforeUpdate -> updated -> activated -> deactivated -> beforeDestroy -> destoryed -> errorCaptured`
![Vue生命周期](./lifecycle.png)

1. 所有生命周期钩子自动定`this`上下文到实例中。不能使用箭头函数来定义一个生命周期方法，因为箭头函数并没有 `this`，`this` 会作为变量一直向上级词法作用域查找，直至找到为止，经常导致错误。

2. create 和 mount 相关
> beforecreated：el 和 data 并未初始化
> created:完成了 data 数据的初始化，el没有
> beforeMount：完成了 el 和 data 初始化（若使用{{message}}，此时el还是{{message}}）
> mounted ：完成挂载（这时，el才会变成 这是一段消息。）

3. 生命周期钩子应用场景
> beforecreate : 举个栗子：可以在这加个loading事件
> created ：在这结束loading，还做一些初始化，实现函数自执行
> mounted ： 在这发起后端请求，拿回数据，配合路由钩子做一些事情
> beforeDestroy： 你确认删除XX吗？ destroyed ：当前组件已被删除，清空相关内容