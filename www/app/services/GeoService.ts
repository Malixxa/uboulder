/// <reference path='../_all.ts' />

module app {
    'use strict'

    export class GeoService {

        static $inject: Array<string> = ['$rootScope','$http','geolocation']

        private rootScope: ng.IRootScopeService
        private http: ng.IHttpService
        private geolocation: any

    	constructor($rootScope: ng.IRootScopeService, $http: ng.IHttpService, geolocation: any) {
            this.rootScope = $rootScope
            this.http = $http
            this.geolocation = geolocation
        }

        public current(): ng.IPromise<any> {
            return <ng.IPromise<any>>this.geolocation.getLocation()
        }

        public geocode(address: app.Address): void {
            this.http.get('http://nominatim.openstreetmap.org/reverse?format=json&addressdetails=1&accept-language=en&lat='
                +address.position.lat+'&lon='+address.position.lon, {withCredentials: false}).success(
                (data: any, status: any) => {
                    if(data && data.address) {
                        if(!data.address.city && !data.address.town && !data.address.village && data.address.hamlet)
                            address.city = data.address.hamlet
                        else if(!data.address.city && !data.address.town && data.address.village)
                            address.city = data.address.village
                        else if(!data.address.city && data.address.town)
                            address.city = data.address.town
                        else if(data.address.city && data.address.city === "Gemeinde Wien")
                            address.city = "Vienna"
                        else if(data.address.city)
                            address.city = data.address.city
                        else
                            address.city = data.address.state

                        address.zip = parseInt(data.address.postcode)
                       
                        this.rootScope.$broadcast('geocode', address, null)
                    } else {
                        this.rootScope.$broadcast('geocode', null, 'Address not found. Please check your address information!')
                    }
                }
            ).error(
                (data: any, status: any) => this.rootScope.$broadcast('geocode', null, 'Address not found. Please check your address information!')
            )
        }

      
    }
}