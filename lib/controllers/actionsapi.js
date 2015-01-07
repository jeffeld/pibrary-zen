var config = require ('../config/config'),
    appevents = require ('../appevents'),
    _ = require('../../app/bower_components/underscore'),
    orac = require ('../modules/orac'),
    utility = require ('../modules/utility'),
    covers = require ('../modules/covers'),
    overdues = require ('../modules/overdues')

;

exports.LendItem = function (req, res) {

    var now = new Date(),
        issues = [];

    // The account must be active

    if (req.zen.member.status !== 'active') {
        issues.push ('status');
    }

    // There must be no overdue loans

    if (!_.isUndefined(_.find(req.zen.member.currentLoans, function (loan) {
        return loan.returnDate < now;
    }))) {
        issues.push ('overdues');
    }

    if (req.zen.member.loanType !== 'bulk') {

        if (req.zen.member.currentLoans >= req.zen.member.maxLoans) {
            issues.push ('maxLoans');
        }
    }

    if (issues.length !== 0) {
        res.send (403, issues);
        return;
    }

    // Send the request on to Orac

    var options = {
        stockCode: req.params.stockcode,
        membershipCode: req.params.membershipcode,
        memberName: [req.zen.member.firstname, req.zen.member.firstname].join(' '),
        returnDate: utility.Calendar.TodaysReturnDate(req.params.membershipcode)
    };

    orac.LendItem (options, function (result) {
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

exports.GetReturnDate = function (req, res) {

    var returnDate = utility.Calendar.ReturnDate(21);
    res.json (returnDate);

};

var noCoverIndex = 0;

exports.GetCover = function (req, res) {

    var isbn = req.params.isbn, noImage;

    covers.Get(isbn).then(function (data) {

        res.redirect (data)

    }, function (error) {

        noImage = ['/images/No Image-227x327-', noCoverIndex, '.gif'].join('');
        noCoverIndex++;
        noCoverIndex = noCoverIndex % 4;

        res.redirect (noImage);
    });



};

exports.GetOverdueCount = function (req, res) {
    overdues.GetOverdueCount().then(function (data) {
        res.send (200, {count :data});
    }, function (error) {
        res.send (500);
    });
};

exports.GetOverdues = function (req, res) {

    overdues.GetOverdues().then(function (data) {
        res.send (200, data);
    }, function (error) {
        res.send (500);
    });


}