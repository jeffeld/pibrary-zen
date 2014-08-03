userControllers.controller('ISBNController', ['$scope', '$sce', 'Codes', 'ISBN', 'Links',
    function ($scope, $sce, Codes, ISBN, Links) {

        // $scope.Details = ___isbnDetails;
        var i;

        ISBN.get ({isbn : ___isbn13}).
            $promise.then(function (result) {

                i = result.data[0];

                $scope.Details = {
                    title : i.title || 'Unknown',
                    author : i.author_data[0].name || 'Unknown',
                    publisher : (i.publisher_name || i.publisher_text) || 'Unknown Publisher',
                    edition :  i.edition_info || '',
                    physical : i.physical_description_text || '',
                    summary : (i.summary || i.notes) || '',
                    isbn10: i.isbn10 || 'n/a',
                    isbn13: i.isbn13 || 'n/a'
                };



            }, function () {

                Links.goHome();

            });

    }
]);
