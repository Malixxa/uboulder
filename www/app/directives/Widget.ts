/// <reference path='../_all.ts' />

module app {
    'use strict'    

    declare var localforage: lf.ILocalForage<app.Spot> 

    export class Widget {

        public link: ($scope: any, element: JQuery, attributes: any) => any
        public templateUrl: string
        public restrict: string
        public scope: any

        private timeout: ng.ITimeoutService

    	public injection(): Array<any> {
            return [
                '$timeout',
                ($timeout: ng.ITimeoutService) => { 
                    return new Widget($timeout) 
                }
            ]
        }

    	constructor($timeout: ng.ITimeoutService) {
	        this.templateUrl = 'partials/templates/widget.html'
	        this.restrict = 'E'
            this.scope = {
                spot:'=spot'
            }

            this.timeout = $timeout

	        this.link = ($scope: any, element: JQuery, attributes: ng.IAttributes) => this.linkFn($scope, element, attributes)
    	}

    	linkFn($scope: any, element: JQuery, attributes: any): void {
            localforage.setItem($scope.spot.id, $scope.spot)

            this.evaluate($scope)      
        }

        private evaluate($scope: any) {             
            if($scope.spot.media.length > 0) {
                $scope.spot.hasImage = true
                $scope.spot.image = $scope.spot.media[0].url
            } else
                $scope.spot.hasImage = false

            if($scope.spot.pricing.length >= 1) {
                $scope.spot.min = $scope.spot.pricing[0].amount
                $scope.spot.max = $scope.spot.pricing[0].amount
                $scope.spot.pricing.forEach(
                    (elem: Pricing, index: number, array: Array<Pricing>) => {
                        if(elem.amount < $scope.spot.min) $scope.spot.min = elem.amount
                        if(elem.amount > $scope.spot.max) $scope.spot.max = elem.amount
                    }
                )
            }
        }
    }

}