import request from '@/utils/request'
import md5 from 'blueimp-md5'

export function login(data) {
  data.password = md5(data.password + 'clco')
  return request({
    url: process.env.VUE_APP_SERVERAPI + '/backLogin',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: process.env.VUE_APP_SERVERAPI + '/userInfo',
    method: 'post',
    headers: { 'Authorization': token }
  })
}

export function logout() {
  return request({
    url: '/vue-element-admin/user/logout',
    method: 'post'
  })
}
