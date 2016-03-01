(function(){
  'use strict'

angular.module('commvsAdmin', [])

  .controller('loginController', ['$scope','$http', function($scope, $http) {

    $scope.master = {};

    $scope.login = function(user) {
      console.log(user);
      $http({
        method: 'POST',
        url: '/api/authenticate',
        data: user
     }).then(function success(response) {
       $scope.master = response.data;
       console.log(response.data);
     }, function error(response) {
       console.log('Error: '+ response);
     })

    }
  }]);

})();



/*
    $http.get('/api/comms')
      .success(function(data) {
          $scope.comms = data;
          console.log(data);
      })
      .error(function(data) {
          console.log('Error: ' + data);
      });

*/



// public/core.js


/*function mainController($scope, $http) {
    $scope.formData = {};

    // when landing on the page, get all todos and show them
    $http.get('/api/comms')
        .success(function(data) {
            $scope.comms = data;
            console.log(data);
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });

    // when submitting the add form, send the text to the node API
    $scope.createTodo = function() {
        $http.post('/api/comms', $scope.formData)
            .success(function(data) {
                $scope.formData = {}; // clear the form so our user is ready to enter another
                $scope.todos = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

    // delete a todo after checking it
    $scope.deleteTodo = function(id) {
        $http.delete('/api/todos/' + id)
            .success(function(data) {
                $scope.todos = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

}
*/
