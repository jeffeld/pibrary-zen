var config = require ('../config/config'),
    appevents = require ('../appevents'),
    _ = require('../../app/bower_components/underscore')
;


exports.Get = function (req, res) {

    // TODO: Sweary filter

    var results = [],
        max = _.random(8,13);

    for (var i = 1; i < max; i++) {
        results.push ({
           title : req.query.q + ' ' + i,
           author : 'A.N.Other',
           type : 'book',
           isbn : '9780000000001',
           stock_codes : [
               'abcdef0123456',
               'abcdef0123456',
               'abcdef0123456'
           ]

        });
    }

    res.json(results);


//    res.json ([
//            { title : "Book Title 01" },
//            { title : "Book Title 02" },
//            { title : "Book Title 03" },
//            { title : "Book Title 04" },
//            { title : "Book Title 05" },
//            { title : "Book Title 06" },
//            { title : "Book Title 07" },
//            { title : "Book Title 08" },
//            { title : "Book Title 09" },
//            { title : "Book Title 10" },
//            { title : "Book Title 11" },
//            { title : "Book Title 12" },
//            { title : "Book Title 13" }
//        ]
//
//    );


//    searchdb.Get (req.query.term, req.query.idx, function (results) {
//    });




}