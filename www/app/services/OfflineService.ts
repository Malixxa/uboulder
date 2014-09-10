/// <reference path='../_all.ts' />

module app {
    'use strict'

    export class OfflineService {

        static $inject: Array<string> = ['$rootScope']

        private rootScope: ng.IRootScopeService
    	private offline: boolean = true

    	constructor($rootScope: ng.IRootScopeService) {
            this.rootScope = $rootScope
        }

        public setOnline() {
            $("#offline").hide()
            var wasOffline = this.offline
            this.offline = false
            if(wasOffline)
                this.rootScope.$broadcast('online')
        }

        public setOffline(): void {
            $("#offline").show()
            var wasOnline = !this.offline
            this.offline = true
            if(wasOnline)
                this.rootScope.$broadcast('offline')
        }

        public isOnline(): boolean {
            return !this.offline
        }

        public isOffline(): boolean {
            return this.offline
        }
    }
}