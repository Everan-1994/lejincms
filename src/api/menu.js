import axios from '@/libs/api.request'

// 栏目和权限
export const getMenu = () => {
  return axios.request({
    url: '/menu_action',
    method: 'get'
  })
}

// 栏目列表
export const getMenus = () => {
  return axios.request({
    url: '/menu',
    method: 'get'
  })
}

// 添加栏目
export const addMenu = (data) => {
  return axios.request({
    url: '/menu',
    method: 'post',
    data
  })
}

// 更新栏目
export const editMenu = (data) => {
  return axios.request({
    url: '/menu',
    method: 'put',
    data
  })
}

// 删除栏目
export const delMenu = (ids) => {
  return axios.request({
    url: '/menu',
    method: 'delete',
    data: ids
  })
}
