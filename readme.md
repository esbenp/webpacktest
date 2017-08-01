# 描述
本项目是live-bet的mobile web客户端

# 文件目录
##v2SRC

最主要的前端代码

### data

数据代码目录，包含

- models，定义基本数据格式
- actions，定义了redux的action
- reducer，定义了公用的reducer；非公用的reducer必须定义在所在的模块里面
- persistance，定义了前端数据库的api

### img

图片所在的目录，里面图片需要按分离安放

### util

工具目录，包含

- display，与展示相关的工具方法都存在于这个目录中
- synchronize，与同步异步相关的代码都存在于这个目录中
- consts，与亮全部置放于此
- device，与设备检测相关的代码
- events，与事件相关的常量和方法
- fetch，fetch方法
- globalVariableForUnitTest，只用于单元测试

### view

- base, 在material UI的基础上封装的组件
- components，许多模块可复用的组件
- containers，与相应的数据绑定的组件，可能在不同的页面中有同样的container
- pages，页面。非公用的子模块或者是子组件直接写在页面里面就好，每个page结构如下
- - subpages目录，存放子页
  - reducer，页面的reducer
  - index.jsx，入口文件
  - index.scss，入口样式文件
- cssBase，全局公用的css样式
- jsBase，全局公用的js方法

##template
html文件目录
###partial
一些公用的模板
###views
目前存在的页面的模板
###manifest
生成的webpack依赖文件
###stats.json
生成的webpack依赖文件
##scripts
一些更新脚本
##router
开发时前端用的伪服务器的路由
##ws
开发时前端用的伪web socket服务器代码
##feSRC
旧版本的代码存放在这个目录
##config
本地端口之类的配置,用处不大
##public
生成文件的目录

