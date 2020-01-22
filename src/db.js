let util = require('util')
let redis = require('redis')
let config = require('ya-config-loader')

let prefix = config.NAME + ':' + 'ip'

let client = redis.createClient(config.REDIS)
client.on('error', function(err) {
  console.log('node_redis Error ' + err)
})
client.on('ready', function(err) {
  console.log('redis is ready!')
})
client.on('connect', function(err) {
  console.log('redis is connected!')
})

let db = {}
module.exports = db

// args: [29839829832, "2.2.2.2:4444", 3283923298, "3.3.3.3:5555"]
db.zadd = function(args, cb) {
  args.unshift(prefix)

  client.zadd(args, function(err, response) {
    if (err) throw err
    cb(err, response)
  })
}

db.zpopmin = function(args, cb) {
  args.unshift(prefix)
  client.zpopmin(args, function(err, response) {
    if (err) throw err
    cb(err, response)
  })
}

db.zpopmax = function(args, cb) {
  args.unshift(prefix)
  client.zpopmax(args, function(err, response) {
    if (err) throw err
    cb(err, response)
  })
}

db.zrem = function(args, cb) {
  args.unshift(prefix)
  client.zrem(args, function(err, response) {
    if (err) throw err
    cb(err, response)
  })
}

db.zcard = function(args, cb) {
  args.unshift(prefix)
  client.zcard(args, function(err, response) {
    if (err) throw err
    cb(err, response)
  })
}

for (let key of Object.keys(db)) {
  db[key + 'Async'] = util.promisify(db[key]).bind(client)
}
