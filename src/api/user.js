import axios from '@/libs/api.request'

// 登录
export const login = ({ userName, password }) => {
  const data = {
    username: userName,
    password: password
  }
  return axios.request({
    url: 'login',
    data,
    method: 'post'
  })
}
// 登出
export const logout = () => {
  return axios.request({
    url: 'logout',
    method: 'delete'
  })
}
// 管理员列表
export const getAdminUser = (data) => {
  return axios.request({
    url: '/admin_user',
    method: 'get',
    params: data
  })
}
// 新增管理员
export const addAdminUser = (data) => {
  return axios.request({
    url: '/admin_user',
    method: 'post',
    data
  })
}
// 编辑管理员
export const editAdminUser = (data) => {
  return axios.request({
    url: '/admin_user',
    method: 'put',
    data
  })
}
// 编辑管理员状态
export const updateStatus = (data) => {
  return axios.request({
    url: '/admin_user',
    method: 'patch',
    data
  })
}
// 删除管理员
export const delAdminUser = (data) => {
  return axios.request({
    url: '/admin_user',
    method: 'delete',
    data
  })
}

export const getUnreadCount = () => {
  return axios.request({
    url: 'message/count',
    method: 'get'
  })
}

export const getMessage = () => {
  return axios.request({
    url: 'message/init',
    method: 'get'
  })
}

export const getContentByMsgId = msg_id => {
  return axios.request({
    url: 'message/content',
    method: 'get',
    params: {
      msg_id
    }
  })
}

export const hasRead = msg_id => {
  return axios.request({
    url: 'message/has_read',
    method: 'post',
    data: {
      msg_id
    }
  })
}

export const removeReaded = msg_id => {
  return axios.request({
    url: 'message/remove_readed',
    method: 'post',
    data: {
      msg_id
    }
  })
}

export const restoreTrash = msg_id => {
  return axios.request({
    url: 'message/restore',
    method: 'post',
    data: {
      msg_id
    }
  })
}
