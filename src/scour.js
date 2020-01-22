let { promisify } = require('util')
let request = require('request')
let config = require('ya-config-loader')
let db = require('./db')
let util = require('./util')

let running = false
let headers = {
  'User-Agent':
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.98 Safari/537.36'
}

let scour = {}
module.exports = scour

scour.up = async function() {
  if (running === true) return
  running = true

  let response
  for (let i = 0; i < config.SCOUR_BATCH; i++) {
    response = await db.zpopminAsync([])

    if (response.length === 0) {
      console.log('db ip empty!')
      break
    }

    // response: 60.167.23.231:8118,0
    let member = response[0]
    let score = response[1]
    if (Date.now() - parseInt(score) < config.IP_IDLE_INTERVAL) {
      await db.zaddAsync([score, member])
      break
    }

    test(member, testCb)
  }

  running = false
}

async function test(member, testCb) {
  let res = request(
    {
      url: config.TEST_TARGET,
      proxy: 'http://' + member,
      method: 'GET',
      timeout: config.IP_TIMEOUT,
      headers
    },
    function aa(err, response, body) {
      if (!err && response.statusCode == 200) {
        // passed
        testCb(err, member, true)
      } else {
        // failed
        testCb(err, member, false)
      }
    }
  )
}

function testCb(err, member, passed) {
  if (passed === true) {
    let args = [Date.now(), member]
    db.zadd(args, util.printDbCb)
  }
}
