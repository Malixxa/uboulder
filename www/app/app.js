/// <reference path='../_all.ts' />
/**
* ATTENTION: auto generated file
* changes are overwritten on next run
**/
var app;
(function (app) {
    'use strict';

    var Position = (function () {
        function Position(lat, lon) {
            this.lat = lat;
            this.lon = lon;
        }
        return Position;
    })();
    app.Position = Position;
})(app || (app = {}));
/// <reference path='../_all.ts' />
/**
* ATTENTION: auto generated file
* changes are overwritten on next run
**/
var app;
(function (app) {
    'use strict';

    var Address = (function () {
        function Address(position, zip, city) {
            this.position = position;
            this.zip = zip;
            this.city = city;
        }
        return Address;
    })();
    app.Address = Address;
})(app || (app = {}));
/// <reference path='../_all.ts' />
/**
* ATTENTION: auto generated file
* changes are overwritten on next run
**/
var app;
(function (app) {
    'use strict';

    var Media = (function () {
        function Media(url) {
            this.url = url;
        }
        return Media;
    })();
    app.Media = Media;
})(app || (app = {}));
/// <reference path='../_all.ts' />
/**
* ATTENTION: auto generated file
* changes are overwritten on next run
**/
var app;
(function (app) {
    'use strict';

    var Pricing = (function () {
        function Pricing(description, amount) {
            this.description = description;
            this.amount = amount;
        }
        return Pricing;
    })();
    app.Pricing = Pricing;
})(app || (app = {}));
/// <reference path='../_all.ts' />
/**
* ATTENTION: auto generated file
* changes are overwritten on next run
**/
var app;
(function (app) {
    'use strict';

    var Spot = (function () {
        function Spot(title, active, address, media, pricing, infrastructure, id, description, website) {
            this.title = title;
            this.active = active;
            this.address = address;
            this.media = media;
            this.pricing = pricing;
            this.infrastructure = infrastructure;
            this.id = id;
            this.description = description;
            this.website = website;
        }
        return Spot;
    })();
    app.Spot = Spot;
})(app || (app = {}));
/// <reference path='../_all.ts' />
var app;
(function (app) {
    'use strict';

    var MenuCtrl = (function () {
        function MenuCtrl() {
        }
        MenuCtrl.$inject = [];
        return MenuCtrl;
    })();
    app.MenuCtrl = MenuCtrl;
})(app || (app = {}));
/// <reference path='../_all.ts' />

var app;
(function (app) {
    'use strict';

    var HomeCtrl = (function () {
        function HomeCtrl($scope, $location, $window, offlineService, geoService, spotService) {
            var _this = this;
            this.radius = 3;
            this.lat = 0;
            this.lon = 0;
            this.choose = 0;
            this.phrase = null;
            this.scope = $scope;
            this.scope.vm = this;
            this.location = $location;
            this.window = $window;
            this.offlineService = offlineService;
            this.geoService = geoService;
            this.spotService = spotService;
            this.cities = CITIES;

            this.geoService.current().then(function (data) {
                _this.lat = data.coords.latitude;
                _this.lon = data.coords.longitude;
                _this.loadNearby();
            });

            this.window.onscroll = function (ev) {
                var height = $(window).innerHeight() + $(window).scrollTop();
                var doc = $(document).height();
                if ((height + 200 >= doc) && _this.spotService.showLoad && !_this.spotService.loading && _this.spotService.offset >= 10) {
                    if (_this.choose == 0)
                        _this.spotService.loadNearby(_this.lat, _this.lon, _this.radius);
                    else
                        _this.spotService.loadByCity(_this.phrase);
                }
            };
        }
        HomeCtrl.prototype.reset = function () {
            this.spotService.reset();
            if (this.choose == 0)
                this.loadNearby();
            else
                this.loadByCity();
        };

        HomeCtrl.prototype.parseRadius = function () {
            this.radius = parseInt(this.radius.toString());
        };

        HomeCtrl.prototype.redirect = function (id) {
            this.location.path('/app/spot/' + id);
        };

        HomeCtrl.prototype.loadByCity = function () {
            this.spotService.loadByCity(this.phrase);
        };

        HomeCtrl.prototype.loadNearby = function () {
            this.spotService.loadNearby(this.lat, this.lon, this.radius);
        };
        HomeCtrl.$inject = [
            '$scope', '$location', '$window',
            'offlineService', 'geoService', 'spotService'];
        return HomeCtrl;
    })();
    app.HomeCtrl = HomeCtrl;
})(app || (app = {}));
/// <reference path='../_all.ts' />

