/// <reference path='../_all.ts' />

declare var jsRoutes: any 
declare var INFRASTRUCTURE: Array<string>
declare var google: any

module app {
    'use strict'

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
        private timeout: ng.ITimeoutService
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
            this.timeout = $timeout
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
            if(this.edit) 
                this.save()
            else 
                this.insert()
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

        private insert(): void {
            this.loading = true
            this.handleMedias()
            this.handlePricings()

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
                    console.log(this.spot)
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
            var mapOptions = {
                center: { lat: 48.20817400000001, lng: 16.373819},
                zoom: 15
            }
            var marker = null

            this.geoService.current().then((data: any) => {
                map.setCenter(new google.maps.LatLng(data.coords.latitude, data.coords.longitude))
            })

            var map = new google.maps.Map(document.getElementById('map'), mapOptions)

            google.maps.event.addListener(map, 'click', (event) => {
                var lat: number = event.latLng.lat()
                var lng: number = event.latLng.lng()

                this.spot.address.position.lat = lat
                this.spot.address.position.lon = lng
                this.timeout(() => this.pointSet = true)

                this.geocode(event.latLng)

                if(marker == null) {
                    marker = new google.maps.Marker({position: event.latLng, map: map})
                } else {
                    marker.setPosition(event.latLng)
                }
                
            })
        }

        private geocode(latlng: any): void {
            var geocoder = new google.maps.Geocoder()
            geocoder.geocode({'latLng': latlng}, (results: any, status: any) => {
                if (status == google.maps.GeocoderStatus.OK) {
                    if(results.length > 0) {
                        results[0].address_components.forEach((elem, index, array) => {
                            elem.types.forEach((tpe, idx, arr) => {
                                if(tpe == "postal_code")
                                    this.spot.address.zip = parseInt(elem.long_name)
                                if(tpe == "locality")
                                    this.spot.address.city = elem.long_name
                            })
                        })
                    } else {
                        this.pointSet = false
                    }
                }
            })
        }
    }
}
