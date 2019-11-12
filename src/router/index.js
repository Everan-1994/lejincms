import Vue from 'vue'
import Router from 'vue-router'
import { constantRouterMap as routes } from './base-router'
import store from '@/store'
import iView from 'view-design'
import { getValue, setTitle, timeFix } from '@/libs/util'
import config from '@/config'

const { baseUrl } = config

Vue.use(Router)

const router = new Router({
  routes,
  mode: 'history'
})

const LOGIN_PAGE_NAME = 'login'

const whiteList = [LOGIN_PAGE_NAME] // 免登陆白名单

router.beforeEach((to, from, next) => {
  iView.LoadingBar.start()
  const token = getValue('token')
  if (!token && to.name !== LOGIN_PAGE_NAME) {
    if (whiteList.includes(to.name)) {
      // 在免登录白名单，直接进入
      next()
    } else {
      // 未登录且要跳转的页面不是登录页
      next({ name: LOGIN_PAGE_NAME })
    }
  } else if (!token && to.name === LOGIN_PAGE_NAME) {
    // 未登陆且要跳转的页面是登录页
    next() // 跳转
  } else if (token && to.name === LOGIN_PAGE_NAME) {
    // 已登录且要跳转的页面是登录页
    next({
      name: homeName // 跳转到homeName页
    })
  } else {
    // 菜单或权限为空则重新登录
    if (store.getters.addRouters.length === 0 /* || store.getters.action.length === 0 */) {
      iView.Spin.show() // 开启加载
      store.dispatch('GenerateRoutes')
        .then(() => {
          // 动态添加可访问路由表
          router.addRoutes(store.getters.addRouters)
          // hack方法 确保addRoutes已完成 , set the replace: true so the navigation will not leave a history record
          next({ ...to, replace: true })
          // 提示欢迎信息
          setTimeout(() => {
            iView.Notice.success({
              title: '系统提示',
              desc: `${timeFix()}，欢迎回来`,
              duration: 2
            })
          }, 1500)
        })
        .catch((err) => {
          // 隐藏加载
          iView.Spin.hide()
          // 弹窗提示
          iView.Modal.error({
            title: '系统提示',
            content: '后台初始化失败，请重新登录',
            onOk: () => {
              next({ name: LOGIN_PAGE_NAME })
            }
          });
          console.log('err', err)
        })
    } else {
      next()
    }
  }
})

router.afterEach(to => {
  setTitle(to, router.app)
  iView.Spin.hide() // 隐藏加载
  iView.LoadingBar.finish()
  window.scrollTo(0, 0)
})

export default router
