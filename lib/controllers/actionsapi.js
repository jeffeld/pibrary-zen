var config = require ('../config/config'),
    appevents = require ('../appevents'),
    _ = require('../../app/bower_components/underscore'),
    orac = require ('../modules/orac'),
    utility = require ('../modules/utility')

    ;

exports.LendItem = function (req, res) {

    // Check we have all the required parameters

    if (utility.AnyUndefined([req.params.stockcode, req.params.membershipcode])) {
        res.send (400);
    }

    // Send the request on to Orac

    orac.LendItem (req.params.stockcode, req.params.membershipcode, function (result) {
        res.send (200);
    }, function (err) {
        res.send (500);
    });

};

exports.ReturnItem = function (req, res) {

    // Check we have all the required parameters

    if (utility.AnyUndefined([req.params.stockcode])) {
        res.send (400);
    }

    // Send the request on to Orac

    orac.ReturnItem(req.params.stockcode,
        function (result) {
            res.send(200);
        },
        function (error) {
            res.send(500);
        }
    );

};

exports.RenewItem = function (req, res) {

    // Check we have all the required parameters

    if (utility.AnyUndefined([req.params.stockcode])) {
        res.send (400);
    }

    // Send the request on to Orac

    orac.RenewItem (req.params.stockcode, function(result){
        res.send (200);
    }, function (error){
        res.send (500);
    });

};
