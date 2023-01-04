import request from '@/utils/request'

const api = {
  getLoginUrl: '/star-auth/login/getDingTalkLoginUrl',
  getUserInfo: '/star-auth/login/getUserInfo',
  logout: '/star-auth/login/logout',
  userList: '/industry/user/findUserByPage',
  insertOrUpdate: '/industry/user/insertOrUpdate',
  delUser: '/industry/user/deleteById',
  // 新
  login: '/industry/user/login'
}


/* 密码登录 */
export function Login(data) {
  return request({
    url: api.login,
    method: 'post',
    data
  })
}

/**
 *  获取钉钉登录地址
 * @param clientId 0 = 综合管理 1=上传工具
 * @param uuid 
*/
export function getLoginUrl(data: { clientId: number; uuid: string }) {
  return request({
    url: api.getLoginUrl,
    method: 'post',
    data
  })
}

/** 
*  获取用户信息
 * @param clientId 0 = 综合管理 1=上传工具
 * @param uuid 
*/

export function getUserInfo(data: { clientId: number; uuid: string; }) {
  return request({
    url: api.getUserInfo,
    method: 'post',
    data
  })
}

/** 
*  用户登出
 * @param clientId 0 = 综合管理 1=上传工具
 * @param uuid 
*/

export function logout(data: any) {
  return request({
    url: api.logout,
    method: 'post',
    data
  })
}

/** 
*  获取用户列表
*/

export function getUserList(data) {
  return request({
    url: api.userList,
    method: 'post',
    data
  })
}

/** 
*  用户新增或者修改
*/

export function insertOrUpdateUser(data) {
  return request({
    url: api.insertOrUpdate,
    method: 'post',
    data
  })
}

/**
*  删除用户登录
*/

export function delUser(data) {
  return request({
    url: api.delUser,
    method: 'post',
    data
  })
}





