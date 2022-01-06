'use strict'
const merge = require('webpack-merge');
const prodEnv = require('./prod.env');

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  BASE_URL: '"https://ec2-52-81-194-241.cn-north-1.compute.amazonaws.com.cn:8080/evir"'
})
