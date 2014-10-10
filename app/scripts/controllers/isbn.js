userControllers.controller('ISBNController', ['$scope', '$sce', 'Codes', 'Search', 'Links',
    function ($scope, $sce, Codes, Search, Links) {

        $scope.isbn13 = ___isbn13;


        Search.isbn ({item : ___isbn13}).
            $promise.then(function (result) {

                $scope.Details = result.book;
                // $scope.Details.CoverUrl = '/images/No Image-227x327.gif';

            }, function () {

                Links.goHome();

            });

    }
]);
