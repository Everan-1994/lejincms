import axios from '@/libs/api.request'

export const getMenu = () => {
  return axios.request({
    url: 'menu',
    method: 'get'
  })
}
