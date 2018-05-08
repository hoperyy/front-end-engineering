+   `extract-text-webpack-plugin`

    `extract-text-webpack-plugin` 如果将 css 文件单独抽离出来，不会有 HMR（hot module reload）的效果，因此在开发环境下，不能使用这个插件，只在生产环境下使用
    
+   `webpack-dev-server`

    错误信息：`Can't resolve 'fs' in webpack-dev-server/client`
    
    如果 `webpack` 配置中有 `resolve.mainFields`，但是没有包含以下三个配置：`["browser", "module", "main"]`，在使用 `webpack-dev-server` 的时候就会报错。
    
    解决方案：删除 `resolve.mainFields` 或将其配置的值至少有 `["browser", "module", "main"]`
    
    issue：https://github.com/webpack/webpack-dev-server/issues/727

+  如何支持 `module.exports` 和 `import` 混用：https://github.com/59naga/babel-plugin-add-module-exports

    通常情况下是不建议混用的，但在特殊的场景下，比如历史包袱等，可以用这个方案处理