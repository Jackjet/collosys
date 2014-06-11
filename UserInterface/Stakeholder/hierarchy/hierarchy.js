﻿csapp.factory("hierarchyDataLayer", ['Restangular', '$csnotify', function (rest, $csnotify) {

    var dldata = {};

    var apiCalls = rest.all('HierarchyApi');

    var setHierarchy = function (hierarchy, hierarchyList) {
        hierarchy.ReportsToName = _.find(hierarchyList, { 'Id': hierarchy.ReportsTo });
        hierarchy.WorkingReportsToName = _.find(hierarchyList, { 'Id': hierarchy.WorkingReportsTo });
        hierarchy.LocationLevel = JSON.parse(hierarchy.LocationLevel);
    };

    var getAllHierarchy = function () {
        return apiCalls.customGET('GetAllHierarchies').then(function (data) {
            dldata.HierarchyList = data;
            dldata.HierarchyData = _.uniq(_.pluck(data, 'Hierarchy'));
            _.forEach(dldata.HierarchyList, function (item) {
                setHierarchy(item, dldata.HierarchyList);
            });
            getReportee();
        }, function () {
            $csnotify.error('Error loading hierarchies');
        });
    };

    var getReportee = function () {
        return apiCalls.customGET('GetReportingLevel').then(function (data) {
            dldata.ReportingLevelEnum = data;
        }, function () {
            $csnotify.error('Error loading Reporting level');
        });

    };

    var saveUpdatedData = function (stkh) {
        stkh.ApplicationName = 'ColloSys';
       // stkh.PositionLevel = stkh.PositionLevel;
        stkh.LocationLevel = JSON.stringify(stkh.LocationLevel);
        return apiCalls.customPOST(stkh, 'SaveHierarchy').then(function (data) {
            $csnotify.success('Data Saved');
            setHierarchy(data, dldata.HierarchyList);
            var index = _.indexOf(_.pluck(dldata.HierarchyList, 'Id'), data.Id);
            if (index !== -1) dldata.HierarchyList[index] = data;
            //return data;
        }, function () {
            $csnotify.error('error in saving hierarchy');
        });
    };

    var gethierarchy = function (detailsid) {
        return apiCalls.customGET('Get', { id: detailsid })
            .then(function (data) {
                return data;
            }, function () {
                $csnotify.error('Error loading hierarchies');
            });
    };

    return {
        dldata: dldata,
        GetAll: getAllHierarchy,
        Save: saveUpdatedData,
        Get: gethierarchy,
    };
}]);

csapp.factory("hierarchyFactory", ["$csfactory", "hierarchyDataLayer", function ($csfactory, datalayer) {



    var initLocationLevelList = function (dldata) {
        dldata.LocationlevelList = [{ key: 'Pincode', value: 'Pincode' },
                                         { key: 'Area', value: 'Area' },
                                         { key: 'City', value: 'City' },
                                         { key: 'District', value: 'District' },
                                         { key: 'Cluster(MultiDistrict)', value: 'Cluster' },
                                         { key: 'State', value: 'State' },
                                         { key: 'Region(Multistate)', value: 'Region' },
                                         { key: 'Country', value: 'Country' },
                                         { key: 'MultiCountry', value: 'MultiCountry' }];
    };

    var resetPaymentChlidVal = function (stakeholder) {
        stakeholder.HasBankDetails = false;
        stakeholder.HasMobileTravel = false;
        stakeholder.HasVariable = false;
        stakeholder.HasFixed = false;
        stakeholder.HasServiceCharge = false;
    };

    var resetBtnValue = function (stakeholder) {
        stakeholder.HasBuckets = false;
        stakeholder.IsInAllocation = false;

    };


    var reloadReportsTo = function (stakeholder, dldata) {
        dldata.Designation = [];

        dldata.HierarchyList = _.sortBy(dldata.HierarchyList, 'PositionLevel');
        if (!$csfactory.isNullOrEmptyArray(dldata.HierarchyList)) {
            if ((stakeholder.Hierarchy !== 'External')) {//|| (hierarchy.IsIndividual === false
                dldata.Designation = _.filter(dldata.HierarchyList, function (data) {
                    if (data.Hierarchy === stakeholder.Hierarchy) return data;
                });
                //$scope.$parent.stakeholderModels.designation.valueList = $scope.Designation;

                dldata.highestPositionLevel = _.max(dldata.Designation, function (row) { return row.PositionLevel });
                console.log(dldata.highestPositionLevel);
            } else {

                var design = _.filter(dldata.HierarchyList, function (data) {
                    return (data.Hierarchy === stakeholder.Hierarchy);
                });

                _.forEach(design, function (item) {
                    var reportTo = _.find(dldata.HierarchyList, { 'Id': item.ReportsTo });
                    var desig = {
                        Designation: angular.copy(item.Designation) + '(' + reportTo.Designation + ')',
                        Id: item.Id
                    };
                    dldata.Designation.push(desig);
                });
                //$scope.$parent.stakeholderModels.designation.valueList = $scope.Designation;
            }
        }



    };

    var designationName = function (hierarchy) {
        if (!$csfactory.isEmptyObject(hierarchy)) {
            if ((hierarchy.Hierarchy !== 'External') || (hierarchy.IsIndividual === false)) {
                return hierarchy.Designation;
            } else {
                var reportTo = _.find(datalayer.dldata.HierarchyList, { 'Id': hierarchy.ReportsTo });
                return hierarchy.Designation + ' (' + reportTo.Designation + ')';
            }
        }
        return '';
    };

    var setHierarchy = function (hierarchy, hierarchyList) {
        hierarchy.ReportsToName = _.find(hierarchyList, { 'Id': item.ReportsTo });
        hierarchy.WorkingReportsToName = _.find(hierarchyList, { 'Id': item.WorkingReportsTo });
        hierarchy.LocationLevel = JSON.parse(item.LocationLevel);
    };
    return {
        initLocationLevelList: initLocationLevelList,
        resetPaymentChlidVal: resetPaymentChlidVal,
        ResetBtnValue: resetBtnValue,
        reloadReportsTo: reloadReportsTo,
        DesignationName: designationName,
        setHierarchy: setHierarchy
    };
}]);

