import axios from '@/libs/api.request'

/**
 * 角色列表
 * @param name
 * @returns {ClientHttp2Stream | * | void | http.ClientRequest | AxiosPromise<any>}
 */
export const getRole = ({name}) => {
  return axios.request({
    url: '/role',
    method: 'get',
    params: name
  })
}

/**
 * 添加角色
 * @param data
 * @returns {ClientHttp2Stream | * | void | http.ClientRequest | AxiosPromise<any>}
 */
export const addRole = (data) => {
  return axios.request({
    url: '/role',
    method: 'post',
    data
  })
}

/**
 * 更新角色
 * @param data
 * @returns {ClientHttp2Stream | * | void | http.ClientRequest | AxiosPromise<any>}
 */
export const editRole = (data) => {
  return axios.request({
    url: '/role',
    method: 'put',
    data
  })
}

/**
 * 删除角色
 * @param ids
 * @returns {ClientHttp2Stream | * | void | http.ClientRequest | AxiosPromise<any>}
 */
export const delRole = (ids) => {
  return axios.request({
    url: '/role',
    method: 'delete',
    data: ids
  })
}
