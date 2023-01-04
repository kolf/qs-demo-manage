
import request from '@/utils/request'

const api = {
  insertOrUpdateArea: '/industry/area/insertOrUpdate',
  listArea: '/industry/area/findAreaByPage',
  deleteArea: '/industry/area/deleteArea',
  findAreaById: '/industry/area/findAreaById'
}


/**
 *  分页查询区域列表
*/
export function getAreaList(data) {
  return request({
    url: api.listArea,
    method: 'POST',
    data
  })
}


/**
 *  新增或更新区域
*/
export function insertOrUpdateArea(data) {
  return request({
    url: api.insertOrUpdateArea,
    method: 'POST',
    data
  })
}

/**
 *  删除指定区域
*/
export function delArea(data) {
  return request({
    url: api.deleteArea,
    method: 'POST',
    data
  })
}

/**
 *  获取区域信息
*/
export function getAreaById(data) {
  return request({
    url: api.findAreaById,
    method: 'POST',
    data
  })
}