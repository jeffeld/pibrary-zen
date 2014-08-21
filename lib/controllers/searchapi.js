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

    // res.json(results);
};
//exports.Get = function (req, res) {
//
//    // TODO: Sweary filter
//
//    var results = [],
//        max = _.random(8,13);
//
//    for (var i = 1; i < max; i++) {
//        results.push ({
//           title : req.query.q + ' ' + i,
//           author : 'A.N.Other',
//           type : 'book',
//           isbn : '9780000000001',
//           stock_codes : [
//               'abcdef0123456',
//               'abcdef0123456',
//               'abcdef0123456'
//           ]
//
//        });
//    }
//
//    res.json(results);
//};

exports.GetByISBN = function (req, res) {

    orac.GetByISBN (req.params.isbn, function (data) {
        res.send (200, data)
    }, function (data) {
        res.redirect ('500');
    });

};

exports.ExternalGetByISBN = function (req,res) {

    orac.ExternalGetByISBN(req.params.isbn, function (data) {
        res.send(200, data)
    }, function (data) {
        res.redirect('500');
    });

}