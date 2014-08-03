var orac  = require ('../modules/orac')
;

exports.AddStockItem = function (req, res) {

    orac.AddStockItem (req.params.stockCode, req.params.itemCode, function () {
        res.send (200);
    }, function () {
        res.send (500);
    });

};

