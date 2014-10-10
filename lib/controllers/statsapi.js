var config = require ('../config/config'),
    appevents = require ('../appevents'),
    _ = require('../../app/bower_components/underscore'),
    orac = require ('../modules/orac')
    ;


exports.GetRecentlyAdded = function (req, res) {

    orac.GetRecentlyAdded (function (data) {res.send(200,data);}, function () {});

};

exports.GetFeatured = function (req, res) {
    res.send (200, []);
};

exports.Feature = function (req, res) {

    res.send (200);
};

