

userApp.factory ('ResetPassword', ['$resource', function ($resource) {
    return $resource (
        '/api/password/reset/:id',
        {
            id : '@id'
        }
    );
}]);



userControllers.controller('ResetPasswordController', ['$scope', 'ResetPassword', 'formService', 'Links',
    function ($scope, ResetPassword, formService, Links) {

        $scope.Id = ___id;

        $scope.ShowPassword = false;

        $scope.Mode = 'reset';

        $scope.CanSubmit = function () {

            if (! formService.isValidPassword($scope.Password1)) {
                return false;
            }

            if ($scope.Password1 !== $scope.Password2) {
                return false;
            }

            return true;

        };

        $scope.OnResetPassword = function () {

            ResetPassword.save ({id:$scope.Id, password:$scope.Password1}).$promise.then (function (data) {
                $scope.Mode = 'success';
            }, function () {
                Links.go ('/500');
            });

        };

        $scope.ShowHidePassword = function () {
            $scope.ShowPassword = !$scope.ShowPassword;
        }

    }
]);
