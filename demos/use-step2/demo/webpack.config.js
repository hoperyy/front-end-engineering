
const StringReplacePlugin = require('string-replace-webpack-plugin');
const webpack = require('webpack');

module.exports = {
    entry: {
        build: './src/main.js',
        vendor: ['vue', 'vue-router']
    },
    output: {
        path: __dirname + '/dist', // 必须是绝对路径
        publicPath: '/static/',
        filename: '[name].js'
    },
    resolve: {
      extensions: ['.js', '.vue'],
      alias: {
          'vue': 'vue/dist/vue.js'
      }
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                use: ['vue-loader']
            },
            {
                test: /\.css$/,
                use: ['vue-style-loader', 'css-loader', 'postcss-loader']
            },
            {
                test: /\.less$/,
                use: ['vue-style-loader', 'css-loader', 'postcss-loader', 'less-loader']
            },
            {
                test: /\.js$/,
                use: 'babel-loader',
                include: [__dirname + '/src']
            },

            // 用于配置关键词替换
            {
                test: /\.[(vue)(vuex)(js)(jsx)(html)]*$/,
                exclude: /(node_modules|bower_components)/,
                loader: StringReplacePlugin.replace({
                    replacements: [{
                          pattern: new RegExp('$_TEST_REPLACE_$'.replace(/\$/g, '\\$', 'g')),
                          replacement: function (match, p1, offset, string) {
                              return 'this is a test replace demo string';
                          }
                      }]
                })
            }

        ]
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            filename: 'common.js'
        })
    ]
};
