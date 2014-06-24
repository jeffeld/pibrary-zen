var events = require('events'),
    email = require('./modules/emails')
;


module.exports = function (config) {

    console.log("==> INITIALIZING EVENTS");

    // Naming convention for events...
    // Module-Action e.g. Member-Add, Stock-Loan etc.

    var eventsToObservers = [
        {
            event : 'Member-Add',
            observers : [email.MemberAddEmail]
        }
//        {
//            event : '',
//            observers : []
//        }
    ];


    _.each (eventsToObservers, function (v){

    });

};
