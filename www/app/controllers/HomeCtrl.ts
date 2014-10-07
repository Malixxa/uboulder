/// <reference path='../_all.ts' />

declare var jsRoutes: any 
declare var CITIES: Array<string>

module app {
    'use strict'

    export interface IHomeScope extends ng.IScope {
    	vm: HomeCtrl
        findForm: ng.IFormController
    }

    export class HomeCtrl {
      
        static $inject: Array<string> = ['$scope','$location','$window',
            'offlineService','geoService','spotService'];

        private cities: Array<string>

        private scope: app.IHomeScope
        private location: ng.ILocationService
        private window: ng.IWindowService

        private offlineService: app.OfflineService
        private geoService: app.GeoService
        private spotService: app.SpotService

        private radius: number = 3
        private lat: number = 0
        private lon: number = 0
        private choose: number = 0
        private phrase: string = null
        

        constructor($scope: app.IHomeScope, 
            $location: ng.ILocationService, $window: ng.IWindowService, 
            offlineService: app.OfflineService, 
            geoService: app.GeoService, spotService: app.SpotService) {  
        	this.scope = $scope
        	this.scope.vm = this 
            this.location = $location
            this.window = $window
            this.offlineService = offlineService
            this.geoService = geoService
            this.spotService = spotService
            this.cities = CITIES

            this.geoService.current().then((data: any) => {
                this.lat = data.coords.latitude 
                this.lon = data.coords.longitude
                this.loadNearby()
            })

            this.window.onscroll = (ev: any) => {
                var height: number = <number>$(window).innerHeight() + <number>$(window).scrollTop()
                var doc: number = <number>$(document).height()
                if((height + 200 >= doc) && this.spotService.showLoad) {
                    if(this.choose == 0)
                        this.spotService.loadNearby(this.lat, this.lon, this.radius)
                    else
                        this.spotService.loadByCity(this.phrase)
                }
            }
        }

        public reset(): void {
            this.spotService.reset()
            if(this.choose == 0)
                this.loadNearby()
            else
                this.loadByCity()
        }

        public parseRadius(): void {
            this.radius = parseInt(this.radius.toString())
        }

        public redirect(id: string): void {
            this.location.path('/app/spot/'+id)
        }

        public loadByCity(): void {
            this.spotService.loadByCity(this.phrase)
        }

        public loadNearby(): void {
            this.spotService.loadNearby(this.lat, this.lon, this.radius)
        }


    }

}
