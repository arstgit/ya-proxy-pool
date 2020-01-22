let request = require('request')
let config = require('ya-config-loader')

let core = {}

module.exports = core

core.addrFnMap = {
  'http://www.proxyserverlist24.top/': { enabled: true, fn: fn5 },
  'http://www.66ip.cn/mo.php?sxb=&tqsl={}&port=&export=&ktip=&sxa=&submit=%CC%E1++%C8%A1&textarea=': {
    enabled: false,
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

function fnHelper(addr, proxyAddr, process) {
  let options = {
    url: addr,
    method: 'GET',
    timeout: config.IP_TIMEOUT
  }
  if (proxyAddr) {
    options.proxy = 'http://' + proxyAddr
  }
  request(options, function(err, response, body) {
    process(err, body)
  })
}

function fn5(addr, proxyAddr, cb) {
  proxyAddr = null
  let result = []
  let tmpResult = []
  let regex = /<h3[\s\S]*?<a.*?(http.*?\.html).*?<\/a>/g
  let regex2 = /http.+html/
  let regex3 = /((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9]):\d{4,5}/g

  fnHelper(addr, proxyAddr, process)

  function process(err, body) {
    if (err) {
      cb(err)
      return
    }
    let found = body.match(regex)
    if (found !== null) {
      tmpResult = found.map(str => regex2.exec(str)[0])
    }
    let delay = 0
    for (let tmpAddr of tmpResult) {
      setTimeout(
        fnHelper.bind(null, tmpAddr, proxyAddr, process2),
        (delay += 2000)
      )
    }
  }

  function process2(err, body) {
    if (err) {
      cb(err)
      return
    }
    let found = body.match(regex3)
    if (found !== null) {
      result = found
    }

    cb(null, result, addr)
  }
}

function fn1(addr, proxyAddr, cb) {
  let result = []
  let regex = /((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])<[^\d]+>\d{4,5}/g

  fnHelper(addr, proxyAddr, process)

  function process(err, body) {
    if (err) {
      cb(err)
      return
    }
    let found = body.match(regex)
    if (found !== null) {
      result = found.map(str => str.replace(/<[^\d]+>/, ':'))
    }

    cb(null, result, addr)
  }
}

function fn4(addr, proxyAddr, cb) {
  let result = []
  let regex = /((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9]):\d{4,5}/g

  fnHelper(addr, proxyAddr, process)

  function process(err, body) {
    if (err) {
      cb(err)
      return
    }
    let found = body.match(regex)
    if (found !== null) {
      result = found
    }

    cb(null, result, addr)
  }
}