var app;
(function (app) {
    'use strict';

    var EditSpotCtrl = (function () {
        function EditSpotCtrl($scope, $stateParams, $http, $location, $window, $timeout, geoService, offlineService) {
            this.media = new Array();
            this.pricing = new Array();
            this.loading = false;
            this.edit = false;
            this.pointSet = false;
            $scope.vm = this;
            this.scope = $scope;
            this.http = $http;
            this.location = $location;
            this.window = $window;
            this.timeout = $timeout;
            this.geoService = geoService;
            this.offlineService = offlineService;
            this.infrastructure = INFRASTRUCTURE;

            if (this.offlineService.isOnline()) {
                var id = ($stateParams.id || "new");

                if (id === "new")
                    this.createSpot();
                else
                    this.loadSpot(id);
            } else {
                this.location.path('/app/offline');
            }
        }
        EditSpotCtrl.prototype.addMedia = function () {
            this.media.push(new app.Media(null));
        };

        EditSpotCtrl.prototype.deleteMedia = function (index) {
            this.media.splice(index, 1);
        };

        EditSpotCtrl.prototype.addPricing = function () {
            this.pricing.push(new app.Pricing(null, 0));
        };

        EditSpotCtrl.prototype.deletePricing = function (index) {
            this.pricing.splice(index, 1);
        };

        EditSpotCtrl.prototype.showSummary = function () {
            this.loading = true;
            if (this.edit)
                this.save();
            else
                this.insert();
        };

        EditSpotCtrl.prototype.toggleInfrastructure = function (elem) {
            var index = this.spot.infrastructure.indexOf(elem);
            if (index >= 0) {
                this.spot.infrastructure.splice(index, 1);
                return false;
            } else {
                this.spot.infrastructure.push(elem);
                return true;
            }
        };

        EditSpotCtrl.prototype.insert = function () {
            var _this = this;
            this.loading = true;
            this.handleMedias();
            this.handlePricings();

            this.http.post(jsRoutes.controllers.Application.createSpot().absoluteURL(), this.spot).success(function (data, status) {
                _this.spot = data;
                _this.location.path('/app/spot/' + _this.spot.id);
            }).error(function (data, status) {
                _this.loading = false;
            });
        };

        EditSpotCtrl.prototype.save = function () {
            var _this = this;
            this.loading = true;
            this.handleMedias();
            this.handlePricings();

            this.http.put(jsRoutes.controllers.Application.updateSpot().absoluteURL(), this.spot).success(function (data, status) {
                _this.spot = data;
                _this.location.path('/app/spot/' + _this.spot.id);
            }).error(function (data, status) {
            });
        };

        EditSpotCtrl.prototype.handleMedias = function () {
            for (var i = this.media.length; i--;) {
                if (!this.media[i].url) {
                    this.media.splice(i, 1);
                }
            }
            this.spot.media = this.spot.media.concat(this.media);
        };

        EditSpotCtrl.prototype.handlePricings = function () {
            for (var i = this.pricing.length; i--;) {
                if (!this.pricing[i].description) {
                    this.pricing.splice(i, 1);
                }
            }
            this.spot.pricing = this.spot.pricing.concat(this.pricing);
        };

        EditSpotCtrl.prototype.createSpot = function () {
            this.edit = false;
            this.spot = new app.Spot(null, false, null, new Array(), new Array(), new Array());
            this.spot.address = new app.Address(new app.Position(0, 0), 0, null);
            this.createMap();
        };

        EditSpotCtrl.prototype.loadSpot = function (id) {
            var _this = this;
            this.edit = true;
            this.pointSet = true;
            this.http.get(jsRoutes.controllers.Application.retrieveSpot(id).absoluteURL()).success(function (data, status) {
                _this.spot = data;
                console.log(_this.spot);
                if (!_this.spot)
                    _this.location.path('/app/404').replace();
            }).error(function (data, status) {
                _this.location.path('/app/404').replace();
            });
        };

        EditSpotCtrl.prototype.createMap = function () {
            var _this = this;
            var mapOptions = {
                center: { lat: 48.20817400000001, lng: 16.373819 },
                zoom: 15
            };
            var marker = null;

            this.geoService.current().then(function (data) {
                map.setCenter(new google.maps.LatLng(data.coords.latitude, data.coords.longitude));
            });

            var map = new google.maps.Map(document.getElementById('map'), mapOptions);

            google.maps.event.addListener(map, 'click', function (event) {
                var lat = event.latLng.lat();
                var lng = event.latLng.lng();

                _this.spot.address.position.lat = lat;
                _this.spot.address.position.lon = lng;
                _this.timeout(function () {
                    return _this.pointSet = true;
                });

                _this.geocode(event.latLng);

                if (marker == null) {
                    marker = new google.maps.Marker({ position: event.latLng, map: map });
                } else {
                    marker.setPosition(event.latLng);
                }
            });
        };

        EditSpotCtrl.prototype.geocode = function (latlng) {
            var _this = this;
            var geocoder = new google.maps.Geocoder();
            geocoder.geocode({ 'latLng': latlng }, function (results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    if (results.length > 0) {
                        results[0].address_components.forEach(function (elem, index, array) {
                            elem.types.forEach(function (tpe, idx, arr) {
                                if (tpe == "postal_code")
                                    _this.spot.address.zip = parseInt(elem.long_name);
                                if (tpe == "locality")
                                    _this.spot.address.city = elem.long_name;
                            });
                        });
                    } else {
                        _this.pointSet = false;
                    }
                }
            });
        };
        EditSpotCtrl.$inject = [
            '$scope', '$stateParams', '$http', '$location',
            '$window', '$timeout', 'geoService', 'offlineService'];
        return EditSpotCtrl;
    })();
    app.EditSpotCtrl = EditSpotCtrl;
})(app || (app = {}));
/// <reference path='../_all.ts' />

