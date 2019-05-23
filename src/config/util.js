const _toString = Object.prototype.toString
const hasOwnProperty = Object.prototype.hasOwnProperty

const Util = {
  // 取[begin, end]间的数据整数
  GetRandom: function(begin, end) {
    var num = Math.random() * 100000000
    return Math.floor(num % (end - begin + 1) + begin)
  },

  // 取len长的随机字符串
  GetRandString: function(len, range) {
    range = range || '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
    var s = range.split('')
    var ret = ''
    for (var i = 0; i < len; i++) {
      ret += s[this.GetRandom(0, s.length - 1)]
    }
    return ret
  },
  isTrue: function(v) {
    return v === true
  },
  isFalse: function(v) {
    return v === false
  },
  // 未定义
  isUndef: function(v) {
    return v === undefined || v === null
  },
  // 已定义
  isDef: function(v) {
    return v !== undefined && v !== null
  },
  // isPrimitive
  isPrimitive: function(v) {
    typeof v === 'string' ||
      typeof v === 'number' ||
      typeof v === 'symbol' ||
      typeof v === 'boolean'
  },
  isObject: function(obj) {
    return obj !== null && typeof obj === 'object'
  },
  // 纯javascript对象
  isPlainObject: function(obj) {
    return _toString.call(obj) === '[object Object]'
  },
  // 是否是RegExp对象
  isRegExp: function(obj) {
    return _toString.call(obj) === '[object RegExp]'
  },
  // Check if val is a valid array index
  isValidArrayIndex: function(val) {
    var n = parseFloat(String(val))
    return n >= 0 && Math.floor(n) === n && isFinite(val)
  },
  /**
   * 转字符串
   * null 和 undefined 转成空字符转，对象转成格式化的JSON字符串，其他调用String()
   */
  toString: function(val) {
    return val === null
      ? ''
      : typeof val === 'object'
        ? JSON.stringify(val, null, 2)
        : String(val)
  },
  /**
   * 字符串转化为数字
   * 转化失败返回原字符串
   */
  toNumber: function(val) {
    var n = parseFloat(val)
    return isNaN(n) ? val : n
  },
  // 数组中删除一项
  remove: function(arr, item) {
    if (arr.length) {
      var index = arr.indexOf(item)
      if (index > -1) {
        return arr.splice(index, 1)
      }
    }
  },
  // 对象是否有某个属性
  hasOwn: function(obj, key) {
    return hasOwnProperty.call(obj, key)
  },
  // 将类数组的对象转换成数组
  toArray: function(list, start) {
    start = start || 0
    var i = list.length - start
    var ret = new Array(i)
    while (i--) {
      ret[i] = list[i + start]
    }
    return ret
  },
  // 混合属性到目标属性
  extend: function(to, _from) {
    for (var key in _from) {
      to[key] = _from[key]
    }
    return to
  },
  // 合并Array数组中的每一个对象到一个新的Object中
  toObject: function(arr) {
    const res = {}
    for (let i = 0; i < arr.length; i++) {
      if (arr[i]) {
        Util.extend(res, arr[i])
      }
    }
    return res
  },
  // 检测两个变量是否相等
  looseEqual: function(a, b) {
    if (a === b) { return true }
    var isObjectA = Util.isObject(a)
    var isObjectB = Util.isObject(b)
    if (isObjectA && isObjectB) {
      try {
        var isArrayA = Array.isArray(a)
        var isArrayB = Array.isArray(b)
        if (isArrayA && isArrayB) {
          return a.length === b.length && a.every(function(e, i) {
            return Util.looseEqual(e, b[i])
          })
        } else if (!isArrayA && !isArrayB) {
          var keysA = Object.keys(a)
          var keysB = Object.keys(b)
          return keysA.length === keysB.length && keysA.every(function(key) {
            return Util.looseEqual(a[key], b[key])
          })
        } else {
          /* istanbul ignore next */
          return false
        }
      } catch (e) {
        /* istanbul ignore next */
        return false
      }
    } else if (!isObjectA && !isObjectB) {
      return String(a) === String(b)
    } else {
      return false
    }
  },
  // 检测arr数组中是否包含与val变量相等的项
  looseIndexOf: function(arr, val) {
    for (var i = 0; i < arr.length; i++) {
      if (Util.looseEqual(arr[i], val)) { return i }
    }
    return -1
  },
  getDateDiff(start, end) {
    const minute = 60
    const hour = minute * 60
    const day = hour * 24
    // let halfamonth = day * 15;
    const month = day * 30

    const diffValue = end - start
    if (diffValue < 0) {
      return
    }

    const monthC = diffValue / month
    const weekC = diffValue / (7 * day)
    const dayC = diffValue / day
    const hourC = diffValue / hour
    const minC = diffValue / minute

    let result
    if (monthC >= 1) {
      result = '' + parseInt(monthC) + '月后'
    } else if (weekC >= 1) {
      result = '' + parseInt(weekC) + '周后'
    } else if (dayC >= 1) {
      result = '' + parseInt(dayC) + '天后'
    } else if (hourC >= 1) {
      result = '' + parseInt(hourC) + '小时后'
    } else if (minC >= 1) {
      result = '' + parseInt(minC) + '分钟后'
    } else {
      result = '1分钟后'
    }

    return result
  },
  // 字符长度
  getStrLen: function(str) {
    if (str === null) return 0
    if (typeof str !== 'string') {
      str += ''
    }
    return str.replace(/[^\x00-\xff]/g, '01').length
  },

  // 获取地址中的参数
  parseQueryString: function(url) {
    var str = url.split('?')[1] || ''
    var iterms = str.split('&')
    var arr; var Json = {}
    for (var i = 0; i < iterms.length; i++) {
      arr = iterms[i].split('=')
      if (arr[1]) {
        const num = arr[1].indexOf('#')
        if (num > 0) {
          arr[1] = arr[1].substring(0, num)
        }
      }

      Json[arr[0]] = arr[1]
    }
    return Json
  },
  /**
 * 遍历对象自身可枚举的属性
 * @param {Object} objItem 要遍历的对象
 * @param {Function} func 迭代是调用的函数，传入3个参数：(value, key, object)
 * @author RR
 */
  forOwn: function(objItem, func) {
    const obj = objItem || {}

    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (!Util.isEmpty(func) && typeof func === 'function') {
          func(obj[key], key, obj)
        }
      }
    }
  },
  // 判断是否是无效的空值
  // if(isEmpty(value)){...}
  isEmpty: function(value) {
    var comparable = [null, 'undefined', undefined, 'N/A', 'null']
    return !(comparable.indexOf(value) < 0)
  },
  // axios本版本不支持jsonp 自己拓展一个
  Jsonp: (url) => {
    if (!url) {
      console.error('JSONP 至少需要一个url参数!')
      return
    }

    return new Promise((resolve, reject) => {
      window.jsonCallBack = (result) => {
        resolve(result)
      }
      var JSONP = document.createElement('script')
      JSONP.type = 'text/javascript'
      JSONP.src = `${url}&callback=jsonCallBack`
      document.getElementsByTagName('head')[0].appendChild(JSONP)
      setTimeout(() => {
        document.getElementsByTagName('head')[0].removeChild(JSONP)
      }, 500)
    })
  },
  handlerAgentData(days, endTime, type) {
    // endTime 日期结束
    // type  "week"周  "month" 月
    if (!endTime) {
      endTime = new Date().getTime()
    }
    if (!endTime || !type) { return }
    var end_date = new Date(endTime).getTime()
    var interval = 24 * 60 * 60 * 1000
    var i = 0
    var arr = []
    if (type.trim() === 'week') {
      i = 7
    }
    if (type.trim() === 'month') {
      i = 30
    }
    if (days) {
      i = days
    }
    for (; i > 0; i--) {
      var obj = {}
      var date = new Date(end_date)
      var y = date.getFullYear()
      var m = date.getMonth() + 1
      m = m < 10 ? ('0' + m) : m
      var d = date.getDate()
      d = d < 10 ? ('0' + d) : d
      end_date -= interval
      var str = `${y}-${m}-${d}`

      obj.date = str
      obj.value = 0
      // obj.data = [0,0];
      arr.unshift(obj)
    }
    return arr
  },
  // 动态加载js
  LoadJs: (url, callback) => {
    var head = document.getElementsByTagName('head')[0]
    var script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = url
    if (typeof (callback) === 'function') {
      script.onload = script.onreadystatechange = function() {
        if (!this.readyState || this.readyState === 'loaded' || this.readyState === 'complete') {
          callback()
          script.onload = script.onreadystatechange = null
        }
      }
    }
    head.appendChild(script)
  },
  /**
   * 本地终端生成token
   * @return token
   */
  creatToken: function() {
    // 当前终端的标识
    let token = window.Store.GetGlobalData('token')
    if (!token) {
      token = 'T1' + Util.GetRandString(14)
      window.Store.SetGlobalData('token', token)
    }

    return token
  }
}

export default Util
