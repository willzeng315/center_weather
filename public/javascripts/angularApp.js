angular.module('centerWeather', ['ui.router'])
.config([
'$stateProvider',
'$urlRouterProvider',
function($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('home', {
      url: '/home',
      templateUrl: '/home.html',
      controller: 'MainCtrl',
      resolve: {
        wDataPromise: ['wData', function(wData){
          return posts.getToadyWeather();
        }]
      }
    });

  $urlRouterProvider.otherwise('home');
}]).factory('wData', ['$http', function($http){
  var o = {
    wData: []
  };

  o.getToadyWeather = function() {
    return $http.get('/ToadyWeather').success(function(data){
      angular.copy(data, o.wData);
    });
  };

  return o;
}])