var app;
(function (app) {
    'use strict';

    var SpotCtrl = (function () {
        function SpotCtrl($scope, $http, $location, $stateParams, $sce, $window, offlineService) {
            var _this = this;
            this.hasImage = false;
            this.slideIndex = 0;
            this.finished = false;
            this.scope = $scope;
            this.scope.vm = this;
            this.http = $http;
            this.location = $location;
            this.window = $window;
            this.sce = $sce;
            this.offlineService = offlineService;

            this.oratio = this.sce.trustAsResourceUrl('//www.orat.io/js/widget/stmt.inc.min.js');

            this.loadSpot($stateParams.id || "0");

            this.scope.$on('online', function (e) {
                _this.loadFinish();
            });
        }
        SpotCtrl.prototype.loadSpot = function (id) {
            var _this = this;
            localforage.getItem(id, function (spot) {
                _this.spot = spot;
                if (_this.spot) {
                    // send request when online, to update pageViews!
                    if (_this.offlineService.isOnline()) {
                        _this.http.get(jsRoutes.controllers.Application.retrieveSpot(id).absoluteURL()).success(function (data, status) {
                            var spot = data;
                            localforage.setItem(spot.id, spot);
                        }).error(function (data, status) {
                            // remove if doesn't exist anymore
                            localforage.removeItem(spot.id);
                            _this.location.path('/app/404');
                        });
                    }
                    _this.loadFinish();
                } else
                    _this.loadRemote(id);
            });
        };

        SpotCtrl.prototype.loadRemote = function (id) {
            var _this = this;
            this.http.get(jsRoutes.controllers.Application.retrieveSpot(id).absoluteURL()).success(function (data, status) {
                if (data) {
                    _this.spot = data;
                    if (_this.spot.active)
                        _this.loadFinish();
                    else
                        _this.location.path('/app/404');
                } else {
                    _this.location.path('/app/404').replace();
                }
            }).error(function (data, status) {
                _this.location.path('/app/404').replace();
            });
        };

        SpotCtrl.prototype.loadFinish = function () {
            this.checkImages();
            this.loadMap();
        };

        SpotCtrl.prototype.checkImages = function () {
            if (this.spot.media && this.spot.media.length > 0)
                this.hasImage = true;
        };

        SpotCtrl.prototype.loadMap = function () {
            var lat = this.spot.address.position.lat;
            var lng = this.spot.address.position.lon;

            var map = L.map('map').setView([lat, lng], 13);

            L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
                maxZoom: 18
            }).addTo(map);

            L.marker([lat, lng]).addTo(map);
        };
        SpotCtrl.$inject = [
            '$scope', '$http', '$location',
            '$stateParams', '$sce', '$window', 'offlineService'];
        return SpotCtrl;
    })();
    app.SpotCtrl = SpotCtrl;
})(app || (app = {}));
/// <reference path='../_all.ts' />
var app;
(function (app) {
    'use strict';

    var GeoService = (function () {
        function GeoService($rootScope, $http, geolocation) {
            this.rootScope = $rootScope;
            this.http = $http;
            this.geolocation = geolocation;
        }
        GeoService.prototype.current = function () {
            return this.geolocation.getLocation();
        };

        GeoService.prototype.geocode = function (address) {
            var _this = this;
            this.http.get('http://nominatim.openstreetmap.org/reverse?format=json&addressdetails=1&accept-language=en&lat=' + address.position.lat + '&lon=' + address.position.lon, { withCredentials: false }).success(function (data, status) {
                if (data && data.address) {
                    if (!data.address.city && !data.address.town && !data.address.village && data.address.hamlet)
                        address.city = data.address.hamlet;
                    else if (!data.address.city && !data.address.town && data.address.village)
                        address.city = data.address.village;
                    else if (!data.address.city && data.address.town)
                        address.city = data.address.town;
                    else if (data.address.city && data.address.city === "Gemeinde Wien")
                        address.city = "Vienna";
                    else if (data.address.city)
                        address.city = data.address.city;
                    else
                        address.city = data.address.state;

                    address.zip = parseInt(data.address.postcode);

                    _this.rootScope.$broadcast('geocode', address, null);
                } else {
                    _this.rootScope.$broadcast('geocode', null, 'Address not found. Please check your address information!');
                }
            }).error(function (data, status) {
                return _this.rootScope.$broadcast('geocode', null, 'Address not found. Please check your address information!');
            });
        };
        GeoService.$inject = ['$rootScope', '$http', 'geolocation'];
        return GeoService;
    })();
    app.GeoService = GeoService;
})(app || (app = {}));
/// <reference path='../_all.ts' />
var app;
(function (app) {
    'use strict';

    var OfflineService = (function () {
        function OfflineService($rootScope) {
            this.offline = false;
            this.rootScope = $rootScope;
        }
        OfflineService.prototype.setOnline = function () {
            $("#offline").hide();
            var wasOffline = this.offline;
            this.offline = false;
            if (wasOffline)
                this.rootScope.$broadcast('online');
        };

        OfflineService.prototype.setOffline = function () {
            $("#offline").show();
            var wasOnline = !this.offline;
            this.offline = true;
            if (wasOnline)
                this.rootScope.$broadcast('offline');
        };

        OfflineService.prototype.isOnline = function () {
            return !this.offline;
        };

        OfflineService.prototype.isOffline = function () {
            return this.offline;
        };
        OfflineService.$inject = ['$rootScope'];
        return OfflineService;
    })();
    app.OfflineService = OfflineService;
})(app || (app = {}));
/// <reference path='../_all.ts' />
var app;
(function (app) {
    'use strict';

    var SpotService = (function () {
        function SpotService($rootScope, $http, $timeout, offlineService) {
            this.spots = new Array();
            this.loading = false;
            this.showLoad = false;
            this.offset = 0;
            this.rootScope = $rootScope;
            this.http = $http;
            this.timeout = $timeout;
            this.offlineService = offlineService;
        }
        SpotService.prototype.loadByCity = function (phrase) {
            var _this = this;
            this.loading = true;
            this.http.get(jsRoutes.controllers.Application.findByCity(phrase, this.offset).absoluteURL()).success(function (data, status) {
                _this.spots = _this.spots.concat(data);
                _this.offset += 10;
                _this.loading = false;
                _this.offlineService.setOnline();
                _this.saveOffline();
                if (_this.spots.length == _this.offset)
                    _this.showLoad = true;
            }).error(function (data, status) {
                _this.loading = false;
                _this.offlineService.setOffline();
                _this.loadOffline();
            });
        };

        SpotService.prototype.loadNearby = function (lat, lon, radius) {
            var _this = this;
            this.loading = true;
            this.http.get(jsRoutes.controllers.Application.findNearby(lat, lon, radius * 1000, this.offset).absoluteURL()).success(function (data, status) {
                _this.spots = _this.spots.concat(data);
                _this.offset += 10;
                _this.loading = false;
                _this.offlineService.setOnline();
                _this.saveOffline();
                if (_this.spots.length == _this.offset)
                    _this.showLoad = true;
            }).error(function (data, status) {
                _this.loading = false;
                _this.offlineService.setOffline();
                _this.loadOffline();
            });
        };

        SpotService.prototype.reset = function () {
            this.offset = 0;
            this.spots = new Array();
        };

        SpotService.prototype.loadOffline = function () {
            var _this = this;
            this.showLoad = false;
            for (var i = 0; i < 10; i++) {
                var spot = localforage.getItem('spot-' + i, function (spot) {
                    if (spot)
                        _this.timeout(function () {
                            return _this.spots.push(spot);
                        });
                });
            }
        };

        SpotService.prototype.saveOffline = function () {
            this.spots.forEach(function (elem, index, array) {
                localforage.setItem("spot-" + index, elem);
            });
        };
        SpotService.$inject = ['$rootScope', '$http', '$timeout', 'offlineService'];
        return SpotService;
    })();
    app.SpotService = SpotService;
})(app || (app = {}));
/// <reference path='../_all.ts' />

