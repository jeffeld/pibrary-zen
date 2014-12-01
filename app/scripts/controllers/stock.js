userControllers.controller('StockController', ['$scope', '$sce', 'Codes', 'Search', 'Links',
    function ($scope, $sce, Codes, Search, Links) {


        $scope.StockCode = ___stockCode;
        $scope.Details = {};

        Search.stock ({item: $scope.StockCode})
            .$promise.then(function(result){
                $scope.Details = result;

                Search.isbn ({item: $scope.Details.itemCode})
                    .$promise.then(function(isbnData) {
                        $scope.Details = _.extend ($scope.Details, isbnData.book || {});
                    });


            }, function () {
                Links.go('/500');
            });

        $scope.IsOnLoan = function () {
            return angular.isDefined ($scope.Details.loan);
        }
    }
]);
