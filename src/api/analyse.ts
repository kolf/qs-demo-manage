import request from '@/utils/request'

const api = {
  findListByPageAnalyse: '/industry/synthesis/findListByPageAnalyse',

}

/**
 *  分页获取分析文件报表 列表
*/
export function getListByPageAnalyse(data) {
  return request({
    url: api.findListByPageAnalyse,
    method: 'post',
    data
  })
}

