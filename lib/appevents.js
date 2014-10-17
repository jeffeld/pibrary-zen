var EventEmitter = require('events').EventEmitter,
    _ = require('../app/bower_components/underscore'),
    email = require('./controllers/emails')
;

module.exports = new EventEmitter();


console.log("==> INITIALIZING EVENTS");

// Naming convention for events...
// Module-Action e.g. Member-Add, Stock-Loan etc.

var eventsToObservers = [
    {
        event : 'SignUp-New',
        observers : [email.SignUp_New]
    },
    {
        event : 'SignUp-Approved',
        observers : [email.SignUp_Approved]
    },
    {
        event : 'SignUp-Rejected',
        observers : [email.SignUp_Rejected]
    },
    {
        event : 'Password-Reset-Request',
        observers : [email.Password_Reset_Request]
    }
];


// Wire up the events with their handlers

_.each(eventsToObservers, function (event) {
    _.each(event.observers, function (observer) {
        module.exports.on(event.event, observer);
    });
});


