'use strict';

var _ = require('lodash');

module.exports = _.extend(
    require('./env/all.js'),
    require('./env/local.js') || {});