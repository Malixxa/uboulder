/// <reference path='../_all.ts' />

declare var jsRoutes: any 
declare var L: any

module app {
    'use strict'

    declare var localforage: lf.ILocalForage<app.Spot>

    export interface ISpotScope extends ng.IScope {
    	vm: SpotCtrl
    }

    export interface ISpotParams {
        id: string
    }

    export class SpotCtrl {
      
        static $inject: Array<string> = ['$scope','$http','$location',
            '$stateParams','$sce','$window','offlineService'];

        private scope: app.ISpotScope
        private http: ng.IHttpService
        private location: ng.ILocationService
        private window: ng.IWindowService
        private sce: any
        private offlineService: app.OfflineService

        private spot: Spot
        private hasImage: boolean = false
        private slideIndex: number = 0
        private oratio: string

        private finished: boolean = false 

        constructor($scope: app.ISpotScope, $http: ng.IHttpService, $location: ng.ILocationService, 
            $stateParams: app.ISpotParams, $sce: any, $window: ng.IWindowService,
            offlineService: app.OfflineService) {  
        	this.scope = $scope
            this.scope.vm = this
            this.http = $http
            this.location = $location
            this.window = $window
            this.sce = $sce
            this.offlineService = offlineService

            this.oratio = this.sce.trustAsResourceUrl('//www.orat.io/js/widget/stmt.inc.min.js')

            this.loadSpot($stateParams.id || "0")

            this.scope.$on('online', (e: any) => {
                this.loadFinish()
            })
        }

        private loadSpot(id: string): void {
            console.log(id)
            localforage.getItem(id, (spot: Spot) => {
                this.spot = spot
                if(this.spot) {
                    // send request when online, to update pageViews!
                    if(this.offlineService.isOnline()) {
                        this.http.get(jsRoutes.controllers.Application.retrieveSpot(id).absoluteURL()).success(
                            (data: Spot, status: any) => {
                                var spot: Spot = data
                                localforage.setItem(spot.id, spot)
                            }
                        ).error(
                            (data: any, status: any) => {
                                // remove if doesn't exist anymore
                                localforage.removeItem(spot.id)
                                this.location.path('/app/404')
                            }
                        )
                    }
                    this.loadFinish()
                } else 
                    this.loadRemote(id)
            })
        }


        private loadRemote(id: string): void {
            this.http.get(jsRoutes.controllers.Application.retrieveSpot(id).absoluteURL()).success(
                (data: Spot, status: any) => {
                    if(data) {
                        this.spot = data
                        if(this.spot.active)
                            this.loadFinish()
                        else
                            this.location.path('/app/404')
                    } else {  
                        this.location.path('/app/404').replace()     
                    }
                }
            ).error(
                (data: any, status: any) => {
                    this.location.path('/app/404').replace()
                }
            ) 
        }

        private loadFinish(): void {
            this.checkImages()
            this.loadMap()
        }

        private checkImages(): void {
            if(this.spot.media && this.spot.media.length > 0)
                this.hasImage = true
        }

        private loadMap(): void {
            var lat: number = this.spot.address.position.lat
            var lng: number = this.spot.address.position.lon


            var map = L.map('map').setView([lat, lng], 13);

            L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
                maxZoom: 18
            }).addTo(map)

            L.marker([lat, lng]).addTo(map)

        }
    }

}