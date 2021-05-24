import request from '@/utils/request'
import md5 from 'blueimp-md5'

export function list(data) {
  return request({
    url: process.env.VUE_APP_SERVERAPI + '/api/web/user/list',
    method: 'post',
    data
  })
}

export function create(data) {
  data.coreUser.password = md5(data.coreUser.password + 'clco')
  return request({
    url: process.env.VUE_APP_SERVERAPI + '/api/web/user/create',
    method: 'post',
    data
  })
}

export function update(data) {
  return request({
    url: process.env.VUE_APP_SERVERAPI + '/api/web/user/update',
    method: 'post',
    data
  })
}

export function del(data) {
  return request({
    url: process.env.VUE_APP_SERVERAPI + '/api/web/user/delete',
    method: 'post',
    data
  })
}

export function setParent(data) {
  return request({
    url: process.env.VUE_APP_SERVERAPI + '/api/web/user/setParent',
    method: 'post',
    data
  })
}
