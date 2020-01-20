let config = require('ya-config-loader').load('../config')

let spider = require('./spider')
let scour = require('./scour')
let db = require('./db')

let schedule = {}
module.exports = schedule

schedule.up = function() {
  showNum()
  spider.up()

  setInterval(spider.up, config.SPIDER_INTERVAL)
  setInterval(scour.up, config.SCOUR_INTERVAL)

  setInterval(showNum, 5000)
}

function showNum() {
  db.zcard([], function(err, response) {
    if (err) throw err
    console.log('Avaliable ip number: ' + response)
  })
}
