import request from './request'

export const getapData = () => {
  return request({
    url: '/pddata/100dataap',
  })
}

export const getpqData = (uid, type) => {
  return request({
    url: '/pddata/datapq',
  })
}

export const getpanData = (uid, type) => {
  return request({
    url: '/pddata/datapan',
  })
}

export const getprpsData = (uid, type) => {
  return request({
    url: '/pddata/dataprps',
  })
}
export const getpqDataLimit = (data) => {
  return request({
    url: '/pddata/getpqdatalimit',
    method: 'POST',
    data
  })
}
export const getapDataLimit = (data) => {
  return request({
    url: '/pddata/getapdatalimit',
    method: 'POST',
    data
  })
}
export const getprpsDataLimit = (data) => {
  return request({
    url: '/pddata/dataprpslimit',
    method: 'POST',
    data
  })
}
export const getTestPrpsDataLimit = (data) => {
  return request({
    url: '/pddata/testdataprpslimit',
    method: 'POST',
    data
  })
}
