var orac  = require ('../modules/orac')
;

exports.AddStockItem = function (req, res) {

    orac.AddStockItem (req.params.stockcode, req.params.itemcode, function () {
        res.send (200);
    }, function () {
        res.send (500);
    });

};

