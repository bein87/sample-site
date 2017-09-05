app.controller('navigatorController', function ($scope, $http) {

    //close nav menu after clicking on a tab
    $('.nav a').on('click', function(){
        $('.navbar-toggle').click()
    })

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
