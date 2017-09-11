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
                    buffer.push(templateAsync);
                    buffer.push('/******/({a:');
                    buffer.push(`"${options.outputPostfix}"`);
                    buffer.push(',b:');
                    buffer.push(`"${options.outputJsonpFunction}"`);
                    buffer.push(',\n');
                } else { // 如果是单入口
                    buffer.push(templateSingle);
                    buffer.push('/******/({\n');
                }
            } else {
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
