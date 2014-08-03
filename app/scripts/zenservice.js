
angular.module ('Zen.services', [])
    .factory ('Codes', function() {

        var isbnrx = /(?:97(?:8|9)\d{10})|(?:\d{9})(?:\d|x)/gi;

        return {

            isISBN: function (v) {
                var isbn = v.replace (/[\s\-]/g, '');
                return isbnrx.test(isbn);
            },

            isMembershipCode : function (v) {
                return v === '123456789';
            },

            isStockCode : function (v) {
                return v === 'STOCKCODE' || v === 'CODESTOCK';
            }


        }

})
    .factory ('Links', ['$window', function ($window) {

        return {
            make : function (path, id) {
                // return (path + '/' + id);
                return (path + "?sid=" + id);
            },

            go : function (path, message) {
                $window.location.href = path;
            },

            goHome : function () {
                $window.location.href = "/home";
            }
        }
}]);


