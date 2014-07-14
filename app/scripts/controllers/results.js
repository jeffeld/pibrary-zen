
userApp.factory ('Search', ['$resource', function ($resource) {
    return $resource ('/api/search');
}]);


userControllers.controller('ResultsController', ['$scope', '$location', 'Search', 'Codes',
    function ($scope, $location, Search, Codes) {

        // $scope.Search = $location.search();
        $scope.Search = {
            q : ___q,
            idx : ___idx
        };


        if (Codes.isISBN(Search.q)) {

            $window.location.href = '/isbn/' + Search.q;

        } else if (Codes.isStockCode(Search.q)) {

            $window.location.href = '/stock/' + Search.q;

        } else if (Codes.isMembershipCode(Search.q)) {

            $window.location.href= '/member/' + Search.q;

        } else {

            $scope.Results = Search.query({
                q: $scope.Search.q,
                idx: $scope.Search.idx
            }, function (data) {
                // $scope.Results = data.data;
            });

        }

    }
]);
