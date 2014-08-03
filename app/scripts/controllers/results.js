
userApp.factory ('Search', ['$resource', function ($resource) {
    return $resource ('/api/search');
}]);


userControllers.controller('ResultsController', ['$scope', '$window', 'Search', 'Codes', 'Links',
    function ($scope, $window, Search, Codes, Links) {

        // $scope.Search = $location.search();
        $scope.Search = {
            q : ___q,
            idx : ___idx
        };


        if (Codes.isISBN($scope.Search.q)) {

            $window.location.href = Links.make('/isbn', $scope.Search.q);

        } else if (Codes.isStockCode($scope.Search.q)) {

            $window.location.href = Links.make('/stock', $scope.Search.q);

        } else if (Codes.isMembershipCode($scope.Search.q)) {

            $window.location.href= Links.make('/member', $scope.Search.q);

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
