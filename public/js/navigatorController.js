app.controller('navigatorController', function ($scope, $http) {
    $http.get(`/IPStatistics`).then(
        (response) => {
            $scope.message = response.data.message
            $scope.location = response.data.location
            $scope.temperature = response.data.temperature
        },
        (error) => {
            console.log('weather statistics GET request issue:' + error.data)
        }
    )
})
