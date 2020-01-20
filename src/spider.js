let core = require('./core')
let util = require('./util')
let db = require('./db')

let running = false
let spider = {}
module.exports = spider

let regex = /^((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9]):\d{4,5}$/
function validateIp(ipStr) {
  return regex.test(ipStr)
}

function validateIps(ipArr) {
  if (!Array.isArray(ipArr)) {
    return false
  }

  for (let ipStr of ipArr) {
    if (validateIp(ipStr) === false) {
      return false
    }
  }
  return true
}
function getOneProxyCb(err, response) {
  // response: 60.167.23.231:8118,0

  let member
  let score
  if (response.length === 2) {
    member = response[0]
    score = response[1]
    db.zadd([score, member], util.printDbCb)
  }
  for (let [addr, { enabled, fn }] of Object.entries(core.addrFnMap)) {
    if (enabled === true) {
      fn(addr, member, coreCb)
    }
  }
}

function getOneProxy() {
  db.zpopmax([], getOneProxyCb)
}

function prepareNext() {
  let arr = Object.entries(core.addrFnMap)
  let arrLen = arr.length
  let i
  for (i = 0; i < arrLen; i++) {
    if (arr[i][1].enabled === true) break
  }
  arr[i][1].enabled = false
  i++
  if (i === arrLen) {
    i = 0
  }
  arr[i][1].enabled = true
}

function constructArg(arr) {
  let args = []
  let now = 0
  for (let i = 0; i < arr.length; i++) {
    args.push(now)
    args.push(arr[i])
  }
  return args
}

function coreCb(error, result, addr) {
  prepareNext()

  if (error) {
    console.log('coreCb error, addr: ' + addr)
    return -1
  } else {
    if (result.length === 0) {
      console.log('coreCb result.length: 0, addr: ' + addr)
      return -1
    }
    if (!validateIps(result)) {
      console.log('coreCb validateIps length: 0, addr: ' + addr)
      return -1
    } else {
      db.zadd(constructArg(result), util.printDbCb)
      return 0
    }
  }
}

spider.up = function() {
  if (running == true) return
  running = true

  getOneProxy(getOneProxyCb)
  running = false
}
