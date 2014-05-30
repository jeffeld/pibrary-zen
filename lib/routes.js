'use strict';

var api = require('./controllers/api'),
    index = require('./controllers'),
    passport = require('passport'),
    labels = require('./controllers/labels'),
    _ = require('../app/bower_components/underscore');


/**
 * Application routes
 */
module.exports = function (app, config) {

    var commonSettings = {
            brand : config.brand || "The Library",
            isLoggedIn : false,
            isAdmin : false
        },
        userAppSettings = {
            isUserApp : true,
            angularAppName : "UserApp",
            scriptPath : "scripts/user-app.js",
            home : "/home",
            isAdminApp : false
        },
        adminAppSettings = {
            isUserApp : false,
            angularAppName : "AdminApp",
            scriptPath : "scripts/admin-app.js",
            home : "/admin",
            isAdminApp : true
        },
        s = {};

    userAppSettings = _.extend ({}, commonSettings, userAppSettings);
    adminAppSettings = _.extend ({}, commonSettings, adminAppSettings);


    app.get('/', function(req, res){
        res.render('landing2', _.extend({}, commonSettings, req));
    });

    app.get('/account', ensureAuthenticated, function(req, res){
        res.render('account', _.extend({}, commonSettings, req));
    });

//    app.get('/login', function(req, res){
//        res.render('login', { user: req.user, message: req.session.messages });
//    });

    var consumerPagesForGet = [
        {
            route : '/home',
            view : 'user-home'
        },
        {
            route : '/signup',
            view : 'signup'
        },
        {
            route : '/account',
            view : 'account'
        }

    ];

    _.each(consumerPagesForGet, function (v /*, k, l */) {
        console.log (v);
        app.get(v.route, function (req, res) {
            s = _.extend({}, userAppSettings, req);
            res.render(v.view, s);
        });
    });

//    app.get('/home/*', function(req, res){
//        // s = _.extend({}, userAppSettings, req);
//        res.render('user-home', userAppSettings);
//    });

    app.get('/admin', function(req, res){
        res.render('admin-home', _.extend ({}, adminAppSettings, req));
    });



    // POST /login
    //   This is an alternative implementation that uses a custom callback to
    //   acheive the same functionality.
    app.post('/login', function(req, res, next) {
        passport.authenticate('local', function(err, user, info) {
            if (err) { return next(err) }
            if (!user) {
                req.session.messages =  [info.message];
                return res.redirect('/login')
            }
            req.logIn(user, function(err) {
                if (err) { return next(err); }
                return res.redirect('/');
            });
        })(req, res, next);
    });

    app.get('/logout', function(req, res){
        req.logout();
        res.redirect('/');
    });

    app.get ('/dashboard/stock/labels/:count', labels.Generate);

    // All other routes to use Angular routing in app/scripts/app.js
    app.get('/partials/*', index.partials);
    app.get('/*', index.index);
};

// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/login')
}

function ensureAuthenticatedAndIsAdmin (req, res, next) {
    var isAdmin = true;
    if (req.isAuthenticated() && isAdmin) {
        return next();
    }

    res.redirect('/login');
}