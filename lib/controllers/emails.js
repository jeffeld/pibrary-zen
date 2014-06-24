var jade = require ('jade')
;

function path(f) {
    return './lib/resources/emails/' + f;
}

function send (emailLayout, data) {

    var options = {
            locals : data
        },
        body = jade.renderFile (path(emailLayout), data);


    console.log (body);

}

exports.NewSignUp = function (mi) {

    send ('signup-new.jade', mi);




};