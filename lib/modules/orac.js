var restler = require('restler'),
    config = require('../config/config'),
    _ = require('../../app/bower_components/underscore')
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

    restler.put(config.orac.path + path)
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

exports.ExternalGetByISBN = function (isbn, success, failure) {

    postOracCall('isbn/', isbn, success, failure);

};

exports.AddStockItem = function (stockCode, itemCode, success, failure) {

    putOracCall ('stock/' + stockCode + '/' + itemCode, success, failure);

};

exports.search = function (term, success, failure) {
    getOracCall ('search?q=' + term, '', success, failure);
};