import request from '@/utils/request'

export function sensorGrouplist(data) {
    return request({
        url: process.env.VUE_APP_SERVERAPI + '/api/web/sensorGroup/list',
        method: 'post',
        data
    })
}

export function devicelist(data) {
    return request({
        url: process.env.VUE_APP_SERVERAPI + '/api/web/device/findAll',
        method: 'post',
        data
    })
}

export function sensorListByGroupeId(data) {
    return request({
        url: process.env.VUE_APP_SERVERAPI + '/api/web/sensor/list/byGroupId',
        method: 'post',
        data
    })
}

export function sensorListByDeviceId(data) {
    return request({
        url: process.env.VUE_APP_SERVERAPI + '/api/web/sensor/list/byDeviceId',
        method: 'post',
        data
    })
}

export function sensorListByDeviceIdAndSensorTypeId(data) {
    return request({
        url: process.env.VUE_APP_SERVERAPI + '/api/web/sensor/list/byDeviceIdAndSensorTypeId',
        method: 'post',
        data
    })
}

export function sensorListCreate(data) {
    return request({
        url: process.env.VUE_APP_SERVERAPI + '/api/web/sensor/list/create',
        method: 'post',
        data
    })
}

export function sensorListUpdate(data) {
    return request({
        url: process.env.VUE_APP_SERVERAPI + '/api/web/sensor/list/update',
        method: 'post',
        data
    })
}

export function sensorListDel(data) {
    return request({
        url: process.env.VUE_APP_SERVERAPI + '/api/web/sensor/list/del',
        method: 'post',
        data
    })
}