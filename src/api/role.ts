
import request from '@/utils/request'

const api = {
  listRole: '/industry/role/findRoleByPage',
  curRole: '/industry/role/insertOrUpdate',
  delRole: '/industry/role/deleteRole',
  lockRoleById: '/industry/role/lockRoleById'
}


/**
 *  获取角色列表
*/
export function getRoleList(data) {
  return request({
    url: api.listRole,
    method: 'POST',
    data
  })
}


/**
 *  新增或更新角色
*/
export function insertOrUpdateRole(data) {
  return request({
    url: api.curRole,
    method: 'POST',
    data
  })
}

/**
 *  删除角色
*/
export function delRole(data) {
  return request({
    url: api.delRole,
    method: 'POST',
    data
  })
}

/**
 *  根据id锁定指定角色
*/
export function lockRoleById(data) {
  return request({
    url: api.lockRoleById,
    method: 'POST',
    data
  })
}