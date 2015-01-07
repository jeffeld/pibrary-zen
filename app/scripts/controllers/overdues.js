userApp.factory('Overdues', ['$resource', function ($resource) {
    return $resource('/api/overdues');
}]);


userControllers.controller('OverduesController', ['$scope', 'Overdues', 'Links',
    function ($scope, Overdues, Links) {

        Overdues.query().$promise.then (function (data) {
            $scope.Overdues = data;
        }, function () {
           Links.go ('/500');
        });

        $scope.SortOrder = "returnDate";

    }
]);

