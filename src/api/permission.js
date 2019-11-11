import axios from '@/libs/api.request'

// 权限列表
export const getPermission = (name) => {
  return axios.request({
    url: '/permission',
    method: 'get',
    params: name
  })
}

// 添加权限
export const addPermission = (data) => {
  return axios.request({
    url: '/permission',
    method: 'post',
    data
  })
}

// 更新权限
export const editPermission = (data) => {
  return axios.request({
    url: '/permission',
    method: 'put',
    data
  })
}

// 删除权限
export const delPermission = (ids) => {
  return axios.request({
    url: '/permission',
    method: 'delete',
    data: ids
  })
}
