var restler = require('restler'),
    config  = require('../config/config'),
    Q       = require('q'),
    fs      = require('fs'),
    tools   = require('../controllers/tools'),
    _       = require('../../app/bower_components/underscore'),
    AWS     = require('aws-sdk')
;


exports.Get = function (isbn) {

    var deferred           = Q.defer(),
        pathToImage        = [process.env.COVERS_PATH, isbn, '.jpg'].join(''),
        localPathToImage   = [config.root, '/app', pathToImage].join(''),
        openlibraryPath    = ['https://covers.openlibrary.org/b/isbn/', isbn, '-M.jpg', '?default=false'].join(''),
        localPathToNoCover = [process.env.COVERS_PATH, isbn].join(''),

        resolveNoCover     = () => {
            const i = _.random(0, 3);
            deferred.resolve("/images/No Image-227x327-" + i + ".gif");
        };


    restler.head(pathToImage)
        .on("200", function () {
            deferred.resolve(pathToImage)
        })
        .on("fail", function () {

            // check to see if openlib has a cover image

            console.log(`Cover for ${isbn} not found in cache. Checking Openlibrary...`);

            restler.get(openlibraryPath, {decoding: 'binary'})
                .on('success', function (data, response) {


                    console.log(`...found cover for ${isbn}. Uploading to S3...`);

                    AWS.config.update({
                        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                        secretAccessKey: process.env.AWS_SECRET_KEY,
                    });


                    const buffer = new Buffer(data, 'binary');

                    const s3 = new AWS.S3();
                    s3.putObject({
                        Bucket: process.env.S3_COVERS_BUCKET,
                        Key: isbn + '.jpg',
                        Body: buffer,
                        ACL: 'public-read'
                    }, function (resp) {

                        if (resp === null) {
                            console.log(`...uploaded cover for ${isbn} OK.`);
                            deferred.resolve(pathToImage);
                        } else {
                            console.log(`...uploading cover for ${isbn} FAILED. Using nocover.`);
                            resolveNoCover();
                        }
                    });


                })
                .on('fail', function (data, response) {

                    console.log ("Openlib doesn't have a cover. Using nocover.");

                    // We can find a cover online, so use one of our "No Image" cover variants
                    resolveNoCover();

                });


        });


    return deferred.promise;

};