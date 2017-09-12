/**
 * @file  webpack主程序入口
 * @author  youngwind
 */

const path = require('path');
const co = require('co');
const fs = require('fs');
const buildDeps = require('./buildDeps.js');
const writeChunk = require('./writeChunk');
const templateSingle = fs.readFileSync(path.join(__dirname, 'templateSingle.js'));
const templateAsync = fs.readFileSync(path.join(__dirname, 'templateAsync.js'));

/*
{ modules:
   { '/Users/lyy/Downloads/code/my-project/github/deep-webpack/fake-webpack/examples/simple/example.js':
      { id: 0,
        filename: '/Users/lyy/Downloads/code/my-project/github/deep-webpack/fake-webpack/examples/simple/example.js',
        name: '/Users/lyy/Downloads/code/my-project/github/deep-webpack/fake-webpack/examples/simple/example.js',
        requires: [Array],
        asyncs: [],
        source: 'let a = require(\'a\');\nlet b = require(\'b\');\nlet c = require(\'c\');\na();\nb();\nc();\n',
        chunkId: 0,
        chunks: [Array] },
     '/Users/lyy/Downloads/code/my-project/github/deep-webpack/fake-webpack/examples/simple/a.js':
      { id: 1,
        filename: '/Users/lyy/Downloads/code/my-project/github/deep-webpack/fake-webpack/examples/simple/a.js',
        name: 'a',
        requires: [],
        asyncs: [],
        source: '// module a\n\nmodule.exports = function () {\n    console.log(\'a\')\n};',
        chunks: [Array] },
     '/Users/lyy/Downloads/code/my-project/github/deep-webpack/fake-webpack/examples/simple/b.js':
      { id: 2,
        filename: '/Users/lyy/Downloads/code/my-project/github/deep-webpack/fake-webpack/examples/simple/b.js',
        name: 'b',
        requires: [],
        asyncs: [],
        source: '// module b\n\nmodule.exports = function () {\n    console.log(\'b\')\n};',
        chunks: [Array] },
     '/Users/lyy/Downloads/code/my-project/github/deep-webpack/fake-webpack/examples/simple/node_modules/c.js':
      { id: 3,
        filename: '/Users/lyy/Downloads/code/my-project/github/deep-webpack/fake-webpack/examples/simple/node_modules/c.js',
        name: 'c',
        requires: [],
        asyncs: [],
        source: 'module.exports = function () {\n    console.log(\'c\')\n}',
        chunks: [Array] } },
  chunks: { '0': { id: 0, modules: { '0': 'include', '1': 'include', '2': 'include', '3': 'include' } } },
  mapModuleNameToId:
   { '/Users/lyy/Downloads/code/my-project/github/deep-webpack/fake-webpack/examples/simple/example.js': 0,
     a: 1,
     b: 2,
     c: 3 },
  modulesById:
   { '0':
      { id: 0,
        filename: '/Users/lyy/Downloads/code/my-project/github/deep-webpack/fake-webpack/examples/simple/example.js',
        name: '/Users/lyy/Downloads/code/my-project/github/deep-webpack/fake-webpack/examples/simple/example.js',
        requires: [Array],
        asyncs: [],
        source: 'let a = require(\'a\');\nlet b = require(\'b\');\nlet c = require(\'c\');\na();\nb();\nc();\n',
        chunkId: 0,
        chunks: [Array] },
     '1':
      { id: 1,
        filename: '/Users/lyy/Downloads/code/my-project/github/deep-webpack/fake-webpack/examples/simple/a.js',
        name: 'a',
        requires: [],
        asyncs: [],
        source: '// module a\n\nmodule.exports = function () {\n    console.log(\'a\')\n};',
        chunks: [Array] },
     '2':
      { id: 2,
        filename: '/Users/lyy/Downloads/code/my-project/github/deep-webpack/fake-webpack/examples/simple/b.js',
        name: 'b',
        requires: [],
        asyncs: [],
        source: '// module b\n\nmodule.exports = function () {\n    console.log(\'b\')\n};',
        chunks: [Array] },
     '3':
      { id: 3,
        filename: '/Users/lyy/Downloads/code/my-project/github/deep-webpack/fake-webpack/examples/simple/node_modules/c.js',
        name: 'c',
        requires: [],
        asyncs: [],
        source: 'module.exports = function () {\n    console.log(\'c\')\n}',
        chunks: [Array] } } }
*/

/**
 * 负责调用其他模块
 * @param {string} mainModule 主入口模块
 * @param {object} options 构建的选项
 */
module.exports = function (mainModule, options) {
    co(function *() {

        // mainModule: 入口文件的绝对路径
        // options: 一些配置项，类似于 webpack
        // 分析模块间的依赖关系,生成模块依赖关系
        let depTree = yield buildDeps(mainModule, options);

        // 拼接生成目标JS文件
        // 入口文件及其依赖
        for (let chunkId in depTree.chunks) {

            // 必须是自带属性
            if (!depTree.chunks.hasOwnProperty(chunkId)) continue;

            let buffer = [];
            let chunk = depTree.chunks[chunkId];

            // 如果是入口文件，filename 为 options.output;
            // 如果不是入口文件，filename 为 内部定义的名字
            let filename = (chunk.id === 0 ? options.output : path.join(options.outputDirectory, chunk.id + options.outputPostfix));

            if (chunk.id === 0) {
                // 主chunk;
                if (Object.keys(depTree.chunks).length > 1) { // 如果是多入口
                    console.log('async template');
                    buffer.push(templateAsync);
                    buffer.push('/******/({a:');
                    buffer.push(`"${options.outputPostfix}"`);
                    buffer.push(',b:');
                    buffer.push(`"${options.outputJsonpFunction}"`);
                    buffer.push(',\n');
                } else { // 如果是单入口
                    console.log('single template');
                    buffer.push(templateSingle);
                    buffer.push('/******/({\n');
                }
            } else {
                console.log('jsonp chunk');
                // jsonp chunk
                buffer.push('/*****/');
                buffer.push(options.outputJsonpFunction);
                buffer.push('(');
                buffer.push(chunk.id);
                buffer.push(', {\n');
            }

            // 拼接modules进对应的chunk中
            let chunks = writeChunk(depTree, chunk);
            buffer.push(chunks);
            buffer.push('/******/})');
            buffer = buffer.join('');

            // 写文件
            fs.writeFile(filename, buffer, 'utf-8', function (err) {
                if (err) {
                    throw err;
                }
            });
        }

    }).catch(err => console.log(`发生错误${err}, ${err.stack}`));
};