var app;
(function (app) {
    'use strict';

    var ImgUpload = (function () {
        function ImgUpload($http, $window, $upload) {
            var _this = this;
            this.loading = false;
            this.percentage = 0;
            this.http = $http;
            this.window = $window;
            this.upload = $upload;

            this.templateUrl = 'partials/templates/imageUpload.html';
            this.restrict = 'E';

            this.link = function ($scope, element, attributes) {
                return _this.linkFn($scope, element, attributes);
            };
        }
        ImgUpload.prototype.injection = function () {
            return [
                '$http',
                '$window',
                '$upload',
                function ($http, $window, $upload) {
                    return new ImgUpload($http, $window, $upload);
                }
            ];
        };

        ImgUpload.prototype.linkFn = function ($scope, element, attributes) {
            var _this = this;
            this.myScope = $scope;
            this.myScope.imgvm = this;
            this.myScope.onFileSelect = function ($files) {
                return _this.handleUpload($files, element);
            };
        };

        ImgUpload.prototype.handleUpload = function (files, element) {
            var _this = this;
            this.loading = true;
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                this.myScope.upload = this.upload.upload({
                    url: SERVER + '/upload',
                    method: 'POST',
                    file: file
                }).progress(function (evt) {
                    return console.log('percent: ' + 100.0 * evt.loaded / evt.total);
                }).success(function (data, status, headers, config) {
                    console.log(data.url);
                    var url = SERVER + "/res/" + data.url;
                    _this.myScope.picture.url = url;
                    _this.loading = false;
                }).error(function () {
                    return console.log("error on img upload");
                });
            }
        };
        return ImgUpload;
    })();
    app.ImgUpload = ImgUpload;
})(app || (app = {}));
/// <reference path='../_all.ts' />
var app;
(function (app) {
    'use strict';

    var Widget = (function () {
        function Widget($timeout) {
            var _this = this;
            this.templateUrl = 'partials/templates/widget.html';
            this.restrict = 'E';
            this.scope = {
                spot: '=spot'
            };

            this.timeout = $timeout;

            this.link = function ($scope, element, attributes) {
                return _this.linkFn($scope, element, attributes);
            };
        }
        Widget.prototype.injection = function () {
            return [
                '$timeout',
                function ($timeout) {
                    return new Widget($timeout);
                }
            ];
        };

        Widget.prototype.linkFn = function ($scope, element, attributes) {
            localforage.setItem($scope.spot.id, $scope.spot);

            this.evaluate($scope);
        };

        Widget.prototype.evaluate = function ($scope) {
            if ($scope.spot.media.length > 0) {
                $scope.spot.hasImage = true;
                $scope.spot.image = $scope.spot.media[0].url;
            } else
                $scope.spot.hasImage = false;

            if ($scope.spot.pricing.length >= 1) {
                $scope.spot.min = $scope.spot.pricing[0].amount;
                $scope.spot.max = $scope.spot.pricing[0].amount;
                $scope.spot.pricing.forEach(function (elem, index, array) {
                    if (elem.amount < $scope.spot.min)
                        $scope.spot.min = elem.amount;
                    if (elem.amount > $scope.spot.max)
                        $scope.spot.max = elem.amount;
                });
            }
        };
        return Widget;
    })();
    app.Widget = Widget;
})(app || (app = {}));
/// <reference path='../_all.ts' />
var app;
(function (app) {
    'use strict';

    var WidgetImg = (function () {
        function WidgetImg($timeout) {
            var _this = this;
            this.timeout = $timeout;
            this.templateUrl = 'partials/templates/widgetImg.html';
            this.restrict = 'E';

            this.link = function ($scope, element, attributes) {
                return _this.linkFn($scope, element, attributes);
            };
        }
        WidgetImg.prototype.injection = function () {
            return [
                '$timeout',
                function ($timeout) {
                    return new WidgetImg($timeout);
                }
            ];
        };

        WidgetImg.prototype.linkFn = function ($scope, element, attributes) {
            this.handleResize($scope);
        };

        WidgetImg.prototype.handleResize = function ($scope) {
            $scope.width = $("#spot-images").width();
            $scope.height = Math.round($scope.width / 2);
        };
        return WidgetImg;
    })();
    app.WidgetImg = WidgetImg;
})(app || (app = {}));
/// <reference path='_all.ts' />

