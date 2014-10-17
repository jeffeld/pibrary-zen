var ritsServices = angular.module ('RITS.services', []);

ritsServices.factory ('formService', function($rootScope) {

    return {

        isValidPassword : function (p) {

            if (!angular.isString(p)) {
                return false;
            }

            if (p.length < 8 && p.length > 20) {
                return false;
            }

            if (p.search(/\d/) === -1) {
                return false;
            }

            if (p.search(/[a-zA-z]/) === -1) {
                return false;
            }

            if (p.search(/[a-zA-z0-9\!\@\#\$\%\^\&\*\(\)\_\+]/) === -1) {
                return false;
            }

            return true;
        },

        hasNonZeroLength : function (o) {

            if (angular.isString(o)) {
                return o.length > 0;
            }

            if (! angular.isArray(o)) {
                return false;
            }


            for (var i = 0; i < o.length; i++) {
                if (! angular.isString(o[i])) {
                    continue;
                }

                if (o[i].length === 0) {
                    return false;
                }
            }

            return true;


        }

    }

});
