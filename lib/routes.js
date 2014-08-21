'use strict';

var api = require('./controllers/api'),
    index = require('./controllers'),
    passport = require('passport'),
    _ = require('../app/bower_components/underscore'),
    util = require ('./modules/utility'),
    user= require('./modules/user'),
    labels = require('./controllers/labels'),
    signupsapi = require('./controllers/signupsapi'),
    membersapi = require('./controllers/membersapi'),
    emailsapi = require('./controllers/emails'),
    searchapi = require('./controllers/searchapi'),
    stockapi = require('./controllers/stockapi'),
    stock = require('./controllers/stock'),
    orac = require('./modules/orac')
;



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

    // Validate that stockcode parameters are valid

    app.param ('stockcode', function (req, res, next, stockcode){

        var rxid = /\b[0-9]{4}\b/gi
        if (stockcode.match(rxid)) {
            return next();
        }

        return res.send (400, "Marathon");

    });
//
//    // Validate the membershipcode parameters are valid
//
//    app.param ('membershipcode', function (req, res, next, membershipcode){
//
//        // TODO: Complete this!
//
//        return next();
//
//    });


    var userAppSettings = {
            brand : config.brand || "The Library",
            isUserApp : true,
            angularAppName : "UserApp",
            scriptPath : "scripts/user-app.js",
            home : "/home",
            isAdminApp : false
        },

        prepareRoutes = function (routes, middleware) {

            // If we're not given any middleware function, then
            // just supply an empty one.

            if (_.isUndefined(middleware) || ! _.isFunction(middleware)) {
                middleware = function (req, res, next) {
                    return next();
                }
            }

            _.each (routes, function (r) {

                app.get(r.route, middleware, function (req, res) {

                    var s = _.extend({}, userAppSettings);

                    if (_.isEmpty(req.user)) {

                        // The user may not be logged in, so we need to set
                        // some default values (about the user) so the
                        // templates can be rendered properly...

                        s.userlevel = 0;
                        s.firstname = '';

                    } else {

                        // ...otherwise, take the value from the user info
                        // serialized in the request object.

                        s.userlevel = req.user.userlevel;
                        s.firstname = req.user.firstname;

                    }

                    // A route may have a configuration function
                    // associated with it. It must return an object
                    // with values to be passed to the template.

                    if (_.isFunction(r.config)) {
                        s = _.extend (s, r.config (req, res));
                    }

                    // If a handler is specified call it, otherwise
                    // just render the page out

                    if (_.isFunction(r.handler)) {
                        r.handler (req, res, s);
                    } else {
                        res.render(r.view, s);
                    }

                });

            });

        }
    ;

    app.get('/', function(req, res){
        res.render('landing2', _.extend({}, userAppSettings, req));
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
            route : '/isbn',
            view : 'isbn',
            config : function (req, res) {
                return {
                    isbn : req.query.sid
                }
            },

            handler : function (req, res, s) {
                orac.GetByISBN (s.isbn, function (data) {

                    // Success

                    s.found = !_.isEmpty (data);

                    if (s.found) {

                        var view = user.HasPermission(req.user, 'addStock') ? 'isbn-add' : 'isbn',
                            i = data.data[0],
                            j = data;

                        s.isbndetails = {
                            title : j.search_title || 'Unknown',
                            author : j.search_author || '',
                            publisher : (i.publisher_name || i.publisher_text) || 'Unknown Publisher',
                            edition :  i.edition_info || '',
                            physical : i.physical_description_text || '',
                            // summary : (i.summary || i.notes) || '',
                            isbn10: i.isbn10 || 'n/a',
                            isbn13: i.isbn13 || 'n/a'
                        };




                        res.render (view, s);
                    } else {
                        res.redirect('404');
                    }



                }, function (error) {

                    // Failure

                    res.redirect ('500');

                });
            }

        },
        {
            route : '/stock',
            view : 'stock',
            config : function (req, res) {
                return {
                    stockid : req.query.sid
                }
            },

            handler : function (req, res, s) {

                orac.GetStockById (s.stockid, function (data) {

                    // Success

                    s.found = ! _.isEmpty(data);

                    if (!s.found && s.userlevel < 100) {

                        // If the user isn't an admin, then throw up
                        // the generic not found page.

                        res.redirect ('/404');

                    } else {

                        // The user is an admin, so they have the option
                        // of adding in the details by hand.

                        var view = s.found ? 'stock' : 'stock-add';
                        res.render (view, s);
                    }


                }, function (error) {

                    // Failure
                    res.redirect ('500');
                });



            }

        },
        {
          route : '/500',
            view: '500'
        },
        {
            route : '/404',
            view : '404'
        }
    ],
    consumerPagesForGetNeedingAuthentication = [
        {
            route: '/myaccount',
            view: 'account'
        }
    ],
    adminOnlyPages = [
        {
            route : '/adminsignups',
            view : 'admin-signups'
        },
        {
            route : '/adminemails',
            view : 'admin-emails'
        },
        {
            route : '/member',
            view : 'member',
            config : function (req, res) {
                return {
                    memberid : req.query.sid
                }
            }
        }
    ];

    prepareRoutes (consumerPagesForGet);
    prepareRoutes (consumerPagesForGetNeedingAuthentication, ensureAuthenticated);
    prepareRoutes (adminOnlyPages, ensureIsAdmin);

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

    app.get ('/api/search', searchapi.Get);
    app.get ('/api/search/isbn/:isbn', searchapi.GetByISBN);
    app.post ('/api/search/isbn/:isbn', searchapi.ExternalGetByISBN);

    app.put ('/api/stock/:stockcode/:ibsn', stockapi.AddStockItem);

    // All other routes to use Angular routing in app/scripts/app.js
    app.get('/partials/*', index.partials);
    // app.get('/*', index.index);
    app.get('/*', function (req, res) {
        // res.render ('404', userAppSettings);
        res.redirect ('404');
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
