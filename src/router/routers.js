import Main from '@/components/main'
import parentView from '@/components/parent-view'

/**
 * iview-admin中meta除了原生参数外可配置的参数:
 * meta: {
 *  title: { String|Number|Function }
 *         显示在侧边栏、面包屑和标签栏的文字
 *         使用'{{ 多语言字段 }}'形式结合多语言使用，例子看多语言的路由配置;
 *         可以传入一个回调函数，参数是当前路由对象，例子看动态路由和带参路由
 *  hideInBread: (false) 设为true后此级路由将不会出现在面包屑中，示例看QQ群路由配置
 *  hideInMenu: (false) 设为true后在左侧菜单不会显示该页面选项
 *  notCache: (false) 设为true后页面在切换标签后不会缓存，如果需要缓存，无需设置这个字段，而且需要设置页面组件name属性和路由配置的name一致
 *  access: (null) 可访问该页面的权限数组，当前路由设置的权限会影响子路由
 *  icon: (-) 该页面在左侧菜单、面包屑和标签导航处显示的图标，如果是自定义图标，需要在图标名称前加下划线'_'
 *  beforeCloseName: (-) 设置该字段，则在关闭当前tab页时会去'@/router/before-close.js'里寻找该字段名对应的方法，作为关闭前的钩子函数
 * }
 */

// eslint-disable-next-line
import { getMenu } from '@/api/menu'

// 前端路由表
const constantRouterComponents = {
  Main: Main,
  'error_404': () => import('@/view/error-page/404'),

  // 需要动态引入的页面组件
  'AdminUser': () => import('@/view/lejin-setting/admin-user'), // 管理员
  'Role': () => import('@/view/lejin-setting/role'), // 角色
  'Permission': () => import('@/view/lejin-setting/permission'), // 权限
  'Menus': () => import('@/view/lejin-setting/menus'), // 栏目


}

// 前端未找到页面路由（防止第一次没有路由数据跳转到404）
const notFoundRouter = {
  path: '*',
  name: 'error_404',
  meta: {
    hideInMenu: true
  }
}

/**
 * 动态生成菜单
 * @returns {Promise<Router>}
 */
export const generatorDynamicRouter = () => {
  return new Promise((resolve, reject) => {
    getMenu().then(res => {
      const data = res.data.data
      const routers = generator(data.menu)
      routers.push(notFoundRouter)
      resolve({menu: routers, action: data.action})
    }).catch(err => {
      reject(err)
    })
  })
}

/**
 * 格式化树形结构数据 生成 vue-router 层级路由表
 *
 * @param routerMap
 * @param parent
 * @returns {*}
 */
export const generator = (routerMap, parent) => {
  return routerMap.map(item => {
    const currentRouter = {
      path: `/${item.path}`,
      // 路由名称，建议唯一
      name: item.name,
      // 菜单图标
      icon: item.meta.icon,
      // 该路由对应页面的 组件
      component: constantRouterComponents[item.component || item.name],
      // meta: 页面标题, 菜单图标...
      meta: item.meta
    }
    // 是否有子菜单，并递归处理
    if (item.children && item.children.length > 0) {
      // Recursion
      currentRouter.children = generator(item.children, currentRouter)
    }
    return currentRouter
  })
}
