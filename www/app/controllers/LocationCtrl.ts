/// <reference path='../_all.ts' />

module app {
    'use strict'

    export class LocationCtrl {

	    private scope: any
      
        static $inject: Array<string> = ['$scope']

        constructor($scope: any) {  
        	$scope.vm = this
        	this.scope = $scope

            this.createMap();
        }

        private createMap(): void {
            angular.extend(this.scope, {
                center: {
                    lat: 52.374004,
                    lng: 4.890359,
                    zoom: 7
                },
                defaults: {
                    scrollWheelZoom: false
                },
                events: {
                    map: {
                        enable: ['zoomstart', 'drag', 'click', 'mousemove', 'focus', 'blur'],
                        logic: 'broadcast'
                    }
                }
            });

            this.scope.$on('leafletDirectiveMap.focus', (event) => {
                this.scope.eventDetected = "focus";
                angular.extend(this.scope, {
                    events: {
                        map: {
                            enable: ['click'],
                            logic: 'broadcast'
                        }
                    }
                });
            });

            this.scope.$on('leafletDirectiveMap.blur', (event) => {
                this.scope.eventDetected = "blur";
                angular.extend(this.scope, {
                    events: {
                        map: {
                            enable: ['click'],
                            logic: 'broadcast'
                        }
                    }
                });
            });

            this.scope.$on('leafletDirectiveMap.drag', (event) => {
                this.scope.eventDetected = "Drag";
            });

            this.scope.$on('leafletDirectiveMap.click', (event) => {
                this.scope.eventDetected = "Click";
            });
        }     
    }
}
