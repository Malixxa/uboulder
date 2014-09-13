/// <reference path='../_all.ts' />

declare var SERVER

module app {
    'use strict'
    
    export interface IImgUploadScope extends ng.IScope {
        imgvm: ImgUpload
        picture: Media
        upload: any
        onFileSelect: any
    }

    export class ImgUpload {

    	public injection(): any[] {
            return [
                '$http',
                '$window',
                '$upload',
                ($http: ng.IHttpService, $window: ng.IWindowService, $upload: any) => { 
                    return new ImgUpload($http, $window, $upload) 
                }
            ]
        }

    	public link: ($scope: app.IImgUploadScope, element: JQuery, attributes: any) => any
    	public templateUrl: string
    	public restrict: string

        private http: ng.IHttpService
        private window: ng.IWindowService
        private myScope: app.IImgUploadScope

        private loading: boolean = false
        private percentage: number = 0

        private upload: any

    	constructor($http: ng.IHttpService, $window: ng.IWindowService, $upload: any) {
            this.http = $http
            this.window = $window
            this.upload = $upload

	        this.templateUrl = 'partials/templates/imageUpload.html'
	        this.restrict = 'E'

	        this.link = ($scope: app.IImgUploadScope, element: JQuery, attributes: ng.IAttributes) => this.linkFn($scope, element, attributes)
    	}

    	linkFn($scope: app.IImgUploadScope, element: JQuery, attributes: any): any {
            this.myScope = $scope
            this.myScope.imgvm = this
            this.myScope.onFileSelect = ($files) => this.handleUpload($files, element)
        }

        private handleUpload(files: any, element: JQuery) {
            console.log(files)
            this.loading = true
            for (var i = 0; i < files.length; i++) {
                var file = files[i]
                this.myScope.upload = this.upload.upload({
                    url: SERVER+'/upload',
                    method: 'POST',
                    file: file,
                }).progress(
                    (evt) => console.log('percent: ' + 100.0 * evt.loaded / evt.total)
                ).success(
                    (data, status, headers, config) => {
                        console.log(data.url)
                        var url: string = SERVER+"/res/"+data.url
                        this.myScope.picture.url = url
                        this.loading = false
                    }
                ).error(
                    () => this.window.alert("Unfortunately an error occurred. Please try again later.")
                )
            }
        }
    }

}