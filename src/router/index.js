
import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
const routes = [
    {
        path: '/task',
        name: 'Upload pictures',
        component: () => import('../components/Upload.vue')
    },
    {
        path: '/rewards',
        name: 'Receive rewards',
        component: () => import('../components/Rewards.vue')
    },
]
const router = new Router({
    routes
})
export default router