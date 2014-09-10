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
            address.position.lat = 52.52000659999999
            address.position.lon = 13.404953999999975
            address.zip = 10969
            address.city = "Berlin"
            this.rootScope.$broadcast('geocode', address, null)
            /*this.http.get('http://nominatim.openstreetmap.org/reverse?format=json&addressdetails=1&accept-language=en&lat='
                +address.lat+'&lon='+address.lon, {withCredentials: false}).success(
                (data: any, status: any) => {
                    if(data.length > 0) {
                        address.lat = parseFloat(data[0].lat)
                        address.lon = parseFloat(data[0].lon)

                        if(!data[0].address.city && !data[0].address.town && !data[0].address.village && data[0].address.hamlet)
                            address.city = data[0].address.hamlet
                        else if(!data[0].address.city && !data[0].address.town && data[0].address.village)
                            address.city = data[0].address.village
                        else if(!data[0].address.city && data[0].address.town)
                            address.city = data[0].address.town
                        else if(data[0].address.city && data[0].address.city === "Gemeinde Wien")
                            address.city = "Vienna"
                        else if(data[0].address.city)
                            address.city = data[0].address.city
                        else
                            address.city = data[0].address.state

                        address.zip = parseInt(data[0].address.postcode)

                        console.log(address)
                       
                        this.rootScope.$broadcast('geocode', address, null)
                    } else {
                        this.rootScope.$broadcast('geocode', null, 'Address not found. Please check your address information!')
                    }
                }
            ).error(
                (data: any, status: any) => this.rootScope.$broadcast('geocode', null, 'Address not found. Please check your address information!')
            )*/
        }

      
    }
}