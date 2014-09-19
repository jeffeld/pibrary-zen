
userApp.factory('Activations', ['$resource', function ($resource) {
    return $resource('/api/members/activations/:email', {item:"@email"}, {
        pending : {
            method : "GET",
            isArray : true
        }
    })
}]);


userControllers.controller('ActivationController', ['$scope', '$timeout', 'Activations', 'Links',
    function ($scope, $timeout, Activations, Links) {

        var t = _.random(60, 90) * 1000,
            getActivations = function () {

                $scope.Activations = null;

                Activations.pending().$promise.then(function (data) {

                    $scope.Activations = data;

                    if (data.length === 0) {
                        $timeout(getActivations, t);
                    }

                    _.each ($scope.Activations, function(v){
                        v.link = Links.make ('adminactivate', v._id);
                    });

                });

            };

        $scope.OnRemove = function (email) {
            Activations.delete ({email: email}).$promise.then (function () {
                getActivations(t);
            });
        };

        $scope.SortOrder = "lastname";

//        $scope.OnClick = function (id) {
//            Links.go ('/activate?sid=' + id);
//        }

        getActivations(t);

    }
]);
