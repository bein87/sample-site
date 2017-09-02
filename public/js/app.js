let app = angular.module('tzachBeinApp', ['ui.router','ngAnimate']);

app.config(($stateProvider, $urlRouterProvider, $locationProvider) => {
    $locationProvider.html5Mode(true);
    $urlRouterProvider.otherwise('/home');
    $stateProvider
      .state('home', {
        url: '/home',
        templateUrl: 'views/partial-home.html',
        controller:  'homeController'
      })
      .state('about', {
        url:'/about',
        templateUrl: 'views/partial-about.html'
      })
      .state('weather', {
        url: '/weather',
        templateUrl: 'views/partial-weather.html',
        controller:  'weatherController'
      })
      .state('phonebook', {
        url: '/phonebook',
        templateUrl: 'views/partial-phonebook.html',
        controller:  'phonebookController'
      })
      .state('location', {
        url: '/location',
        templateUrl: 'views/partial-location.html',
        controller:  'locationController'
      })
})

app.directive("navigator", () => {
    return{
        templateUrl: 'views/partial-navigator.html',
        controller: 'navigatorController',
    }
})
