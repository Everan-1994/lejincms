import axios from '@/libs/api.request'

export const getPermission = ({name}) => {
  return axios.request({
    url: '/permission',
    method: 'get',
    params: name
  })
}
