
var _ = require('lodash');

exports.config = _.extend (
  require ('./all.config.js'),
  require ('./local.config.js')
);


