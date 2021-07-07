import request from '@/utils/request'

export function thresholdList(data) {
    return request({
        url: process.env.VUE_APP_SERVERAPI + '/api/web/threshold/list',
        method: 'post',
        data
    })
}

export function thresholdCreate(data) {
    return request({
        url: process.env.VUE_APP_SERVERAPI + '/api/web/threshold/list/create',
        method: 'post',
        data
    })
}

export function thresholdUpdate(data) {
    return request({
        url: process.env.VUE_APP_SERVERAPI + '/api/web/threshold/list/update',
        method: 'post',
        data
    })
}

export function thresholdDel(data) {
    return request({
        url: process.env.VUE_APP_SERVERAPI + '/api/web/threshold/list/del',
        method: 'post',
        data
    })
}
