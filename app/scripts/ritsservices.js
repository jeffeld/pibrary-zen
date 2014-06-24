var ritsServices = angular.module ('RITS.services', []);

ritsServices.factory ('formService', function($rootScope) {

    return {

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