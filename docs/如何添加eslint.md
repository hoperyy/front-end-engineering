# 如何添加 eslint



+   资料

    http://le0zh.github.io/2016/06/21/eslint+in+react+babel+webpack/
        
    https://github.com/vuejs/vue-loader/blob/master/docs/en/workflow/linting.md
            
    http://eslint.org/docs/rules/
        
+   在 webpack 使用步骤
  
    +   初步实现
        +   `npm install eslint eslint-loader --save`
        +   新建 `.eslintrc` 文件

            ```
            {
                "rules": {
                }
            }
            ```
    +   编译 es6 代码

        +   `npm install babel-eslint`
        +   修改 `.eslintrc`

            ```
            {
                parser: "babel-eslint",
                "rules": {
                }
            }
            ```
          
        +   webpack

            ```
            {
                enforce: 'pre',
                test: /\.((vue)|(js)|(jsx))$/,
                loader: 'eslint-loader',
                exclude: /node_modules/
            }
            ```
  
    +   编译 vue 文件

        +   `npm install eslint-plugin-html eslint eslint-loader --save`
        +   webpack

            ```
            {
                enforce: 'pre',
                test: /\.vue$/,
                loader: 'eslint-loader',
                exclude: /node_modules/
            }
            ```
          
    +   接入 airbnb 配置

        +   `npm install eslint-config-airbnb eslint-plugin-import eslint-plugin-jsx-a11y --save`
        +   `.eslintrc`

            ```
            "extends": "airbnb"
            ```

