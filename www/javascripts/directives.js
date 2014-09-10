// #####----- START: ng-back directive -----#####
var app = angular.module('ng-back', []);
app.directive('ngBack', function () {
    return {
        restrict: 'A',
        template: '<a class="btn btn-default btn-sm"><i class="ion-chevron-left"></i></a>',
        scope: {
            icons: '@icons'
        },
        link: function(scope, element, attrs) {
            $(element[0]).on('click', function() {
                history.back();
                scope.$apply();
            });
        }
    };
});
// #####----- END: ng-back directive -----#####

// #####----- START: ng-truncate directive -----#####
angular.module('filters', []).
    filter('truncate', function () {
        return function (text, length, end) {
            if (isNaN(length))
                length = 10;

            if (end === undefined)
                end = "...";

            if(text) {
                if (text.length <= length || text.length - end.length <= length) {
                    return text;
                }
                else {
                    return String(text).substring(0, length-end.length) + end;
                }
            }
        };
    });
// #####----- END: ng-truncate directive -----#####

// #####----- START: localforage force localstorage -----##### 
localforage.setDriver('localStorageWrapper');
// #####----- END: localforage -----#####