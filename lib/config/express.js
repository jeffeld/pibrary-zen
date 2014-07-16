'use strict';

var express = require('express'),
    path = require('path'),
    config = require('./config'),
    passport = require('passport'),
    util = require('../modules/utility');

/**
 * Express configuration
 */
module.exports = function (app) {
    app.configure('development', function () {
        app.use(require('connect-livereload')());

        // Disable caching of scripts for easier testing
        app.use(function noCache(req, res, next) {
            if (req.url.indexOf('/scripts/') === 0) {
                res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
                res.header('Pragma', 'no-cache');
                res.header('Expires', 0);
            }
            next();
        });

        // app.set ('view options', {pretty: true});

        app.use(express.static(path.join(config.root, '.tmp')));
        app.use(express.static(path.join(config.root, 'app')));
        app.use(express.errorHandler());
        app.locals.pretty = true;
        app.set('views', config.root + '/app/views');
    });

    app.configure('production', function () {
        app.use(express.favicon(path.join(config.root, 'public', 'favicon.ico')));
        app.use(express.static(path.join(config.root, 'public')));
        app.set('views', config.root + '/views');
    });

    app.configure(function () {
        app.set('view engine', 'jade');
        app.use(express.logger('dev'));
        app.use(express.json());
        app.use(express.urlencoded());
        app.use(express.methodOverride());
        app.use(express.cookieParser());
        app.use(express.bodyParser());
        app.use(express.methodOverride());
        app.use(express.session ({secret: 'keyboard cat'}));
        app.use(express.static(__dirname + '/images'));

        // Initialize Passport!  Also use passport.session() middleware, to support
        // persistent login sessions (recommended).

        app.use(passport.initialize());
        app.use(passport.session());

        // Router needs to be last
        app.use(app.router);
    });
};