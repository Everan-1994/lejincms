import { constantRouterMap } from '@/router/base-router'
import { generatorDynamicRouter } from '@/router/routers'

const router = {
  state: {
    routers: constantRouterMap,
    addRouters: [],
    action: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
    },
    SET_ACTIONS: (state, actions) => {
      state.action = actions
    }
  },
  actions: {
    GenerateRoutes ({ commit }) {
      return new Promise(resolve => {
        generatorDynamicRouter().then(res => {
          commit('SET_ROUTERS', res.menu) // 菜单
          commit('SET_ACTIONS', res.action) // 权限
          resolve()
        })
      })
    }
  }
}

export default router
