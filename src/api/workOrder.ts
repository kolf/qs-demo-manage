import request from '@/utils/request'

const api = {
  getWorkStatistics: '/industry/synthesis/getWorkStatistics',
  listWord: '/industry/synthesis/findListByPageWord',
  saveOrUpdateByWork: '/industry/synthesis/saveOrUpdateByWork',
  findWorkListByPage: '/industry/synthesis/findWorkListByPage',
  saveRejectByWork: '/industry/synthesis/saveRejectByWork',
  saveWorkData: '/industry/synthesis/saveWorkData'
}

/**
 * 获取工单统计信息
*/
export function getWorkStatistics(data) {
  return request({
    url: api.getWorkStatistics,
    method: 'post',
    data: data
  })
}

/**
 * 分页获取工单信息 列表
*/
export function getListWord(data) {
  return request({
    url: api.listWord,
    method: 'post',
    data
  })
}

/**
 * 新增或更新工单信息
*/
export function addOrUpdateByWork(data) {
  return request({
    url: api.saveOrUpdateByWork,
    method: 'post',
    data
  })
}

/**
 * 分页获取我的待办工单
*/
export function findWorkListByPage(data) {
  return request({
    url: api.findWorkListByPage,
    method: 'post',
    data
  })
}


/* 保存驳回信息 */
export function saveRejectByWork(data) {
  return request({
    url: api.saveRejectByWork,
    method: 'post',
    data
  })
}


/* 保存工单处理信息 */
export function saveWorkData(data) {
  return request({
    url: api.saveWorkData,
    method: 'post',
    data
  })
}