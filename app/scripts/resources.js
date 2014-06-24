userApp.factory ('SignUp', ['$resource', function ($resource) {
    return $resource ('/api/signup/:id', {id: "@id"}, {
        'add' : { method: 'POST'}

    });
}]);
