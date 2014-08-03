'user strict';

var _ = require ('../../app/bower_components/underscore');


var permissions  = {

    addStock : {
        minLevel : 100
    }

}

exports.HasPermission = function (user, permission) {

    if (_.isUndefined(user)) {
        user = {
            level : 0
        }
    }


    if (!_.isObject(user) || ! _.isString (permission) || ! permissions.hasOwnProperty(permission)) {
        console.error ("Bad user object or permission, defaulting to false\n");
        console.error (user);
        console.error (permission);
        return false;
    }

    return user.level >= permissions.minLevel;

};