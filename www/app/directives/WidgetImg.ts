/// <reference path='../_all.ts' />

module app {
    'use strict';

    export class WidgetImg {

    	public injection(): any[] {
            return [
                '$timeout',
                ($timeout: ng.ITimeoutService) => { 
                    return new WidgetImg($timeout) 
                }
            ]
        }

    	public link: ($scope: any, element: JQuery, attributes: any) => any
        public templateUrl: string
    	public restrict: string
        public scope: any

        private timeout: ng.ITimeoutService
        private parent: any

    	constructor($timeout: ng.ITimeoutService) {
            this.timeout = $timeout
	        this.templateUrl = 'partials/templates/widgetImg.html'
	        this.restrict = 'E'

	        this.link = ($scope: any, element: JQuery, attributes: ng.IAttributes) => this.linkFn($scope, element, attributes)
    	}

    	linkFn($scope: any, element: JQuery, attributes: any): any {
            this.handleResize($scope) 
        }

        private handleResize($scope: any) {
            $scope.width = $("#spot-images").width()
            $scope.height = Math.round($scope.width/2)
        }

    }

}