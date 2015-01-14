var restler = require('restler'),
    config = require('../config/config'),
    tools = require('../controllers/tools'),
    _ = require('../../app/bower_components/underscore'),
    Q = require('q')
    ;

function getOracCall(path, id, success, failure) {

    restler.get(config.orac.path + path + id)
        .on('success', function (data, response) {

        // We got data
        success(data);

    })
        .on('fail', function (data, response) {

        // We got a 404 (not found), so call the success
        // function with an empty object.

        success({});

    })
        .on('error', function (data, response) {

            // Something went wrong.

            failure(data, response)

        }
    );


}

function postOracCall(path, id, success, failure) {

    restler.post(config.orac.path + path + id)
        .on('success', function (data, response) {

            // We got data
            success(data);

        })
        .on('fail', function (data, response) {

            // We got a 404 (not found), so call the success
            // function with an empty object.

            success({});

        })
        .on('error', function (data, response) {

            // Something went wrong.

            failure(data, response)

        }
    );


}

function putOracCall(path, success, failure) {

    var url = '', options={};

    if (_.isObject(path)) {
        url = config.orac.path + path.path;
        options = path.options;
    } else {
        // Assume string
        url = config.orac.path + path;
    }

    restler.put(url, options)
        .on('success', function (data, response) {

            // We got data
            success(data);

        })
        .on('fail', function (data, response) {

            // We got a 404 (not found), so call the success
            // function with an empty object.

            success({});

        })
        .on('error', function (data, response) {

            // Something went wrong.

            failure(data, response)

        }
    );

}


exports.GetStockById = function (id, success, failure) {

    getOracCall('stock/', id, success, failure);

};

exports.GetByISBN = function (isbn, success, failure) {

    getOracCall('isbn/', isbn, function (data) {

        if (_.isEmpty (data)) {
            postOracCall('isbn/', isbn, success, failure);
        } else {
            success (data);
        }

    }, failure);

};

exports.PutISBN = function (isbn, data, success, failure) {

    var item = { data : {
        index_searched: 'manual',
        isbn : isbn,
        search_title: data.title,
        search_author: data.author,
        stock_codes: [],
        data: [data] }
    };

    item.data.data[0].isbn13 = isbn;
    item.data.data[0].isbn10 = '';// tools.ConvertISBN(isbn),

        putOracCall({
            path: 'isbn/' + isbn,
            options: item
        }, success, failure
    );

};

exports.ExternalGetByISBN = function (isbn, success, failure) {

    postOracCall('isbn/', isbn, success, failure);

};

exports.AddStockItem = function (stockCode, itemCode, success, failure) {
    putOracCall ('stock/' + stockCode + '/' + itemCode, success, failure);
};

exports.search = function (term, success, failure) {
    getOracCall ('search?q=' + term, '', success, failure);
};

exports.GetRecentlyAdded = function (success, failure) {
    getOracCall ('stats/recentlyadded' ,'', success, failure);
};

exports.GetByStockCode = function (stockCode, success, failure) {
    getOracCall ('stock/', stockCode, success, failure);
};

exports.LendItem = function (options, success, failure) {

    var request = {
        path: 'lend/' + options.stockCode + '/' + options.membershipCode,
        options: {
            data: {
                returnDate: options.returnDate.toString()
            }
        }
    };

    putOracCall (request, success, failure);

};

exports.ReturnItem = function (stockCode, success, failure) {
    putOracCall ('return/' + stockCode, success, failure);
};

exports.RenewItem = function (stockCode, membershipCode, success, failure) {
    putOracCall ('renew/' + stockCode, success, failure);
};

exports.GetStockCodes = function (quantity, spatial, success, failure) {
    var path = ['stock/codes/', quantity, '/', spatial, '?prefix=(&postfix=)'].join('');
    getOracCall (path, '', success, failure);
};


exports.GetByStockCode2 = function (stockCode) {

    var deferred = Q.defer();

    getOracCall ('stock/', stockCode, function (data) {
        deferred.resolve (data);
    }, function (error) {
        deferred.reject (error);
    });

    return deferred.promise;

};