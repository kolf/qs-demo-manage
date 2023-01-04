import request from '@/utils/request'

const api = {
  getWarningStatistics: '/industry/synthesis/getWarningStatistics',
  getWarningList: '/industry/synthesis/findListByPageMessage',
  getByWarning: '/industry/synthesis/getByWarning'
}


/**
 *  获取预警统计信息
*/
export function getWarningStatistics() {
  return request({
    url: api.getWarningStatistics,
    method: 'GET',
  })
}

/* 获取预警信息列表 */
export function getWarningList(data) {
  return request({
    url: api.getWarningList,
    method: 'POST',
    data
  })
}


/* 获取预警信息列表 */
export function getByWarning() {
  return request({
    url: api.getByWarning,
    method: 'get',
  })
}




