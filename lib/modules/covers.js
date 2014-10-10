var restler = require('restler'),
    config = require('../config/config'),
    Q = require('q'),
    fs = require('fs'),
    tools = require('../controllers/tools'),
    _ = require('../../app/bower_components/underscore')
;



exports.Get = function (isbn) {

    var deferred = Q.defer(),
        pathToImage = ['/cover/', isbn, '.jpg'].join(''),
        localPathToImage = [config.root, '/app', pathToImage].join(''),
        openlibraryPath = ['https://covers.openlibrary.org/b/isbn/', isbn, '-M.jpg', '?default=false'].join(''),
        localPathToNoCover = [config.root, '/app/cover/nocover/', isbn].join('');

    fs.exists(localPathToImage, function (exists) {

        if (exists) {
            deferred.resolve (pathToImage);
        } else {

            fs.exists (localPathToNoCover, function (x){

                if (x) {
                    deferred.reject();
                } else {
                    restler.get(openlibraryPath, {decoding: 'binary'})
                        .on('success', function (data, response) {

                            // We got data

                            var buffer = new Buffer(data, 'binary');
                            fs.writeFile (localPathToImage, buffer, function (err) {

                                if (err) {
                                    deferred.reject ();
                                } else {
                                    deferred.resolve (pathToImage);
                                }

                            });

                        })
                        .on('fail', function (data, response) {

                            // We got a 404 (not found). There's no cover image available

                            fs.writeFile (localPathToNoCover, '');
                            deferred.reject ();

                        })
                        .on('error', function (data, response) {

                            // Something went wrong.

                            deferred.reject ();

                        }
                    );

                }


            });



        }

//        exists ? deferred.resolve (pathToImage) : deferred.reject ();

    });

    return deferred.promise;

};