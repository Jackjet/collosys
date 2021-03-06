﻿csapp.factory("distributionPercentageDatalayer", ["Restangular", function (rest) {

    var restApi = rest.all("DistributionPercentageApi");

    var fetchProductWithPerc = function () {
        return restApi.customGET("FetchAllData");
    };

    var save = function (row) {
        return restApi.customPOST(row, "SaveProductPercentage");
    };

    return {
        fetchProductWithPerc: fetchProductWithPerc,
        save: save
    };

}]);

csapp.controller("distributionPercentageCtrl", ["$scope", "distributionPercentageDatalayer", "$csShared", "$csModels", "$timeout","$csnotify",
    function ($scope, datalayer, $csShared, $csModels, $timeout, $csnotify) {

        var getallData = function () {
            datalayer.fetchProductWithPerc().then(function (data) {
                $scope.distributionPercList = data;
                $scope.mode = "";
            });
        };
        (function () {
            $scope.Distribution = { Total: 0 };
            $scope.DistributionPerc = {};
            getallData();
            $scope.DistributionPercentage = $csModels.getColumns("DistributionPerc");
            $scope.showForm = true;
            $scope.$watch(function () {
                return $scope.mode;
            }, function () {
                $scope.showForm = false;
                $timeout(function () {
                    $scope.showForm = true;
                }, 100);
            });
        })();

        $scope.total = function (row) {
            return row.TelecallingInhouse + row.TelecallingExternal + row.FieldInhouse + row.FieldExternal;
        };

        $scope.openinGivenMode = function (mode, row) {
            $scope.mode = mode;
            $scope.DistributionPerc = angular.copy(row);
            $scope.Distribution.Total = $scope.total(row);

        };

        $scope.save = function (row) {
            if ($scope.Distribution.Total === 100) {
                return datalayer.save(row).then(function () {
                    getallData();
                });
            } else {
                $csnotify.error("Total should be exact 100");
            }
        };

        $scope.totalPercentage = function (row) {
            $scope.Distribution.Total = row.TelecallingInhouse + row.TelecallingExternal + row.FieldInhouse + row.FieldExternal;
            if ($scope.Distribution.Total>100) {
                $csnotify.error("Total should be exact 100");
            }
        };

        $scope.cancel = function() {
            $scope.Distribution.Total = 0;
            $scope.DistributionPerc = {};
            $scope.mode = "";
        };
    }]);