import axios from 'axios'
import store from '@/store'
import { getValue, setValue } from './util'
import iView from 'view-design'
const addErrorLog = errorInfo => {
  const { statusText, status, request: { responseURL } } = errorInfo
  let info = {
    type: 'ajax',
    code: status,
    mes: statusText,
    url: responseURL
  }
  if (!responseURL.includes('save_error_logger')) store.dispatch('addErrorLog', info)
}

class HttpRequest {
  constructor (baseUrl = baseURL) {
    this.baseUrl = baseUrl
    this.queue = {}
  }
  getInsideConfig () {
    const config = {
      baseURL: this.baseUrl,
      headers: {
        //
      }
    }
    return config
  }
  destroy (url) {
    delete this.queue[url]
    if (!Object.keys(this.queue).length) {
      // Spin.hide()
    }
  }
  interceptors (instance, url) {
    // 请求拦截
    instance.interceptors.request.use(config => {
      // 头部携带 token
      let token = getValue('token')
      if (token) {
        config.headers['Authorization'] = token
      }
      // 添加全局的loading...
      if (!Object.keys(this.queue).length) {
        // Spin.show() // 不建议开启，因为界面不友好
      }
      this.queue[url] = true
      return config
    }, error => {
      return Promise.reject(error)
    })
    // 响应拦截
    instance.interceptors.response.use(res => {
      this.checkRespCode(res.data)
      // 判断响应中是否有 token，如果有就直接使用此 token 替换掉本地的 token。你可以根据你的业务需求自己编写更新 token 的逻辑
      let token = res.headers.authorization
      if (token) {
        // 如果 header 中存在 token，那么就替换本地的 token
        setValue('token', token)
      }
      this.destroy(url)
      const { data, status } = res
      return { data, status }
    }, error => {
      this.destroy(url)
      let errorInfo = error.response
      if (!errorInfo) {
        const { request: { statusText, status }, config } = JSON.parse(JSON.stringify(error))
        errorInfo = {
          statusText,
          status,
          request: { responseURL: config.url }
        }
      }
      // addErrorLog(errorInfo) 本地错误记录
      this.checkRespCode(error.data)
      return Promise.reject(error)
    })
  }
  request (options) {
    const instance = axios.create()
    options = Object.assign(this.getInsideConfig(), options)
    this.interceptors(instance, options.url)
    return instance(options)
  }
  checkRespCode (resp) {
    if (typeof resp === 'Object') {
      switch (resp.code) {
        case 10005:
          iView.Modal.error({
            title: '系统提示',
            content: '<p>登录信息已过期，请重新登录</p>',
            onOk: () => {
              iView.Modal.remove();
              iView.router.push({
                name: 'login'
              })
            }
          });
          return;
        default:
          break;
      }
    }
  }
}
export default HttpRequest
