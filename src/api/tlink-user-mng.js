import request from '@/utils/request'

export function list(data) {
  return request({
    url: process.env.VUE_APP_SERVERAPI + '/api/web/tinkUser/list',
    method: 'post',
    data
  })
}

export function create(data) {
  return request({
    url: process.env.VUE_APP_SERVERAPI + '/api/web/tinkUser/create',
    method: 'post',
    data
  })
}

export function update(data) {
  return request({
    url: process.env.VUE_APP_SERVERAPI + '/api/web/tinkUser/update',
    method: 'post',
    data
  })
}

export function listHasTlinkId(data) {
  return request({
    url: process.env.VUE_APP_SERVERAPI + '/api/web/tinkUser/list/hasTlinkId',
    method: 'post',
    data
  })
}