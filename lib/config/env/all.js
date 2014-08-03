'use strict';

var path = require('path');

var rootPath = path.normalize(__dirname + '/../../..');

module.exports = {
  root: rootPath,
  port: process.env.PORT || 3000,

  orac : {
      path : 'http://localhost:9000/api/v1/'
  }


};