import axios from 'axios'
import { store } from '../redux/store'
axios.defaults.baseURL = 'http://localhost:8000'
axios.interceptors.request.use(
  function (config) {
    // 在发送请求之前做些什么
    store.dispatch({
      type: 'change-spinning',
      payloading: true
    })

    return config
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error)
  }
)

// 添加响应拦截器
axios.interceptors.response.use(
  function (response) {
    // 2xx 范围内的状态码都会触发该函数。
    store.dispatch({
      type: 'change-spinning',
      payload: false
    })

    // 对响应数据做点什么
    return response
  },
  function (error) {
    // 超出 2xx 范围的状态码都会触发该函数。
    store.dispatch({
      type: 'change-spinning',
      payload: false
    })

    // 对响应错误做点什么
    return Promise.reject(error)
  }
)
export default axios
