import axios from '@/libs/api.request'

/**
 * 权限列表
 * @param name
 * @returns {ClientHttp2Stream | * | void | http.ClientRequest | AxiosPromise<any>}
 */
export const getPermission = (name) => {
  return axios.request({
    url: '/permission',
    method: 'get',
    params: name
  })
}

/**
 * 添加权限
 * @param data
 * @returns {ClientHttp2Stream | * | void | http.ClientRequest | AxiosPromise<any>}
 */
export const addPermission = (data) => {
  return axios.request({
    url: '/permission',
    method: 'post',
    data
  })
}

/**
 * 更新权限
 * @param data
 * @returns {ClientHttp2Stream | * | void | http.ClientRequest | AxiosPromise<any>}
 */
export const editPermission = (data) => {
  return axios.request({
    url: '/permission',
    method: 'put',
    data
  })
}
