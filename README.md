# ya-proxy-pool

[![Build Status](https://travis-ci.org/derekchuank/ya-proxy-pool.svg?branch=master)](https://travis-ci.org/derekchuank/ya-proxy-pool)
[![npm version](https://badge.fury.io/js/ya-proxy-pool.svg)](http://badge.fury.io/js/ya-proxy-pool)

## Prerequisites

  redis or docker and docker-compose, surely we prefer docker and docker-compose.

```
  apt-get install redis
```

or

```
  apt install docker.io docker-compose
```

## Configfile
  The config file is located in `config/default.json`, you can create another file to rewrite the default config, Seeing `ya-config-loader(https://github.com/derekchuank/ya-config-loader)`.
  - `NAME`. Whatever you like.
  - `REDIS`. Redis config, passed to redis driver package. 
  - `TEST_TARGET`. The URL used to test a proxy usable or not.
  - `SCOUR_INTERVAL`. milliseconds. The testing proxies action time interval.
  - `SCOUR_BATCH`. seconds. Number of proxies of a testing proxies acion.
  - `SPIDER_INTERVAL`. milliseconds. The time interval between crawling acions.
  - `IP_IDLE_INTERVAL`. milliseconds. A proxy can idle some time before tested again.
  - `IP_TIMEOUT`. milliseconds. Http request timeout.

## Usage
  if you have docker and docker-compose installed.
```
  npm run up
```

  or, start a redis-server first, and config your redis related configration, then:
```
  npm start
```

## Data storage
  With docker and docker-compose, your data is writen in directoy `data`. All ips and ports information are stored in a `sorted set` with a key named `${config.NAME}:ip`. In the sorted set, the score means last tested time.

## About proxy resource
  All proxy resource addresses and related retriving methods are written in `src/core.js`. Feel free to modify the file.
