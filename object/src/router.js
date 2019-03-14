/* 路由分配文件 */ 
import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    // 默认根目录 路由重定向
    {
        path:'/',
        redirect:'/login'
    },
    // 登录
    {
      path: '/login',
      name: 'login',
      component: () => import('./views/Login/Login.vue')
    },
    // 后端首页（容器组件）
    {
      path: '/index',
      component: () => import('./views/Index/Index.vue'),
      children: [
        // 默认就是系统信息
        {
          path: '',
          name: 'systeminfo',
          component: () => import('./views/Systeminfo/Systeminfo.vue')
        },
        // 账号部分
        {
          path: '/index/accountadd',
          name: 'accountadd',
          component: () => import('./views/Accountadd/Accountadd.vue')
        },
        {
          path: '/index/accountmanage',
          name: 'accountmanage',
          component: () => import('./views/Accountmanage/Accountmanage.vue')
        },
        {
          path: '/index/passwordmodify',
          name: 'passwordmodify',
          component: () => import('./views/Passwordmodify/Passwordmodify.vue')
        },
        {
          path: '/index/vipmanage',
          name: 'vipmanage',
          component: () => import('./views/Vipmanage/Vipmanage.vue')
        },
        {
          path: '/index/vipadd',
          name: 'vipadd',
          component: () => import('./views/Vipadd/Vipadd.vue')
        },
        // 商品部分
        {
          path: '/index/goodsadd',
          name: 'goodsadd',
          component: () => import('./views/Goodsadd/Goodsadd.vue')
        },
        {
          path: '/index/goodsmanage',
          name: 'goodsmanage',
          component: () => import('./views/Goodsmanage/Goodsmanage.vue')
        },
        // 统计管理部分
        {
          path: '/index/salesstatistics',
          name: 'salesstatistics',
          component: () => import('./views/Salesstatistics/Salesstatistics.vue')
        },
        {
          path: '/index/stockstatistics',
          name: 'stockstatistics',
          component: () => import('./views/Stockstatistics/Stockstatistics.vue')
        },
        // 进货管理
        {
          path: '/index/stockmanage',
          name: 'stockmanage',
          component: () => import('./views/Stockmanage/Stockmanage.vue')
        },
        {
          path: '/index/addStock',
          name: 'addStock',
          component: () => import('./views/AddStock/AddStock.vue')
        },
        {
          path: '/index/personal',
          name: 'personal',
          component: () => import('./views/Personal/Personal.vue')
        }
      ]
    }
  ]
})
