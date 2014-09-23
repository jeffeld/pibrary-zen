
userApp.factory ('SignUp', ['$resource', function ($resource) {
    return $resource (
        '/api/signups/:id',
        {
            id : '@id'
        },
        {
            add : {
                method : "POST"
            }
        }
    );
}]);

//function atLeastOneSelected (c) {
//
//    var l =
////    _.filter (c, function(v){
////        return v.selected === true;
////    }).length;
//
//        _.findWhere (c, {selected : true}) || [];
//
//
//    return ! angular.isDefined(l);
//}


userControllers.controller('AdminSignUpController', ['$scope', 'SignUp',
    function ($scope, SignUp) {


        $scope.SignUps = [];
        $scope.SelectAll = false;
        $scope.SortOrder = 'datetime';
        $scope.AtLeastOneError = false;

        var refresh = function () {
            SignUp.query(function (data) {
                $scope.SignUps = data;
                _.each(data, function (v) {
                    v.selected = $scope.SelectAll;
                    v.error = false;
                    v.processed = false;
                });
            });
        };


//        $scope.AtLeastOneSelected = false;
//        $scope.OnSelect = function () {
//            $scope.AtLeastOneSelected = atLeastOneSelected($scope.SignUps);
//        };


        $scope.OnSelectAll = function () {
            $scope.SelectAll = !$scope.SelectAll;
            _.each($scope.SignUps, function (v) {
                v.selected = $scope.SelectAll;
            });

//            $scope.AtLeastOneSelected = $scope.SelectAll;
        };

        $scope.CanAct = function () {
            return angular.isDefined(_.findWhere ($scope.SignUps, {selected : true}));
        }

        $scope.OnApprove = function () {

            $scope.AtLeastOneError = false;

            _.each($scope.SignUps, function (v) {

                if (v.selected) {

                    SignUp.save ({id:v._id}, function () {
                        v.processed = true;
                    }, function(err){
                        v.error = true;
                        $scope.AtLeastOneError = true;
                    });

                }

            });

            refresh();

        };

        $scope.OnReject = function () {

            $scope.AtLeastOneError = false;

            _.each($scope.SignUps, function (v) {

                if (v.selected) {

                    SignUp.delete ({id: v._id}, function (err) {
                        v.processed = true;
                    }, function (err) {
                        v.error = true;
                        $scope.AtLeastOneError = true;
                    });



                }


            });

            refresh();

        };

        $scope.OnDelete = function (id) {

            SignUp.delete ({id: id, forceDelete: true}).$promise.then (function(data) {
                refresh ();
            });

        };

        refresh();
    }
]);
