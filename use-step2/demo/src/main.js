import Vue from 'vue';
import VueRouter from 'vue-router';

const App = require('./app'); // 这里移除了 .vue 后缀，仍然可以使用，webpack 会自动添加 .vue 后缀，因为 webpack.config.js 里已经有相应的配置了

Vue.use(VueRouter);
const router = new VueRouter(require('./router'))

new Vue({
    el: '#app',
    router: router,
    render: h => h(App)
});


console.warn('$_TEST_REPLACE_$');
