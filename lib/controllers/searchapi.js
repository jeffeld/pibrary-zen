var config = require ('../config/config'),
    appevents = require ('../appevents'),
    _ = require('../../app/bower_components/underscore'),
    orac = require ('../modules/orac')
;


exports.Get = function (req, res) {

    orac.search (req.query.q, function (data) {
        res.json (data);
    }, function () {
        res.send (500);
    });

};

exports.GetByISBN = function (req, res) {

    orac.GetByISBN (req.params.isbn, function (data) {
        res.send (200, data)
    }, function (data) {
        res.redirect ('500');
    });

};

exports.ExternalGetByISBN = function (req,res) {

    orac.ExternalGetByISBN(req.params.isbn, function (data) {

        _.isEmpty(data) ? res.send (404) : res.send(200, data);

    }, function (data) {
        res.redirect('500');
    });

};

exports.GetByStockCode = function (req, res) {
    orac.GetByStockCode (req.params.stockcode, function (data) {
        res.send(200, data)
    }, function (data) {
        res.redirect('500');
    });
}

