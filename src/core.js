let request = require('request')

let core = {}

module.exports = core

core.addrFnMap = {
  'http://www.66ip.cn/mo.php?sxb=&tqsl={}&port=&export=&ktip=&sxa=&submit=%CC%E1++%C8%A1&textarea=': {
    enabled: true,
    fn: fn4
  },
  'http://www.66ip.cn/nmtq.php?getnum={}&isp=0&anonymoustype=0&s""tart=&ports=&export=&ipaddress=&area=0&proxytype=2&api=66ip': {
    enabled: false,
    fn: fn4
  },
  'http://www.xicidaili.com/nn/': { enabled: false, fn: fn1 },
  'http://www.xicidaili.com/nt/': { enabled: false, fn: fn1 },
  // "http://www.goubanjia.com/": { enabled: false, fn: fn3 },
  'https://www.kuaidaili.com/free/inha/': { enabled: false, fn: fn1 },
  'https://www.kuaidaili.com/free/intr/': { enabled: false, fn: fn1 },
  'http://www.ip3366.net/free/?stype=1': { enabled: false, fn: fn1 },
  'http://www.ip3366.net/free/?stype=2': { enabled: false, fn: fn1 },
  'http://www.iphai.com/free/ng': { enabled: false, fn: fn1 },
  'http://www.iphai.com/free/np': { enabled: false, fn: fn1 },
  'http://www.iphai.com/free/wg': { enabled: false, fn: fn1 },
  'https://www.freeip.top/?page=1': { enabled: false, fn: fn1 },
  'https://www.qydaili.com/free/?action=china&page=1': {
    enabled: false,
    fn: fn1
  }
  // "http://www.89ip.cn/index_2.html": { enabled: true, fn: fn1 }
}

function fnHelper(addr, process) {
  request(addr, function(error, response, body) {
    if (error) {
      console.error('error:', error)
      cb(error, null)
    } else {
      process(body)
    }
  })
}

function fn1(addr, cb) {
  let result = []
  let regex = /((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])<[^\d]+>\d{4,5}/g

  fnHelper(addr, process)

  function process(body) {
    let found = body.match(regex)
    if (found !== null) {
      result = found.map(str => str.replace(/<[^\d]+>/, ':'))
    }

    cb(null, result)
  }
}

// to do
function fn3(addr, cb) {
  let result = []
  //let regex = /((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9]):\d{4,5}/g
  // (?:(<.*?>))?
  //let regex = /((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])\.){3}/g
  let regex = /((2(?:(<.*?>))?5(?:(<.*?>))?[0-5](?:(<.*?>))?|2(?:(<.*?>))?[0-4](?:(<.*?>))?[0-9](?:(<.*?>))?|1((?:(<.*?>))?[0-9](?:(<.*?>))?){2}|([1-9](?:(<.*?>))?)?[0-9])\.){3}/g

  fnHelper(addr, process)

  function process(body) {
    let found = body.match(regex)
    if (found !== null) {
      result = found
    }

    cb(null, result)
  }
}

function fn4(addr, cb) {
  let result = []
  let regex = /((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9]):\d{4,5}/g

  fnHelper(addr, process)

  function process(body) {
    let found = body.match(regex)
    if (found !== null) {
      result = found
    }

    cb(null, result)
  }
}