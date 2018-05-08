## 前言

自从前后端分离以来，“前端工程化”已经是前端领域的高频词汇。那么什么是“前端工程化”，众说纷纭。

我们可以这样理解“前端工程化”：把一整套前端工作流程中能用工具搞定的部分，用工具搞定。

随着 Node.js 的兴起，诞生了如 gulp、grunt、webpack 等一批自动化工具，大大提升了前端在自动化、工程化等方面的效率，并降低了成本。

前端工程化涵盖了很多内容，本项目主要用于整理我在前端工程化领域的理解。

## webpack

webpack 的变化非常快，目前我们的尝试版本是 3.10.0。

### 使用

+   [项目个性化配置策略](./docs/项目个性化配置策略.md)(2017)
+   [用纯 [webpack 结构] 替代 [gulp + webpack 结构] 开发脚手架](./docs/用纯[webpack结构]替代[gulp+webpack]结构.md)(2017)
+	[脚手架与业务目录的目录结构浅析](./docs/脚手架与业务目录的目录结构浅析.md)(2017/08/23)
+   [解决 webpack/webpack-dev-server 监听文件时频繁触发编译和回调的问题](./docs/解决webpack+webpack-dev-server监听文件时频繁触发编译和回调的问题.md)(2017)
+   [webpack 经验谈](./docs/webpack经验谈.md)(2017)
+   [启动一个 vue 项目](./docs/启动一个vue项目.md)(2017)

### 分析

+   实现一个简单的 webpack：https://github.com/youngwind/fake-webpack

### 资料

+   [webpack源码学习系列之一：如何实现一个简单的webpack](https://github.com/youngwind/blog/issues/99)
+   [ 深入剖析 webpack 打包生成的一大堆代码到底是啥](http://blog.csdn.net/haodawang/article/details/77126686)
