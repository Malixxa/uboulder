/// <reference path='../_all.ts' />

declare var jsRoutes: any 

module app {
    'use strict'

    declare var localforage: lf.ILocalForage<app.Spot>

    export interface IHomeScope extends ng.IScope {
    	vm: HomeCtrl
        findForm: ng.IFormController
    }

    export class HomeCtrl {
      
        static $inject: Array<string> = ['$scope','$http','$location','$window',
            '$resource','$timeout','offlineService','geoService'];

        private scope: app.IHomeScope
        private http: ng.IHttpService
        private location: ng.ILocationService
        private window: ng.IWindowService
        private resource: any
        private timeout: ng.ITimeoutService

        private offlineService: app.OfflineService
        private geoService: app.GeoService

        private offset: number = 0
        private radius: number = 3
        private lat: number = 0
        private lon: number = 0
        private choose: number = 0
        private phrase: string = null

        private spots: Array<Spot> = new Array<Spot>()
        private loading: boolean = false
        private showLoad: boolean = false

        constructor($scope: app.IHomeScope, $http: ng.IHttpService, 
            $location: ng.ILocationService, $window: ng.IWindowService,
            $resource: any, $timeout: ng.ITimeoutService, 
            offlineService: app.OfflineService, geoService: app.GeoService) {  
        	this.scope = $scope
        	this.scope.vm = this 
            this.http = $http
            this.location = $location
            this.window = $window
            this.resource = $resource
            this.timeout = $timeout
            this.offlineService = offlineService
            this.geoService = geoService

            this.geoService.current().then((data: any) => {
                this.lat = data.coords.latitude 
                this.lon = data.coords.longitude
                this.loadNearby()
            })

            this.window.onscroll = (ev: any) => {
                var height: number = <number>$(window).innerHeight() + <number>$(window).scrollTop()
                var doc: number = <number>$(document).height()
                if((height + 200 >= doc) && this.showLoad) {
                    if(this.choose == 0)
                        this.loadNearby()
                    else
                        this.loadByCity()
                }
            }
        }

        public reset(): void {
            this.offset = 0
            this.spots = new Array<Spot>()
            if(this.choose == 0)
                this.loadNearby()
            else
                this.loadByCity()
        }

        public parseRadius(): void {
            this.radius = parseInt(this.radius.toString())
        }

        public loadByCity(): void {
            this.loading = true
            this.http.get(jsRoutes.controllers.Application.findByCity(this.phrase, this.offset).absoluteURL()).success(
                (data: any, status: any) => {
                    this.spots = this.spots.concat(<Array<Spot>>data)
                    this.offset += 10
                    this.loading = false
                    this.offlineService.setOnline()
                    this.saveOffline()
                    if(this.spots.length == this.offset)
                        this.showLoad = true
                }
            ).error(
                (data: any, status: any) => {
                    this.loading = false
                    this.offlineService.setOffline()
                    this.loadOffline()
                }
            )
        }

        public loadNearby(): void {
            this.loading = true
        	this.http.get(jsRoutes.controllers.Application.findNearby(this.lat, this.lon, this.radius*1000, this.offset).absoluteURL()).success(
        		(data: any, status: any) => {
        			this.spots = this.spots.concat(<Array<Spot>>data)
        			this.offset += 10
                    this.loading = false
                    this.offlineService.setOnline()
                    this.saveOffline()
                    if(this.spots.length == this.offset)
                        this.showLoad = true
        		}
        	).error(
        		(data: any, status: any) => {
                    this.loading = false
                    this.offlineService.setOffline()
                    this.loadOffline()
                }
        	)
        }

        public redirect(id: string): void {
            this.location.path('/spot/'+id)
        }

        private loadOffline(): void {
            this.showLoad = false
            for(var i: number = 0; i < 10; i++) {
                var spot = localforage.getItem('spot-'+i, (spot: Spot) => {
                    if(spot)
                        this.timeout(() => this.spots.push(spot))    
                });
            }
        }

        private saveOffline(): void {
            this.spots.forEach(
                (elem: Spot, index: number, array: Array<Spot>) => {
                    localforage.setItem("spot-"+index, elem)
                }
            )
        }
    }

}
