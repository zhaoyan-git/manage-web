import request from '@/utils/request'

export function deviceSensorlist(data) {
  return request({
    url: process.env.VUE_APP_SERVERAPI + '/api/web/sensor/list',
    method: 'post',
    data
  })
}

export function deviceSensorSave(data) {
  return request({
    url: process.env.VUE_APP_SERVERAPI + '/api/web/sensor/save',
    method: 'post',
    data
  })
}
