
userApp.factory ('LostPassword', ['$resource', function ($resource) {
    return $resource (
        '/api/password/lost',
        {

        },
        {
            reset : {
                method : "POST"
            }
        }
    );
}]);



userControllers.controller('LostPasswordController', ['$scope', 'LostPassword', 'Links',
    function ($scope, LostPassword, Links) {

        $scope.Mode = 'start';
        $scope.Key = '';

        $scope.CanSubmit = function () {

            return $scope.Key !== '';

        };

        $scope.OnResetPassword = function () {

            LostPassword.reset ({key:$scope.Key}).$promise.then (function (data) {
                $scope.Mode = 'success';
            }, function (error) {

                if (error.status === 404) {
                    $scope.Mode = 'notfound';
                } else {
                    Links.go ('/500');
                }

            });

        };

        $scope.OnTryAgain = function () {
            $scope.Mode = 'start';
        }

    }
]);