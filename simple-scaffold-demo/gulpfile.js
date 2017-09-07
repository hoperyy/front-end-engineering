
function configDevServer({ srcDir, buildDir, debugPort }) {

    const webpack = require('webpack');
    const webpackDevServer = require('webpack-dev-server');

    const webpackConfig = require('./webpack.config')({ srcDir, buildDir });

    webpackConfig.plugins.push(new webpack.HotModuleReplacementPlugin());

    for(let k in webpackConfig.entry) {
        webpackConfig.entry[k].unshift(`webpack-dev-server/client?http://127.0.0.1:${debugPort}`, 'webpack/hot/dev-server');
    }

    console.log('\nwebpack: Compiling...');

    const server = new webpackDevServer(webpack(webpackConfig), {
        contentBase: buildDir,
        hot: true,
        historyApiFallback: true,
        quiet: false,
        noInfo: false,
        stats: {
            chunks: false,
            colors: true
        },
        publicPath: webpackConfig.output.publicPath,
        disableHostCheck: true,
        watchOptions: {
            ignored: /\/node_modules\//,
            poll: 300
        }
    });

    server.listen(debugPort);

}


function runBuild({ srcDir, buildDir, debugPort }) {

    const webpack = require('webpack');
    const webpackConfig = require('./webpack.config')({ srcDir, buildDir });

    webpack(webpackConfig, () => {});
}

module.exports = ({ srcDir, buildDir, currentEnv, debugPort }) => {

    // runDev({ srcDir, buildDir, debugPort });
    runBuild({ srcDir, buildDir });
};
