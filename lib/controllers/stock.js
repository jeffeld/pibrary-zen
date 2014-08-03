var config = require ('../config/config'),
    appevents = require ('../appevents'),
    _ = require('../../app/bower_components/underscore'),
    encrypt = require('./encryption')
;

exports.Render = function (req, res) {

    res.render ('stock');


}
