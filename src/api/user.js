import request from '@/utils/request'
import md5 from 'blueimp-md5'

export function login(data) {
  //data.password = md5(data.password + 'wxcxc')
  return request({
    url: process.env.VUE_APP_SERVERAPI + '/login',
    method: 'post',
    data
  })
}

export function getInfo() {
  return request({
    url: process.env.VUE_APP_SERVERAPI + '/getInfo',
    method: 'get',
  })
}

export function logout() {
  return request({
    url: '/vue-element-admin/user/logout',
    method: 'post'
  })
}
