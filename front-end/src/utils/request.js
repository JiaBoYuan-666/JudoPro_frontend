import axios from 'axios'
const baseURL = '/api/'

const request = axios.create({
  baseURL: baseURL,
  timeout: 10000
})

// 添加请求拦截器
request.interceptors.request.use(
  function (config) {

    return config
  },
  function (error) {

    return Promise.reject(error)
  }
)

// 添加响应拦截器
request.interceptors.response.use(
  function (response) {

    return response
  },
  function (error) {
    return Promise.reject(error)
  }
)

export default request
export { baseURL }