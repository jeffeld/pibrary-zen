var config = require ('../config/config'),
    mongojs = require('mongojs'),
    db = mongojs(config.database, ['members']),
    _ = require('../../app/bower_components/underscore'),
    util = require('./utility'),
    events = require('events')
;

exports.Get = function (spec, index, success, failure) {


    success ([]);


}
