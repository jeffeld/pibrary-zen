var config = require ('../config/config'),
    mongojs = require('mongojs'),
    db = mongojs.connect(config.database, ['signups']),
    _ = require('../../app/bower_components/underscore'),
    util = require('./utility')
;

exports.Get = function (id, success, failure) {

    db.signups.findOne ({ _id: db.ObjectId(id)}, function (err, data) {
        util.onDBComplete (data, err, success, failure);
    });

};

exports.GetAll = function (success, failure) {

    db.signups.find ({}, function (err, data) {
        util.onDBComplete (data, err, success, failure);
    });

};

exports.Delete = function (id, success, failure) {

    db.signups.remove ({_id : db.ObjectId(id)}, true, function (err, data) {
        util.onDBComplete (data, err, success, failure);
    });

};

exports.Add = function (signup, success, failure) {

    db.signups.insert (signup, {safe:true}, function (err, data) {
        util.onDBComplete (data, err, success, failure);
    });

};