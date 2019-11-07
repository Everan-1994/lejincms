import axios from '@/libs/api.request'

export const getRole = ({name}) => {
  return axios.request({
    url: '/role',
    method: 'get',
    params: name
  })
}
