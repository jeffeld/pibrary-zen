'use strict';

var api = require('./controllers/api'),
    index = require('./controllers'),
    passport = require('passport'),
    util = require ('./modules/utility'),
    labels = require('./controllers/labels'),
    signupsapi = require('./controllers/signupsapi'),
    membersapi = require('./controllers/membersapi'),
    emailsapi = require('./controllers/emails'),
    searchapi = require('./controllers/searchapi'),
    _ = require('../app/bower_components/underscore');



/**
 * Application routes
 */
module.exports = function (app, config) {


    // Check that any route with an :id parameter,
    // at the id is valid. This means we only have to do
    // this once here, and not loads of times in each
    // peace of db code.

    app.param ('id', function (req, res, next, id){

        var rxid = /\b[0-9A-F]{24}\b/gi;
        if (id.match(rxid)) {
            return next();
        }

        return res.send(400, "Juicy Fruit");

    });


    var commonSettings = {
            brand : config.brand || "The Library",
            isLoggedIn : false,
            isAdmin : true
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
            home : "/home",
            isAdminApp : true
        },
        s = {};

    userAppSettings = _.extend ({}, commonSettings, userAppSettings);
    adminAppSettings = _.extend ({}, commonSettings, adminAppSettings);


    app.get('/', function(req, res){
        res.render('landing2', _.extend({}, commonSettings, req));
    });

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
            route : '/login',
            view : 'login'
        },
        {
            route : '/search',
            view : 'results',
            config : function (req, res) {
                return {
                    q : req.query.q,
                    idx : req.query.idx
                }
            }
        },
        {
            route : '/isbn/:isbn',
            view : 'isbn'
        },
        {
            route : '/stock/:stockcode',
            view : 'stock'
        },
        {
            route : '/400',
            view : '400'
        },
        {
            route : '/404',
            view : '404'
        }
    ];

    _.each(consumerPagesForGet, function (v /*, k, l */) {

        app.get(v.route, function (req, res) {

            s = _.extend({}, userAppSettings, req);

            // The user may not be logged in, so we need to set
            // some default values (about the user) so the
            // templates can be rendered properly...

            if (_.isEmpty(req.user)) {
                s.userlevel = 0;
                s.firstname = '';
            } else {

                // otherwise, take the value from the user info
                // serialized in the request object.

                s.userlevel = req.user.userlevel;
                s.firstname = req.user.firstname;

            }

            // A route may have a configuration function
            // associated with it. It must return an object
            // with values to be passed to the template.

            if (_.isFunction(v.config)) {
                s = _.extend (s, v.config (req, res));
            }

            res.render(v.view, s);
        });
    });

    var consumerPagesForGetNeedingAuthentication = [
        {
            route: '/myaccount',
            view: 'account'
        }
    ];

    _.each(consumerPagesForGetNeedingAuthentication, function (v /*, k, l */) {

        app.get(v.route, ensureAuthenticated, function (req, res) {
            s = _.extend({}, userAppSettings, req);
            s.userlevel = req.user.userlevel;
            s.firstname = req.user.firstname;
            if (_.isFunction(v.config)) {
                s = _.extend (s, v.config (req, res));
            }
            res.render(v.view, s);
        });

    });


    var adminOnlyPages = [
        {
            route : '/adminsignups',
            view : 'admin-signups'
        },
        {
            route : '/adminemails',
            view : 'admin-emails'
        },
        {
            route : '/member/:memberid',
            view : 'member'
        }
    ];

    _.each(adminOnlyPages, function (v /*, k, l */) {
        app.get(v.route, ensureIsAdmin, function (req, res) {
            s = _.extend({}, userAppSettings, req);
            s.userlevel = req.user.userlevel;
            s.firstname = req.user.firstname;
            if (_.isFunction(v.config)) {
                s = _.extend (s, v.config (req, res));
            }
            res.render(v.view, s);
        });
    });


    // POST /login
    //   This is an alternative implementation that uses a custom callback to
    //   acheive the same functionality.
    app.post('/login', function (req, res, next) {
        passport.authenticate('local', function (err, user, info) {

            // Pass on any error to the next middleware

            if (err) {
                return next(err);
            }

            // We don't have a valid user, so show the login page again

            if (!user) {
                req.session.messages = [info.message];
                return res.redirect('/login');
            }

            // Log the user in...

            req.logIn(user, function (err) {
                if (err) {
                    return next(err);
                }

                membersapi.UpdateLastLoggedIn (user.email);

                userAppSettings.isLoggedIn = true;

                return res.redirect(user.homepage || '/home');
            });

        })(req, res, next);
    });

    app.get('/logout', function(req, res){
        userAppSettings.isLoggedIn = false;
        req.logout();
        res.redirect('/home');
    });

    app.get ('/dashboard/stock/labels/:count', labels.Generate);


    app.get ('/api/signups', signupsapi.GetAll);
    app.post ('/api/signups', signupsapi.Add);
    app.delete ('/api/signups/:id', signupsapi.Delete);
    app.post ('/api/signups/:id', signupsapi.Post);

    app.get ('/api/members', membersapi.GetAll);

    app.get ('/api/emails', emailsapi.GetAll);
    app.get ('/api/emails/:id', emailsapi.Get);
    app.post('/api/emails/:id', emailsapi.Post);
    app.delete ('/api/emails/:id', emailsapi.Delete);

    app.get ('/api/search', searchapi.Get)

    // All other routes to use Angular routing in app/scripts/app.js
    app.get('/partials/*', index.partials);
    app.get('/*', function (req, res) {
        res.render ('4042');
    });
};

// Simple route middleware to ensure user is authenticated.

function ensureAuthenticated(req, res, next) {

    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

// Simple route middleware to ensure the user is authenticated AND their
// user level is the minimum required to be an admin.
// There are different levels of users and admins:
//    0 - Regular user
//  100 - Librarian
//  200 - Head Librarian
// 1000 - Sysadmin

function ensureIsAdmin (req, res, next) {

    if (req.isAuthenticated() && req.user.userlevel >= 100) {
        return next();
    }

    res.redirect('/');
}