csapp.controller('hierarchyController', ['$scope', '$csfactory',
    'hierarchyDataLayer', "hierarchyFactory", "$location",
    function ($scope, $csfactory, datalayer, factory, $location) {

        (function () {
            $scope.datalayer = datalayer;
            $scope.dldata = datalayer.dldata;
            $scope.factory = factory;
            factory.initLocationLevelList(datalayer.dldata);
            datalayer.GetAll();
        })();



        $scope.openEditModal = function (mode, hierarchy) {
            if (mode === "edit" || mode === "view") {
                $location.path("/generic/hierarchy/addedit/" + mode + "/" + hierarchy.Id);
            } else {
                $location.path("/generic/hierarchy/addedit/" + mode);
            }

        };
    }]);


csapp.controller("hierarchyEditController", ["$scope", "$routeParams",
    "hierarchyDataLayer", "$csModels", "hierarchyFactory", "$location",
    function ($scope, $routeParams, datalayer, $csModels, factory, $location) {

        (function () {
            $scope.factory = factory;
            if (angular.isDefined($routeParams.id)) {
                datalayer.Get($routeParams.id).then(function(data) {
                    $scope.hierarchy = data;
                });
            } else {
                $scope.hierarchy = {};
            }
            $scope.hierarchy = datalayer.hierarchy;
            $scope.datalayer = datalayer;
            $scope.dldata = datalayer.dldata;
            $scope.hierarchyfield = $csModels.getColumns("StkhHierarchy");
            $scope.factoryMethods = factory;
            factory.initLocationLevelList(datalayer.dldata);
            datalayer.GetAll();
            $scope.hierarchy = {};
        })();


        (function (mode) {
            switch (mode) {
                case "add":
                    $scope.modelTitle = "Add File Details";
                    break;
                case "edit":
                    $scope.modelTitle = "Update File Details";
                    break;
                case "view":
                    $scope.modelTitle = "View File Details";
                    break;
                default:
                    throw ("Invalid display mode : " + JSON.stringify(hierarchy));
            }
            $scope.mode = mode;
        })($routeParams.mode);

        $scope.hierarchyChange = function () {
            if (angular.isDefined($scope.hierarchy) && angular.isDefined($scope.hierarchy.Hierarchy)) {
                $scope.hierarchy.ReportingLevel = '';
                $scope.hierarchy.ReportsTo = '';
                $scope.hierarchy.WorkingReportsTo = '';
                $scope.hierarchy.WorkingReportsLevel = '';
            };
        };

        $scope.reportsChange = function () {
            if (angular.isDefined($scope.hierarchy) && angular.isDefined($scope.hierarchy.ReportsTo)) {
                $scope.hierarchy.ReportingLevel = '';
                $scope.hierarchy.WorkingReportsTo = '';
                $scope.hierarchy.WorkingReportsLevel = '';
            };
        };

        $scope.reportinglevelChange = function () {
            if (angular.isDefined($scope.hierarchy) && angular.isDefined($scope.hierarchy.ReportingLevel)) {
                $scope.hierarchy.WorkingReportsTo = '';
                $scope.hierarchy.WorkingReportsLevel = '';
            };
        };

        $scope.workingReportsChange = function () {
            if (angular.isDefined($scope.hierarchy) && angular.isDefined($scope.hierarchy.WorkingReportsTo)) {
                $scope.hierarchy.WorkingReportsLevel = '';
            };
        };
   
        $scope.closeModal = function () {
            $location.path("/generic/hierarchy");
        };

        $scope.reloadReportsTo = function(stkh,dldata) {
            return factory.reloadReportsTo(stkh, dldata);
        };
        
        $scope.save = function (stkh) {
            if ($scope.mode === "add") {
                stkh.PositionLevel = $scope.dldata.highestPositionLevel.PositionLevel + 1;
            } 
            datalayer.Save(stkh).then(function () {
                $scope.hierarchy = {};
                $scope.dldata.highestPositionLevel = {};
                $location.path("/generic/hierarchy");
            });
        };

        $scope.closeform = function () {
            $scope.step = 1;
            $scope.hierarchy = null;
            $location.path("/generic/hierarchy");
        };
    }]);


