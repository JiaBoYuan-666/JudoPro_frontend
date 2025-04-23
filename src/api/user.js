import request from '@/utils/request.js'

// 登录接口
export const userLoginService = ({ data, username, password }) => {
  return request.post('/login', { data, username, password })
}

// 注册接口
export const userRegisterService = ({ data, username, password, name, phone }) => {
  return request.post('/register', { data, username, password, name, phone })
}
