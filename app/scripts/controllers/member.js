userApp.factory('MemberDetails', ['$resource', function ($resource) {
    return $resource('/api/member/:id/:item', {id:"@id"}, {
        getDetails: {
            method: 'GET',
            params : {
                item: 'details'
            }

        }
    })
}]);




userControllers.controller('MemberController', ['$scope', 'MemberDetails', 'Links',
    function ($scope, MemberDetails, Links) {

        $scope.MembershipId = ___mid;

        MemberDetails.getDetails({id: $scope.MembershipId}).$promise.then (function (data){

            $scope.Details = data;

        }, function (err) {

            if (err.status === 404) {
                Links.go('/404');
            } else {
                Links.go('/500');
            }

        });
//        $scope.Details = MemberDetails.getDetails({id: $scope.MembershipId});

    }
]);

