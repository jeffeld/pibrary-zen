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




userControllers.controller('MemberController', ['$scope', 'MemberDetails',
    function ($scope, MemberDetails) {

        $scope.MembershipId = ___mid;

        $scope.Details = MemberDetails.getDetails({id: $scope.MembershipId});

    }
]);

