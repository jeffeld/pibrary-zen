
userApp.factory('Counts', ['$resource', function ($resource) {
    return $resource('/api/counts/:item', {item:"@item"},
        {
            signups : {
                method: 'GET',
                params: {
                    item: 'signups'
                }
            },
            activations : {
                method: 'GET',
                params: {
                    item: 'activations'
                }
            },
            emails : {
                method: 'GET',
                params: {
                    item: 'emails'
                }
            },
            overdues : {
                method: 'GET',
                params: {
                    item: 'overdues'
                }
            }
        });
}]);


userControllers.controller('AdminHomeController', ['$scope', '$timeout', 'Counts',
    function ($scope, $timeout, Counts) {

        $scope.ReturnDate = ___returnDate;

        var getSignUpCount = function () {
                Counts.signups().$promise.then(function(data){
                    $scope.SignUpCount = data.count;
                });
            },
            getActivationsCount = function () {
                Counts.activations().$promise.then(function(data){
                    $scope.ActivationsCount = data.count;
                });
            },
            getEmailsCount = function () {
                Counts.emails().$promise.then(function(data){
                    $scope.EmailsCount = data.count;
                });
            },
            getOverduesCount = function () {
                Counts.overdues().$promise.then(function(data){
                    $scope.OverduesCount = data.count;
                });
            },
            updateCount = function (cfn, t) {
                cfn();
                var fn = updateCount.bind (this, cfn, t);
                $timeout (fn, t*1000);
            };

        updateCount (getSignUpCount, _.random(30,60));
        updateCount (getActivationsCount, _.random(30,60));
        updateCount (getEmailsCount, _.random(30,60));
        updateCount (getOverduesCount, _.random(30,60));

        $scope.Functions = [
            {
                name : 'Sign-Ups',
                icon : 'glyphicon-th-list',
                count : function () {
                    return $scope.SignUpCount;
                },

                link : '/adminsignups'
            },
            {
                name : 'Activations',
                icon : 'glyphicon-flash',
                count : function () {
                    return $scope.ActivationsCount
                },
                link : '/adminactivations'
            },
            {
                name : 'Emails',
                icon : 'glyphicon-envelope',
                count : function () {
                    return $scope.EmailsCount;
                },
                link : '/adminemails'
            },
            {
                name : 'Overdues',
                icon : 'glyphicon-asterisk',
                count : function () {
                    return $scope.OverduesCount;
                },
                link : '/overdues'
            },
            {
                name : 'Settings',
                icon : 'glyphicon-cog',
                count : 0,
                link : '/settings'
            }

        ];


    }]);
