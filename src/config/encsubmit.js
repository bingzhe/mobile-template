import axios from 'axios'
import Util from './util'
import { errcode } from './cfg'
import Crypt, { decrypt, encrypt } from './encrypt'

const base_url = process.env.VUE_APP_BASEURL

/*
 * other : {
 *      is_get_param: 1,            // 只返回要提交的参数（不执行提交动作）
 *      encmode: xxx                // 数据加密方式[""|encrypt1|aes]
 *      ...
 * }
 */
const Http = new function() {
  const THIS = this
  const RSA_SVC_PATH = base_url + '/rsa_info.php' // 指定取公钥地址 [XXX]

  THIS.token = window.Store.GetGlobalData('token', '')
  THIS.data_key = window.Store.GetGlobalData('key', '')

  // 监控，当本地存储有变化时，更新到当前对象中。
  window.Store.GlobalWatch('key', v => {
    // console.log(v);
    THIS.data_key = v.new_value
  })
  window.Store.GlobalWatch('token', v => {
    // console.log(v);
    THIS.token = v.new_value
  })

  const JsonToUrlParam = function(param) {
    const p = new URLSearchParams()
    for (var i in param) {
      p.append(i, param[i])
    }
    return p
  }

  axios.defaults.timeout = 30000 // 设置超时时间(毫秒)
  // axios.defaults.responseType = 'json';
  const Post = function(url, param, callback) {
    const p = JsonToUrlParam(param)
    axios.post(url, p)
      .then((resp) => {
        resp = resp || {}
        resp = resp.data || {}
        resp.ret = parseInt(resp.ret)
        if (isNaN(resp.ret)) {
          resp.ret = -1
        }
        resp.data = resp.data || {}
        callback(resp)
      }).catch(function(e) {
        let msg = ''
        if (e.response) {
          msg = e.response.status + ', ' + e.response.statusText
        } else {
          msg = e.message
        }
        console.error(e.stack)
        callback({
          ret: -1,
          msg: msg
        })
      })
  }

  const GetPublicKey = function(callback) {
    Post(RSA_SVC_PATH, { publickey: 1 }, callback)
  }

  const SubmitDataKey = function(publickey, callback) {
    const key = Util.GetRandString(16) // 随机key
    console.log('key:' + key)
    var rsa = new JSEncrypt()
    rsa.setPublicKey(publickey)
    var key_enc = rsa.encrypt(key)
    const p = {
      'save_key': 1,
      'is_plain': 1,
      'key_enc': key_enc,
      'token': THIS.token
    }
    Post(RSA_SVC_PATH, p, resp => {
      THIS.data_key = key
      window.Store.SetGlobalData('key', key)
      callback(resp)
    })
  }

  THIS.EncSubmit = function(url, data, resp_callback, opt) {
    if (!(data instanceof Object)) {
      // param err
      return
    }
    opt = opt || {}
    opt.is_get_param = opt.is_get_param || false
    opt.encmode = opt.encmode || ''
    resp_callback = resp_callback || function(v) { }

    // 当前终端的标识
    if (!THIS.token) {
      THIS.token = 'T3' + Util.GetRandString(14)
      window.Store.SetGlobalData('token', THIS.token)
    }

    const ToServer = function() {
      let datastr = JsonToUrlParam(data).toString()
      if (opt.encmode === 'encrypt1') {
        datastr = encrypt(THIS.data_key, datastr)
      }
      var param = {
        token: THIS.token,
        encmode: opt.encmode,
        data: datastr,
        userid: window.Store.GetGlobalData('USERID'),
        sign: Crypt.Md5(datastr + THIS.data_key)
      }

      // 只取参数
      if (opt.is_get_param) {
        return param
      }

      Post(
        url + '?' + (new Date()).getTime(),
        param,
        resp => {
          if (errcode.USER_NOLOGIN === resp.ret) {
            resp_callback(resp)
          } else if (errcode.DATA_KEY_NOT_EXIST === resp.ret) {
            resp_callback(resp)
            window.Store.SetGlobalData('key', '')
          }
          if (resp.ret === 0 && resp.crypt === '1' && resp.data !== '') {
            resp.data = JSON.parse(decrypt(THIS.data_key, resp.data))
            delete resp.crypt
          }
          return resp_callback(resp)
        }
      )
    }

    // 前后台数据加密（验证）用随机密码
    if (!THIS.data_key) {
      GetPublicKey(resp => {
        if (resp.ret !== 0) {
          // console.log(resp.data.publickey);
          resp_callback(resp)
          return
        }
        SubmitDataKey(resp.data.publickey, v => {
          if (resp.ret !== 0) {
            resp_callback(resp)
            return
          }
          // console.log(v);
          ToServer()
        })
      })
    } else {
      ToServer()
    }
  }// end of EncSubmit : function(...

  THIS.DataEncSubmit = function(url, data, resp_callback, opt) {
    for (const item in data) {
      if (typeof (data[item]) !== 'string' && typeof (data[item]) !== 'number' && typeof (data[item]) !== 'boolean') {
        data[item] = JSON.stringify(data[item])
      }
    }

    return THIS.EncSubmit(
      base_url + '/' + url,
      data,
      (resp) => {
        if (resp_callback && typeof resp_callback === 'function') {
          resp_callback(resp)
        }
      },
      opt
    )
  }
}()

export default Http
