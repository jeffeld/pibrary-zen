
angular.module ('Zen.services', [])
    .factory ('Codes', function() {

        return {

            isISBN: function (v) {
                return false;
            },

            isMembershipCode : function (v) {
                return false;
            },

            isStockCode : function (v) {
                return false;
            }


        }

});


