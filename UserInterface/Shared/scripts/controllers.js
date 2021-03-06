﻿
csapp.factory("rootDatalayer", ["Restangular", "$csnotify", "$csfactory", "$csShared", "Logger", "$csModels",
    function (rest, $csnotify, $csfactory, $csShared, logManager, $csModels) {

        var rootapi = rest.all("SharedEnumsApi");
        var menuApi = rest.all("MenuApi");
        var dldata = {};
        var $log = logManager.getInstance("rootDatalayer");

        var getPermission = function (user) {
            return menuApi.customGET("GetPermission", { 'user': user })
                    .then(function (data) {
                        $csShared.menus = data.menus;
                        $csShared.Permissions = data.permissions;
                        return data;
                    });
        };

        var fetchWholeEnums = function () {
            return rootapi.customGET("FetchAllEnum").then(function (data) {
                $csShared.enums = data;
                $log.info("enums loaded.");
                $csModels.init();
                $log.info("models initialized.");
                return data;
            }, function (data) {
                $csnotify.error(data);
            });
        };

        return {
            dldata: dldata,
            fetchWholeEnums: fetchWholeEnums,
            getPermission: getPermission
        };

    }
]);

csapp.factory("routeManagerFactory", [
    "Logger", "$location", "$csAuthFactory", "$route", "$localStorage",
    function (logManager, $location, $csAuthFactory, $route, $localStorage) {

        var $log = logManager.getInstance("RootController");
        var $storage = $localStorage.$default();
        var $locationChangeStart = function () { //evt, next, current
        };

        var $locationChangeSuccess = function () { //evt, next, current
            $log.debug("Changed to location : " + $location.path());
            saveLastLocation();
        };

        var $routeChangeStart = function () {
        };

        var $routeChangeSuccess = function () {
        };

        var saveLastLocation = function () {
            $storage.routelastroute = $location.path(); 
        };

        var getLastLocation = function () {
            var location = $storage.routelastroute;
            if (angular.isUndefined(location) || location === null || location === "")
                location = "/home";
            $log.info("previous location was : " + location);
            return location;
        };


        return {
            getLastLocation: getLastLocation,
            $locationChangeStart: $locationChangeStart,
            $locationChangeSuccess: $locationChangeSuccess,
            $routeChangeStart: $routeChangeStart,
            $routeChangeSuccess: $routeChangeSuccess,
        };
    }
]);

csapp.controller('RootCtrl', ["$scope", "$csAuthFactory", "routeManagerFactory", "$location", "loadingWidget", "rootDatalayer", "Logger", "$csfactory",
    function ($scope, $csAuthFactory, routeManagerFactory, $location, loadingWidget, datalayer, logManager, $csfactory) {

        var $log = logManager.getInstance("RootCtrl");

        $scope.$on("$locationChangeStart", routeManagerFactory.$locationChangeStart);
        $scope.$on("$locationChangeSuccess", routeManagerFactory.$locationChangeSuccess);
        $scope.$on("$routeChangeStart", routeManagerFactory.$routeChangeStart);
        $scope.$on("$routeChangeSuccess", routeManagerFactory.$routeChangeSuccess);

        var redirect = function () {
            if (!$csAuthFactory.hasLoggedIn()) {
                $location.path('/login');
            } else {
                $location.path("/home");
                //$location.path(routeManagerFactory.getLastLocation());
            }
        };

        (function () {
            $scope.$csAuthFactory = $csAuthFactory;
            $scope.loadingWidgetParams = loadingWidget.params;
            $csAuthFactory.loadAuthCookie();
            datalayer.fetchWholeEnums();
            redirect();
        })();


    }
]);


