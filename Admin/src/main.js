import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
// flex.css
import 'flex.css'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import screenfull from 'screenfull'
import '@/assets/svg-icons'
import '@/components'
import '@/plugin/axios'
import '@/mock/register'
import util from '@/libs/util.js'
import store from '@/store/index'
import pluginOpen from '@/plugin/open'
import axios from 'axios'
import VueAxios from 'vue-axios'

// 菜单和路由设置
import router from './router'
import menuHeader from '@/menu/header'
import menuAside from '@/menu/aside'
import { frameInRoutes } from '@/router/routes'

Vue.use(ElementUI)
Vue.use(pluginOpen)
Vue.use(VueAxios, axios)
Vue.prototype.$axios = axios
Vue.config.productionTip = false


Vue.prototype.$env = process.env.NODE_ENV
Vue.prototype.$baseUrl = process.env.BASE_URL
    //添加axios拦截器
axios.interceptors.request.use(function(config) {
    //header中添加accessToken  
    const accessToken = util.cookies.get('accessToken')

    if (accessToken != "") { //判断token是否存在
        if (config.url != 'http://localhost:17491/connect/token') {
            //将token设置成请求头
            config.headers.common['Authorization'] = 'Bearer ' + accessToken;
            console.log(accessToken);
        }
    }
    return config;
}, function(error) {
    console.log(error);
    // 对请求错误做些什么
    return Promise.reject(error);
});
//axios响应拦截器
axios.interceptors.response.use(function(response) {
    // 在接收响应做些什么，例如跳转到登录页

    return response;
}, function(error) {
    console.log(error);
    if (error.response) {
        switch (error.response.status) {
            case 4010:
                const refreshToken = util.cookies.get('refreshToken');
                console.log("refreshToken" + refreshToken);
                var url = "http://localhost:17491/connect/token";
                let param = new URLSearchParams();
                param.append("client_id", 'js');
                param.append("client_secret", '');
                param.append("grant_type", 'refresh_token');
                param.append("refresh_token", refreshToken);
                axios({
                    method: 'post',
                    url: url,
                    data: param,
                    params: param,
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' } //设置header信息
                }).then(function(response) {
                    console.log(response);
                    util.cookies.set('accessToken', response.access_token)
                    util.cookies.set('refreshToken', response.refresh_token)
                }).catch(function(error) {
                    console.log(error);
                });
        }
    }
    return Promise.reject(error);
});

new Vue({
    router,
    store,
    render: h => h(App),
    created() {
        // 处理路由 得到每一级的路由设置
        this.getAllPageFromRoutes()
            // 设置顶栏菜单
        this.$store.commit('d2adminMenuHeaderSet', menuHeader)
            // 设置侧边栏菜单
        this.$store.commit('d2adminMenuAsideSet', menuAside)
    },
    mounted() {
        // 获取并记录用户 UA
        this.$store.commit('d2adminUaGet')
            // 展示系统信息
        util.showInfo()
            // 用户登陆后从数据库加载一系列的设置
        this.$store.commit('d2adminLoginSuccessLoad')
            // 初始化全屏监听
        this.fullscreenListenerInit()
    },
    methods: {
        /**
         * 初始化全屏监听
         */
        fullscreenListenerInit() {
            if (screenfull.enabled) {
                screenfull.on('change', () => {
                    if (!screenfull.isFullscreen) {
                        this.$store.commit('d2adminFullScreenSet', false)
                    }
                })
            }
        },
        /**
         * 处理路由 得到所有的页面
         */
        getAllPageFromRoutes() {
            const pool = []
            const push = function(routes) {
                routes.forEach(route => {
                    if (route.children) {
                        push(route.children)
                    } else {
                        const { meta, name, path } = route
                        pool.push({ meta, name, path })
                    }
                })
            }
            push(frameInRoutes)
            this.$store.commit('d2adminPagePoolSet', pool)
        }
    }
}).$mount('#app')