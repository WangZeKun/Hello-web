import Vue from 'vue'
import axios from 'axios'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import 'font-awesome/css/font-awesome.min.css'
import App from './App'
import router from './router'
//import store from './store'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

Vue.use(ElementUI)
/* eslint-disable no-new */


router.beforeEach((to, from, next) => {
    //NProgress.start();
    if (to.path == '/login') {
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('type');
    }
    let user = JSON.parse(sessionStorage.getItem('user'));
    let type1 = sessionStorage.getItem('type');
    if (!user && to.path != '/login') {
        next({path: '/login'})
    } else if (to.path.indexOf(type1) === -1 && to.path != '/login') {
        next({path: '/' + type1})
    } else {
        next()
    }
});

new Vue({
    components: {App},
    router,
    //store,
    template: '<App/>'
}).$mount('#app')
