userControllers.controller('ISBNController', ['$scope', '$sce', 'Codes', 'Search', 'Links',
    function ($scope, $sce, Codes, Search, Links) {

        Search.isbn ({item : ___isbn13}).
            $promise.then(function (result) {

                $scope.Details = result.book;

            }, function () {

                Links.goHome();

            });

    }
]);
