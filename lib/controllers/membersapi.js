var config = require ('../config/config'),
    _ = require('../../app/bower_components/underscore'),
    membersdb = require('../modules/membersdb')
;

exports.GetAll = function (req, res) {

    membersdb.Get ({}, function (data) {
       res.send (200, data);
    }, function () {
        res.send (500);
    });



}