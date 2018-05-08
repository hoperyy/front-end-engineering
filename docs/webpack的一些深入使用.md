+   为引入的资源指定后缀
    
    举例：
    
    ```
    resolve: {
        extensions: ['.js', '.vue']
    }
    ```
    
    这样，如果有这样的语句
    
    ```
    import('./app')
    ```
    
    `webpack` 会尝试查找 `./app.js` 和 `./app.vue`
    
+   指定快捷路径

    ```
    resolve: {
            alias: {
                vue: 'vue/dist/vue.js'
            }
    }
    ```
    
    这样在代码里，`import 'vue'` 其实引用的是 `vue/dist/vue.js`
    
    可以用来提升打包性能
    
+   指定 `webpack` 加载各种 `loader` 时查找的路径

    ```
    resolveLoader: {
        modules: [
            path.resolve('./node_modules/'),
            path.resolve('../node_modules/'),
            path.resolve('../../node_modules/')
        ]
    }
    ```
    
    可以提升性能
    
+   替换关键字

    使用插件 `string-replace-webpack-plugin`
    
    在 `module.rules` 数组，添加下列代码：
    
    ```
    // 用于配置关键词替换
    {
        test: /\.[(vue)(vuex)(js)(jsx)(html)]*$/,
        exclude: /(node_modules|bower_components)/,
        loader: StringReplacePlugin.replace({
            replacements: [{
                pattern: new RegExp('$_TEST_REPLACE_$'.replace(/\$/g, '\\$', 'g')),
                replacement: function (match, p1, offset, string)   {
                   return 'this is a test replace demo string';
               }
           }]
        })
    }
    ```
    
    这里配置了关键词 `$_TEST_REPLACE_$` 的替换规则，可根据实际情况修改相应代码
    
+   提取公共代码（多页项目）
    
    目的：提取多页项目中的公共代码，同时将一些第三方库（如 `vue`、`vue-router`）也提取出来
    
    +   step1
        
        `entry` 中添加 `vendor`:
        
        ```
        entry: {
            vendor: ['vue', 'vue-router']
        }
        ```
        
    +   step2
        
        由于 step1 的配置，入口变为了多个，因此目前的 `entry` 应该是这个样子：
        
        ```
        entry: {
            build: './src/main.js',         // key 可以自定义
            vendor: ['vue', 'vue-router']
        }
        ```
        
        相应的 `output` 也需要改变：
        
        ```
        output: {
            path: __dirname + '/dist',
            publicPath: '/static/',
            filename: '[name].js'           // 新增了这个配置
        }
        ```
        
    +   step3
        
        `plugins` 中添加 webpack 提供的插件
        
        ```
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            filename: 'common.js', // 公共代码命名为 common.js，可自定义
        })
        ```
        
    +   step4

        `index.html` 中新增对 `common.js` 的引用
        
        ```
        <body>
            <div id="app"></div>
            <script src="/static/common.js"></script>
            <script src="/static/build.js"></script>
        </body>
        ```