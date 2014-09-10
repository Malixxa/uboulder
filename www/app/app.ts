/// <reference path='_all.ts' />

declare var LANGUAGE

module app {
    'use strict'

    var ub = angular.module('ub', ['ngRoute','ngResource',
        'shoppinpal.mobile-menu','ng-back','angularFileUpload',
        'filters','angular-carousel', 'angulartics',
        'angulartics.google.analytics','pascalprecht.translate',
        'geolocation'])
    
    ub.controller('homeCtrl', HomeCtrl)
    ub.controller('editSpotCtrl', EditSpotCtrl)
    ub.controller('spotCtrl', SpotCtrl)

    ub.service('geoService', GeoService)
    ub.service('offlineService', OfflineService)

    ub.directive('imgUpload', ImgUpload.prototype.injection())
    ub.directive('widget', Widget.prototype.injection())
    ub.directive('widgetImg', WidgetImg.prototype.injection())

    ub.config(['$routeProvider', function($routeProvider: ng.route.IRouteProvider) {
		    $routeProvider.when('/home', {templateUrl: 'partials/home.html', controller: 'homeCtrl'}).
            when('/new', {templateUrl: 'partials/new.html', controller: 'editSpotCtrl'}).
            when('/edit/:id', {templateUrl: 'partials/new.html', controller: 'editSpotCtrl'}).
            when('/spot/:id', {templateUrl: 'partials/spot.html', controller: 'spotCtrl'}).
            when('/imprint', {templateUrl: 'partials/footer/imprint.html'}).
            when('/about', {templateUrl: 'partials/footer/about.html'}).
            when('/terms', {templateUrl: 'partials/footer/terms.html'}).
            when('/404', {templateUrl: 'partials/404.html'}).
		    otherwise({redirectTo: '/home'})
  		}])

    ub.config(['$translateProvider', function($translateProvider) {
        $translateProvider.useStaticFilesLoader({
            prefix: 'app/languages/',
            suffix: '.json'
        }).preferredLanguage(LANGUAGE)
    }])

    ub.run(['$rootScope','$http','offlineService',function($rootScope: any, $http: ng.IHttpService,
        offlineService: app.OfflineService){
        $rootScope.$on('$routeChangeStart', function (event, next, current) {
            $http.get("http://localhost:9000/ping").success(
                (data: any, status: any) => {
                    offlineService.setOnline()
                }
            ).error(
                (data: any, status: any) => {
                    offlineService.setOffline()
                }
            )
        })
    }])

}