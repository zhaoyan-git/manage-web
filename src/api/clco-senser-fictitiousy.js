import request from '@/utils/request'

export function sensorFictitiousList(data) {
    return request({
        url: process.env.VUE_APP_SERVERAPI + '/api/web/sensor/fictitious/list',
        method: 'post',
        data
    })
}

export function sensorFictitiousCreate(data) {
    return request({
        url: process.env.VUE_APP_SERVERAPI + '/api/web/sensor/fictitious/create',
        method: 'post',
        data
    })
}

export function sensorFictitiousUpdate(data) {
    return request({
        url: process.env.VUE_APP_SERVERAPI + '/api/web/sensor/fictitious/update',
        method: 'post',
        data
    })
}

export function sensorFictitiousDel(data) {
    return request({
        url: process.env.VUE_APP_SERVERAPI + '/api/web/sensor/fictitious/del',
        method: 'post',
        data
    })
}
