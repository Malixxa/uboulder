/// <reference path='../_all.ts' />

declare var jsRoutes: any 
declare var INFRASTRUCTURE: any
declare var L: any

module app {
    'use strict';

    export interface IEditSpotScope extends ng.IScope {
    	vm: EditSpotCtrl
    	spotForm: ng.IFormController
    }

    export interface IEditSpotParams {
    	id: string
    }

    export class EditSpotCtrl {

	    private spot: app.Spot
        private infrastructure: Array<string>

	    private http: ng.IHttpService
	    private location: ng.ILocationService
	    private scope: app.IEditSpotScope
        private window: ng.IWindowService
        private geoService: app.GeoService
        private offlineService: app.OfflineService
        private media: Array<app.Media> = new Array<app.Media>()
        private pricing: Array<app.Pricing> = new Array<app.Pricing>()
        
        private loading: boolean = false
        private edit: boolean = false
        private pointSet: boolean = false
      
        static $inject: Array<string> = ['$scope','$stateParams','$http','$location',
            '$window','$timeout','geoService', 'offlineService']

        constructor($scope: app.IEditSpotScope, $stateParams: app.IEditSpotParams,
        	$http: ng.IHttpService, $location: ng.ILocationService, 
        	$window: ng.IWindowService, $timeout: ng.ITimeoutService,
            geoService: app.GeoService, offlineService: app.OfflineService) {  
        	$scope.vm = this
        	this.scope = $scope
        	this.http = $http
        	this.location = $location
            this.window = $window
            this.geoService = geoService
            this.offlineService = offlineService
            this.infrastructure = INFRASTRUCTURE

            if(this.offlineService.isOnline()) {
                var id: string = ($stateParams.id || "new")

                if(id === "new") 
                    this.createSpot()
                else 
                    this.loadSpot(id)
            } else {
                this.location.path('/app/offline')
            }

            this.scope.$on('geocode', (e: any, address: app.Address, error: string) => this.geocodeFinished(address, error))
        }

        public addMedia(): void {            
            this.media.push(new Media())
        }

        public deleteMedia(index: number): void {
            this.media.splice(index,1)
        }

        public addPricing(): void {
            this.pricing.push(new Pricing(null, 0))
        }

        public deletePricing(index: number): void {
            this.pricing.splice(index,1)
        }

        public showSummary(): void {
            this.loading = true
            this.geoService.geocode(this.spot.address)
        }

        public toggleInfrastructure(elem: string): boolean {
            var index: number = this.spot.infrastructure.indexOf(elem)
            if(index >= 0) {
                this.spot.infrastructure.splice(index,1)
                return false
            } else { 
                this.spot.infrastructure.push(elem)
                return true
            }
        }

        private geocodeFinished(address: app.Address, error: string): void {
            if(error) {
                this.window.alert(error)
                this.loading = false
            } else if(this.edit) {
                this.spot.address = address
                this.save()
            } else {
                this.spot.address = address
                this.insert()
            }
        }

        private insert(): void {
            this.loading = true
            this.handleMedias()

            this.http.post(jsRoutes.controllers.Application.createSpot().absoluteURL(), this.spot).success(
                (data: Spot, status: any) => {
                    this.spot = data
                    this.location.path('/app/spot/'+this.spot.id)
            }).error(
                (data: any, status: number) => {
                    this.loading = false
            })
        }

        private save(): void {
            this.loading = true
            this.handleMedias()
            this.handlePricings()

            this.http.put(jsRoutes.controllers.Application.updateSpot().absoluteURL(), this.spot).success(
                    (data: Spot, status: any) => {
                        this.spot = data
                        this.location.path('/app/spot/'+this.spot.id)
                    }
                ).error(
                    (data: any, status: number) => {}
                )
        }

        private handleMedias(): void {
            for(var i = this.media.length; i--;) {
                if(!this.media[i].url) {
                    this.media.splice(i, 1);
                }
             }
             this.spot.media = this.spot.media.concat(this.media)
        }

        private handlePricings(): void {
            for(var i = this.pricing.length; i--;) {
                if(!this.pricing[i].description) {
                    this.pricing.splice(i, 1);
                }
             }
            this.spot.pricing = this.spot.pricing.concat(this.pricing)
        }

        private createSpot(): void {
            this.edit = false
            this.spot = new Spot()
            this.spot.address = new Address()
            this.createMap()
        }

        private loadSpot(id: string): void {
            this.edit = true
            this.pointSet = true
            this.http.get(jsRoutes.controllers.Application.retrieveSpot(id).absoluteURL()).success(
                (data: Spot, status: any) => {
                    this.spot = data
                    if(!this.spot) 
                        this.location.path('/app/404').replace()     
                }
            ).error(
                (data: any, status: number) => {
                    this.location.path('/app/404').replace()
                }
            ) 
        }   

        private createMap(): void {
            var map = L.map('map')
            var marker = null

            L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
                maxZoom: 18
            }).addTo(map);

            this.geoService.current().then((data: any) => {
                map.setView([data.coords.latitude, data.coords.longitude], 13);
            })

            this.addClickHandler(map, marker);

            map.on('blur', (e: any) => this.addClickHandler(map, marker))
            map.on('focus', (e: any) => this.addClickHandler(map, marker))
        }    

        private addClickHandler(map, marker): void {
            map.on('click', (e: any) => {
                this.spot.address.position.lat = e.latlng.lat
                this.spot.address.position.lon = e.latlng.lng
                this.pointSet = true

                if(marker)
                    marker.setLatLng(e.latlng)
                else
                    marker = L.marker([e.latlng.lat, e.latlng.lng]).addTo(map) 
            });
        } 
    }
}
