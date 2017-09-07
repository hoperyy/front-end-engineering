
const fs = require('fs');
const path = require('path');

const StringReplacePlugin = require('string-replace-webpack-plugin');
const webpack = require('webpack');

module.exports = ({ srcDir, buildDir }) => {
    return {
        entry: {
            build: [path.join(srcDir, 'main.js')]
        },
        output: {
            path: path.join(buildDir, 'static'), // 必须是绝对路径
            publicPath: '/static/',
            filename: '[name].js'
        },
        module: {
            rules: [
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
        }
    };
};
