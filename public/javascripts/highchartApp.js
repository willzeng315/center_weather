angular.module('myapp', ['ui.router', 'highcharts-ng'])
    .config([
        '$stateProvider',
        '$urlRouterProvider',
        function($stateProvider, $urlRouterProvider) {

            $stateProvider
                .state('home', {
                    url: '/home',
                    templateUrl: 'tplurl/chart.html',
                    controller: 'myctrl',
                    resolve: {
                        postPromise: ['wData', function(postData) {
                            return postData.getAll('14');
                        }]
                    }
                });

            $urlRouterProvider.otherwise('home');
        }
    ])
    .factory('wData', ['$http', function($http) {
        var o = {
            data: []
        };

        o.getAll = function(xmlPath) {
            return $http.get('/test/' + xmlPath).success(function(data) {
                angular.copy(data, o.data);
            });
        };
        return o;
    }])
    .controller('myctrl', ['$scope', 'wData', '$http', function($scope, wData, $http) {

        $scope.changeCity = function() {
            var weatherData = [];
            $http.get('/test/'+$scope.chooseCity).success(function(data) {
                angular.copy(data, weatherData);
                console.log(weatherData.desc.maxTemp);
                $scope.chartConfig.series = [{
                    "name": "最高溫度",
                    "data": weatherData.desc.maxTemp,
                    'pointStart': Date.now() + 24 * 36e5,
                    'pointInterval': 24 * 36e5
                }, {
                    "name": "最低溫度",
                    "data": weatherData.desc.minTemp,
                    'pointStart': Date.now() + 24 * 36e5,
                    'pointInterval': 24 * 36e5
                }];
                $scope.chartConfig.title = {
                    text: weatherData.title
                };
                $scope.dateSet=[{x0:weatherData.desc.wDate[0],
                                x1:weatherData.desc.wDate[1],
                                x2:weatherData.desc.wDate[2],
                                x3:weatherData.desc.wDate[3],
                                x4:weatherData.desc.wDate[4],
                                x5:weatherData.desc.wDate[5]}];
                $scope.dayWeather=[{x0:weatherData.desc.dayWeather[0],
                                x1:weatherData.desc.dayWeather[1],
                                x2:weatherData.desc.dayWeather[2],
                                x3:weatherData.desc.dayWeather[3],
                                x4:weatherData.desc.dayWeather[4],
                                x5:weatherData.desc.dayWeather[5]}];   
                $scope.nightWeather=[{x0:weatherData.desc.nightWeather[0],
                                x1:weatherData.desc.nightWeather[1],
                                x2:weatherData.desc.nightWeather[2],
                                x3:weatherData.desc.nightWeather[3],
                                x4:weatherData.desc.nightWeather[4],
                                x5:weatherData.desc.nightWeather[5]}];  
            });

        };

        $scope.chartTypes = [{
            "id": "01",
            "title": "台北市"
        }, {
            "id": "04",
            "title": "新北市"
        }, {
            "id": "05",
            "title": "桃園市"
        }, {
            "id": "14",
            "title": "新竹市"
        }, {
            "id": "06",
            "title": "新竹縣"
        }, {
            "id": "07",
            "title": '苗栗縣'
        }, {
            "id": "08",
            "title": '台中市'
        }, {
            "id": "09",
            "title": '彰化縣'
        }, {
            "id": "10",
            "title": '南投縣'
        }, {
            "id": "11",
            "title": '雲林縣'
        }, {
            "id": "12",
            "title": '嘉義縣'
        }, {
            "id": "13",
            "title": '臺南市'
        }, {
            "id": "02",
            "title": '高雄市'
        }, {
            "id": "17",
            "title": '宜蘭縣'
        }, {
            "id": "18",
            "title": '花蓮縣'
        }, {
            "id": "19",
            "title": '台東縣'
        }];

        $scope.chartSeries = [{
            "name": "最高溫度",
            "data": wData.data.desc.maxTemp,
            'pointStart': Date.now() + 24 * 36e5,
            'pointInterval': 24 * 36e5
        }, {
            "name": "最低溫度",
            "data": wData.data.desc.minTemp,
            'pointStart': Date.now() + 24 * 36e5,
            'pointInterval': 24 * 36e5
        }, ];

        $scope.chooseCity='14';
        $scope.dateSet=[{x0:wData.data.desc.wDate[0],
                        x1:wData.data.desc.wDate[1],
                        x2:wData.data.desc.wDate[2],
                        x3:wData.data.desc.wDate[3],
                        x4:wData.data.desc.wDate[4],
                        x5:wData.data.desc.wDate[5]}];
        $scope.dayWeather=[{x0:wData.data.desc.dayWeather[0],
                        x1:wData.data.desc.dayWeather[1],
                        x2:wData.data.desc.dayWeather[2],
                        x3:wData.data.desc.dayWeather[3],
                        x4:wData.data.desc.dayWeather[4],
                        x5:wData.data.desc.dayWeather[5]}];   
        $scope.nightWeather=[{x0:wData.data.desc.nightWeather[0],
                        x1:wData.data.desc.nightWeather[1],
                        x2:wData.data.desc.nightWeather[2],
                        x3:wData.data.desc.nightWeather[3],
                        x4:wData.data.desc.nightWeather[4],
                        x5:wData.data.desc.nightWeather[5]}];                   
        $scope.chartConfig = {
            options: {
                chart: {
                    type: 'spline',
                    spacingBottom: 15,
                    spacingTop: 10,
                    spacingLeft: 10,
                    spacingRight: 10,

                    width: 600,
                    height: 300
                }
            },
            series: $scope.chartSeries,
            title: {
                text: wData.data.title
            },
            yAxis: {
                title: {
                    text: '氣溫',
                    rotation: 0
                }
            },
            xAxis: [{
                type: 'datetime',
                labels: {
                    format: '{value:%m-%d}',
                    align: 'left'
                }
            }],
            credits: {
                enabled: true
            },
            legend: {
                enabled: false
            }
        }
    }]);