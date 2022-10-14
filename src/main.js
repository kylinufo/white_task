import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui';
import router  from "./router";
import axios  from "axios";
import 'element-ui/lib/theme-chalk/index.css';
import Wallet from './utils/wallet';
import VueClipBoard from 'vue-clipboard2'
import pubsub from 'pubsub-js'


import Vconsole from 'vconsole';




Vue.config.productionTip = false
// let vConsole = new Vconsole();
Vue.use(ElementUI)
Vue.use(VueClipBoard)
Vue.prototype.$pubsub = pubsub;
Vue.prototype.$wallet = Wallet;
axios.defaults.withCredentials=true
new Vue({
	render: h => h(App),
	router
}).$mount('#app')
