'use strict';

var express = require('express'),
    path = require('path'),
    fs = require('fs'),
    config = require('./config'),
    passport = require('passport'),
    util = require('../modules/utility'),
    N = 16,
    secret = new Array(N+1).join((Math.random().toString(36)+'00000000000000000').slice(2, 18)).slice(0, N)
    ;


function getLandingImages () {


    var filesDir = path.join(config.root,'/app/images/landingpage'),
        files = fs.readdirSync (filesDir);

        config.landingPageImages = files;

}



/**
 * Express configuration
 */
module.exports = function (app) {
    app.configure('development', function () {
//        app.use(require('connect-livereload')());

        // Disable caching of scripts for easier testing
        app.use(function noCache(req, res, next) {
            if (req.url.indexOf('/scripts/') === 0 || req.url.indexOf('/styles/') === 0) {
                res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
                res.header('Pragma', 'no-cache');
                res.header('Expires', 0);
            }
            next();
        });

        // app.set ('view options', {pretty: true});

        app.use(express.static(path.join(config.root, '.tmp')));
        app.use(express.static(path.join(config.root, 'app')));
        app.use(express.static(path.join(config.root, 'stock')));
        app.use(express.errorHandler());
        app.locals.pretty = true;
        // app.locals.debug = true;
        app.set('views', config.root + '/app/views');

        app.disable('etag');
    });

    app.configure('production', function () {
        app.use(express.favicon(path.join(config.root, 'public', 'favicon.ico')));
        app.use(express.static(path.join(config.root, 'public')));
        app.use(express.static(path.join(config.root, 'app')));
        app.set('views', config.root + '/app/views');
    });

    app.configure(function () {
        app.set('view engine', 'jade');

        app.use (function (req, res, next) {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
            res.header('Access-Control-Allow-Headers', 'Content-Type');
            next();
        });


        app.use(function (req, res, next) {
            req.zen = {};
            next();
        });

        app.use(express.logger('dev'));
        app.use(express.json());
        app.use(express.urlencoded());
        app.use(express.methodOverride());
        app.use(express.cookieParser());
        app.use(express.bodyParser());
        app.use(express.methodOverride());
        app.use(express.session ({secret: secret}));
        app.use(express.static(__dirname + '/images'));
        app.use(express.static(__dirname + '/cover'));
        app.use('/bower_components',  express.static(__dirname + '/bower_components'));

        // Initialize Passport!  Also use passport.session() middleware, to support
        // persistent login sessions (recommended).

        app.use(passport.initialize());
        app.use(passport.session());

        getLandingImages();

        // Router needs to be last
        app.use(app.router);
    });
};