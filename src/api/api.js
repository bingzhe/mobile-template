import http from '@/config/encsubmit'
import Vue from 'vue'
// import { errcode } from '@/config/cfg'

/**
 * generate requeset fn
 * @param {string} interfaceFile 接口名
 * @return {Function}
 */
function generateRequestFn(interfaceFile, options = {}) {
  /**
   * 返回的请求函数
   * @param {string} data 请求数据
   * @param {boolean} showErrTip 是否显示全局错误提示
   * @return Promise
   */
  const fn = (data, showErrTip = true) => {
    return new Promise((resolve, reject) => {
      http.DataEncSubmit(
        interfaceFile,
        data,
        resp => {
          if (resp.ret !== 0) {
            if (showErrTip) {
              Vue.prototype.$message.error(resp.msg)
            }
          }
          resolve(resp)
        },
        options
      )
    })
  }
  return fn
}
