/// <reference path='_all.ts' />

declare var LANGUAGE
declare var cordova
declare var StatusBar

module app {
    'use strict'

    var ub = angular.module('ub', ['ngRoute','ngResource', 'ionic',
        'ng-back','angularFileUpload', 'filters','angular-carousel', 'angulartics',
        'angulartics.google.analytics','pascalprecht.translate',
        'geolocation'])

    ub.run(function($ionicPlatform) {
        $ionicPlatform.ready(function() {
            if((<any>window).cordova && (<any>window).cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true)
            }
            if((<any>window).StatusBar) {
                StatusBar.styleDefault()
            }
        })
    })
    
    ub.controller('homeCtrl', HomeCtrl)
    ub.controller('menuCtrl', MenuCtrl)
    ub.controller('editSpotCtrl', EditSpotCtrl)
    ub.controller('spotCtrl', SpotCtrl)

    ub.service('geoService', GeoService)
    ub.service('offlineService', OfflineService)

    ub.directive('imgUpload', ImgUpload.prototype.injection())
    ub.directive('widget', Widget.prototype.injection())
    ub.directive('widgetImg', WidgetImg.prototype.injection())

    ub.config(function($stateProvider, $urlRouterProvider) {
      $stateProvider
        .state('app', {
          url: "/app",
          abstract: true,
          templateUrl: "partials/menu.html",
          controller: "menuCtrl"
        })

        .state('app.home', {
          url: "/home",
          views: {
            'menuContent' :{
              templateUrl: "partials/home.html",
              controller: 'homeCtrl'
            }
          }
        })

        .state('app.new', {
          url: "/new",
          views: {
            'menuContent' :{
              templateUrl: "partials/new.html",
              controller: 'editSpotCtrl'
            }
          }
        })

        .state('app.edit', {
          url: "/edit/:id",
          views: {
            'menuContent' :{
              templateUrl: "partials/new.html",
              controller: 'editSpotCtrl'
            }
          }
        })

        .state('app.spot', {
          url: "/spot/:id",
          views: {
            'menuContent' :{
              templateUrl: "partials/spot.html",
              controller: 'spotCtrl'
            }
          }
        })

        .state('app.404', {
          url: "/404",
          views: {
            'menuContent' :{
              templateUrl: "partials/404.html"
            }
          }
        })

        .state('app.about', {
          url: "/about",
          views: {
            'menuContent' :{
              templateUrl: "partials/footer/about.html"
            }
          }
        })

        .state('app.terms', {
          url: "/terms",
          views: {
            'menuContent' :{
              templateUrl: "partials/footer/terms.html"
            }
          }
        });
      // if none of the above states are matched, use this as the fallback
      $urlRouterProvider.otherwise('/app/home');
    });

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