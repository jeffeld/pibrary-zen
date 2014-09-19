userApp.factory('Member', ['$resource', function ($resource) {
    return $resource('/api/member/:dbid', {dbid:"@dbid"}, {
        activate : {
            method: 'PUT'
        }
    })
}]);



userControllers.controller('ActivateController', ['$scope', '$filter', 'Member', 'Codes', 'Links',
    function ($scope, $filter, Member, Codes, Links) {

        $scope.MemberSignUpId = ___memberid;
        $scope.CameraState = 'capture';

        $scope.Member = null;
        Member.get({dbid: $scope.MemberSignUpId}).$promise.then(function (data) {

            $scope.Member = data;

            var name = $filter('titlecase')($scope.Member.firstname);

            $scope.Steps = [
                {
                    title: "Take " + name + "'s photograph",
                    next: function () {
                        return $scope.ImageDataUrl != null;
                    }

                },
                {
                    title: "Assign " + name + " their membership card",
                    next: function () {
                        return Codes.isMembershipCode($scope.Details.MembershipId);
                    }
                },
                {
                    title: "Confirm and activate " + name + "'s membership",
                    next: function () {
                        return  false;
                    }


                }
            ];


        });

        $scope.Details = {
            MembershipId: ''
        };

        $scope.Details.MembershipId = "";

        $scope.CurrentStep = 0;

        $scope.OnPrevious = function () {
            $scope.CurrentStep--;
            $scope.CurrentStep = Math.max(0, $scope.CurrentStep);
        };

        $scope.OnNext = function () {
            $scope.CurrentStep++;
            $scope.CurrentStep = Math.min($scope.CurrentStep, $scope.Steps.length - 1);
        };

        $scope.OnActivate = function () {

            var activationInfo = {
                card: $scope.Details.MembershipId,
                photo: $scope.ImageDataUrl,
                dbid : $scope.MemberSignUpId
            };

            Member.activate({
                dbid: $scope.MemberSignUpId,
                activationInfo: activationInfo
            }).$promise.then(function (data) {

                Links.goHome();

            }, function (error) {

                console.log (error);

            });

        };

        $scope.CanSubmit = function () {

            return true;

        };

        $scope.OnCameraClick = function () {

            var canvas = document.createElement('canvas'), camera = document.getElementById('InnerWebCam'), image = document.getElementById('preview');

            canvas.width = camera.width;
            canvas.height = camera.height;

            var ctx = canvas.getContext('2d');
            ctx.drawImage(camera, 0, 0, camera.width, camera.height);

            $scope.ImageDataUrl = canvas.toDataURL('image/png');

            image.src = $scope.ImageDataUrl;
            image.width = camera.width;
            image.height = camera.height;

            $scope.CameraState = 'preview';

        };

        $scope.OnCameraRefresh = function () {
            $scope.ImageDataUrl = null;
            $scope.CameraState = 'capture';
        };

    }
]);