var app;
(function (app) {
    'use strict';

    var ub = angular.module('ub', [
        'ngRoute', 'ngResource', 'ionic',
        'ng-back', 'angularFileUpload', 'filters', 'angular-carousel', 'angulartics',
        'angulartics.google.analytics', 'pascalprecht.translate',
        'geolocation']);

    ub.run(function ($ionicPlatform) {
        $ionicPlatform.ready(function () {
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if (window.StatusBar) {
                StatusBar.styleDefault();
            }
        });
    });

    ub.controller('homeCtrl', app.HomeCtrl);
    ub.controller('menuCtrl', app.MenuCtrl);
    ub.controller('editSpotCtrl', app.EditSpotCtrl);
    ub.controller('spotCtrl', app.SpotCtrl);

    ub.service('geoService', app.GeoService);
    ub.service('offlineService', app.OfflineService);
    ub.service('spotService', app.SpotService);

    ub.directive('imgUpload', app.ImgUpload.prototype.injection());
    ub.directive('widget', app.Widget.prototype.injection());
    ub.directive('widgetImg', app.WidgetImg.prototype.injection());

    ub.config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider.state('app', {
            url: "/app",
            abstract: true,
            templateUrl: "partials/menu.html",
            controller: "menuCtrl"
        }).state('app.home', {
            url: "/home",
            views: {
                'menuContent': {
                    templateUrl: "partials/home.html",
                    controller: 'homeCtrl'
                }
            }
        }).state('app.new', {
            url: "/new",
            views: {
                'menuContent': {
                    templateUrl: "partials/new.html",
                    controller: 'editSpotCtrl'
                }
            }
        }).state('app.edit', {
            url: "/edit/:id",
            views: {
                'menuContent': {
                    templateUrl: "partials/new.html",
                    controller: 'editSpotCtrl'
                }
            }
        }).state('app.spot', {
            url: "/spot/:id",
            views: {
                'menuContent': {
                    templateUrl: "partials/spot.html",
                    controller: 'spotCtrl'
                }
            }
        }).state('app.404', {
            url: "/404",
            views: {
                'menuContent': {
                    templateUrl: "partials/404.html"
                }
            }
        }).state('app.offline', {
            url: "/offline",
            views: {
                'menuContent': {
                    templateUrl: "partials/offline.html"
                }
            }
        }).state('app.about', {
            url: "/about",
            views: {
                'menuContent': {
                    templateUrl: "partials/footer/about.html"
                }
            }
        }).state('app.terms', {
            url: "/terms",
            views: {
                'menuContent': {
                    templateUrl: "partials/footer/terms.html"
                }
            }
        });

        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/app/home');
    });

    // ub.config(['$routeProvider', function($routeProvider: ng.route.IRouteProvider) {
    //     $routeProvider.
    //         when('/new', {templateUrl: 'partials/new.html', controller: 'editSpotCtrl'}).
    //       otherwise({redirectTo: '/new'})
    //   }])
    ub.config([
        '$translateProvider', function ($translateProvider) {
            $translateProvider.useStaticFilesLoader({
                prefix: 'app/languages/',
                suffix: '.json'
            }).preferredLanguage(LANGUAGE);
        }]);

    ub.run([
        '$rootScope', '$http', 'offlineService', function ($rootScope, $http, offlineService) {
            $rootScope.$on('$stateChangeStart', function (event, next, current) {
                $http.get(SERVER + "/ping").success(function (data, status) {
                    offlineService.setOnline();
                }).error(function (data, status) {
                    offlineService.setOffline();
                });
            });
        }]);
})(app || (app = {}));
/// <reference path='typings/tsd.d.ts' />
/// <reference path='models/Position.ts' />
/// <reference path='models/Address.ts' />
/// <reference path='models/Media.ts' />
/// <reference path='models/Pricing.ts' />
/// <reference path='models/Spot.ts' />
/// <reference path='controllers/MenuCtrl.ts' />
/// <reference path='controllers/HomeCtrl.ts' />
/// <reference path='controllers/EditSpotCtrl.ts' />
/// <reference path='controllers/SpotCtrl.ts' />
/// <reference path='services/GeoService.ts' />
/// <reference path='services/OfflineService.ts' />
/// <reference path='services/SpotService.ts' />
/// <reference path='directives/ImgUpload.ts' />
/// <reference path='directives/Widget.ts' />
/// <reference path='directives/WidgetImg.ts' />
/// <reference path='app.ts' />
