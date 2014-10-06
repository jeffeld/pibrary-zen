var orac  = require ('../modules/orac'),
    _ = require('../../app/bower_components/underscore'),

    randoms = [];
;

var generateRandoms = function () {

    for (var rn = 0; rn < 256; rn++) {
        randoms.push (rn);
    }

    randoms = _.shuffle (randoms);
};

var getNextRandom = function () {

    if (randoms.length === 0) {
        generateRandoms();
    }

    return randoms.pop();
};

exports.AddStockItem = function (req, res) {

    orac.AddStockItem (req.params.stockcode, req.params.itemcode, function () {
        res.send (200);
    }, function () {
        res.send (500);
    });

};

exports.GetStockCodes = function (req, res) {

    var spatial = getNextRandom();


    orac.GetStockCodes (req.params.quantity, spatial, function (data) {

        // Direct the browser to save the data to a file

        res.setHeader ('Content-Disposition', 'attachment; filename=stockcodes.csv');
        res.setHeader ('Content-Type', 'text/csv');

        // Convert the Javascript array to a series of CRLF terminated
        // strings. This can then be imported to Excel or another
        // program that will process CSV data.

        res.send (200, data.join('\r\n'));


    }, function () {
       res.send (500);
    });



}