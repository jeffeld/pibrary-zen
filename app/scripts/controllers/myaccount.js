userControllers.controller('MyAccountController', ['$scope',
    function ($scope) {

        $scope.User = {
            firstname : 'Jeff',
            lastname : 'Eldridge',
            email : 'jeff@gmail.com',
            loans : [
                {
                    _id : '121212121212121212121212',
                    title : 'Gridlinked',
                    author : 'Neal Asher',
                    stockcode : 'abcdef1234567890',
                    checkedout: Date.now(),
                    due: Date.now() - (1000*60*60*24*5),
                    renewed : 1
                    // isOverdue : true
                },
                {
                    _id : '131313131313131313131313',
                    title : 'Doctor Who and the Silurians',
                    author : 'Malcolm Hulke',
                    stockcode : '1234567890abcdef',
                    checkedout: Date.now(),
                    due: Date.now() + (1000*60*60*24*3),
                    renewed : 2
                    // isOverdue : false
                },
                {
                    _id : '141414141414141414141414',
                    title : 'Tinker, Taylor, Soldier, Spy',
                    author : 'John Le-Carre',
                    stockcode : 'ef123456abcd7890',
                    checkedout: Date.now(),
                    due: Date.now() + (1000*60*60*24*14),
                    renewed : 0
                    // isOverdue : false

                }
            ]
        };

        _.each ($scope.User.loans, function(v){
//            v.moment = new moment(new Date(v.due)).fromNow();
            v.isOverdue = Date.now() > v.due;

        });




    }
]);
