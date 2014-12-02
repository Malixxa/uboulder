/// <reference path='../_all.ts' />

module app {
    'use strict'

    declare var localforage: lf.ILocalForage<app.Spot>

    export class SpotService {

        static $inject: Array<string> = ['$rootScope','$http','$timeout','offlineService']

        public spots: Array<Spot> = new Array<Spot>()
        public loading: boolean = false
        public showLoad: boolean = false
        public offset: number = 0
        
        private rootScope: ng.IRootScopeService
        private http: ng.IHttpService
        private timeout: ng.ITimeoutService
        private offlineService: app.OfflineService
        
        

    	constructor($rootScope: ng.IRootScopeService, $http: ng.IHttpService,
            $timeout: ng.ITimeoutService, offlineService: app.OfflineService) {
            this.rootScope = $rootScope
            this.http = $http
            this.timeout = $timeout
            this.offlineService = offlineService
        }

        public loadByCity(phrase: string): void {
            this.loading = true
            this.http.get(jsRoutes.controllers.Application.findByCity(phrase, this.offset).absoluteURL()).success(
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

        public loadNearby(lat: number, lon: number, radius: number): void {
            this.loading = true
            this.http.get(jsRoutes.controllers.Application.findNearby(lat, lon, radius*1000, this.offset).absoluteURL()).success(
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

        public reset(): void {
            this.offset = 0
            this.spots = new Array<Spot>()
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