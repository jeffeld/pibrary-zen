
userApp.factory ('Stats', ['$resource', function ($resource) {
    return $resource ('/api/stats/:stat', {
        stat : '@stat'
    },
        {
            recentlyAdded : {
                method: 'GET',
                isArray : true,
                params : {
                    stat : 'recentlyadded'
                }
            }
        });
}]);



userControllers.controller('HomePageController', ['$scope', 'Stats', '$timeout',
    function ($scope, Stats, $timeout) {

        $scope.RecentlyAdded = [];
        Stats.recentlyAdded().$promise.then(function (data){
            $scope.RecentlyAdded = _.shuffle(data);

        });

    }]);