import request from '@/utils/request.js'

// 模型分页查询接口
export const modelPageService = (page, pageSize, name) => {
  return request.get('/model/page', {
    params: {
      page,
      pageSize,
      name
    }
  })
}

// 通过 ID 查询模型
export const getModelService = (id) => {
  return request.get('/model', {
    params: {
      id
    }
  })
}
