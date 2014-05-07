﻿//Datalayer
csapp.factory("filterConditionDatalayer", ["Restangular", "$csnotify", function (rest, $csnotify) {

    var restApi = rest.all("FilterConditionApi");
    var dldata = {};

    var errorDisplay = function (response) {
        $csnotify.error(response);
    };

    var getFileDetails = function () {
        return restApi.customGET("GetFiledetails", function (data) {
            return data;

        }, errorDisplay);
    };

    var getColumnValues = function (filedeatil) {
        return restApi.customGET("GetFileColumnData", { fileDetailId: filedeatil.Id }).then(function (data) {
            if (data.length === 0) {
                $csnotify.success("Data not available");
            }
            return data;
        });
    };

    var getfilterConditionDetails = function (filedetail) {
        dldata.list = [];
        return restApi.customGET("GetFilterConditionDeatils", { fileGuid: filedetail.Id }).then(function (data) {
            return data;
            //dldata.list.push(data);
        });

    };

    var saveAliseCondition = function (filterCondition) {
        var obj = JSON.parse(filterCondition.FileDetail);
        var finalCondition = {
            FileDetail: obj,
            AliasConditionName: filterCondition.AliasConditionName,
            Fconditions: filterCondition.ConditionList,
        };
        if (dldata.selectedId) {
            //return restApi.customPUT(finalCondition, "Put", { id: dldata.selectedId }).then(function (data) {
            //    dldata.selectedId = "";
            //    return data;
               
            //});
            $csnotify.success("data updated");
            return "";
        } else {
            return restApi.customPOST(finalCondition, "Post").then(function (data) {
                $csnotify.success("AliseCondition saved");
                return data;
            });
        }
       
    };


    return {
        dldata: dldata,
        getFileDetails: getFileDetails,
        saveAliseCondition: saveAliseCondition,
        getColumnValues: getColumnValues,
        getfilterConditionDetails: getfilterConditionDetails,

    };

}]);

//factory
csapp.factory("filterconditionFactory", ["filterConditionDatalayer", "$csnotify", function (datalayer, $csnotify) {
    var dldata = datalayer.dldata;

    return {

    };
}]);

//Controller
csapp.controller("filterConditionController", ["$scope", "filterConditionDatalayer", "filterconditionFactory", "$csFileUploadModels", "$csnotify", "$csShared",
    function ($scope, datalayer, factory, $csFileUploadModels, $csnotify, $csShared) {
        //page load
        $scope.fetchFileDetails = function () {
            datalayer.getFileDetails().then(function (data) {
                $scope.fileDetailsList = data;
            });
        };

        (function () {
            $scope.datalayer = datalayer;
            $scope.dldata = datalayer.dldata;
            $scope.factory = factory;
            $scope.FilterCondition = $csFileUploadModels.models.FilterCondition;
            $scope.Fcondition = $csFileUploadModels.models.Fcondition;
            $scope.showDiv = false;
            $scope.fileDetailsList = [];
            $scope.dldata.selectedId = "";
            $scope.filterCondition = { ConditionList: [] };
            $scope.AliseConditionList = [];
            $scope.fetchFileDetails();

        })();

        $scope.addAliseCondition = function (fileDetail) {
            var data = JSON.parse(fileDetail);
            $scope.filterCondition.ConditionList = [];
            $scope.showDiv = true;
            $scope.reset();

        };

        $scope.addCondition = function (condition,form) {
            var obj = JSON.parse(condition.ColumnName);
            condition.ColumnName = obj.TempColumnName;
            var duplicateCond = _.find($scope.filterCondition.ConditionList, function (cond) {
                return (cond.ColumnName == condition.ColumnName && cond.Operator == condition.Operator && cond.Value == condition.Value);
            });

            if (duplicateCond) {
                $csnotify.error("condition is duplicate");
                return;
            }
            $scope.filterCondition.ConditionList.push(condition);
            $scope.dldata.newCondition = {};
            form.$setPristine();
        };

        $scope.deleteCondition = function (condition, index) {
            $scope.filterCondition.ConditionList.splice(index, 1);
            $scope.filterCondition.ConditionList[0].RelationType = "";

        };
        $scope.save = function (filterCondition) {
            datalayer.saveAliseCondition(filterCondition).then(function (data) {
                $scope.AliseConditionList.push(data);
            });
            $scope.reset();

        };

        $scope.getColumnValues = function (fileData) {
            $scope.AliseConditionList = [];
            var filedetail = JSON.parse(fileData);

            //getdata
            if (angular.isDefined(filedetail)) {
                datalayer.getfilterConditionDetails(filedetail).then(function (data) {
                    $scope.AliseConditionList = data;
                });
            }

            //  $scope.AliseConditionList=$scope.dldata.list;

            //getcolumval
            datalayer.getColumnValues(filedetail).then(function (data) {
                $scope.ColumnNameList = data;
            });
        };

        $scope.manageOperatorField = function (condition) {
            var obj = JSON.parse(condition.ColumnName);
            console.log(obj);
            $scope.InputType = obj.ColumnDataType;
            if ($scope.InputType === "String") {
                condition.Operator = "";
                condition.Value = "";
                $scope.Fcondition.Operator.valueList = $csShared.enums.TextConditionOperators;
                return;
            }
            condition.Operator = "";
            condition.Value = "";
            $scope.Fcondition.Operator.valueList = $csShared.enums.ConditionOperators;

        };

        $scope.selectFilterCondition = function (data) {
            var condition = angular.copy(data);
            $scope.filterCondition.AliasConditionName = condition.AliasConditionName;
            $scope.filterCondition.ConditionList = condition.Fconditions;
            $scope.dldata.selectedId = data.Id;
            $scope.showDiv = true;
        };

        $scope.reset = function () {
            $scope.dldata.newCondition = {};
            $scope.filterCondition.AliasConditionName = "";
            $scope.filterCondition.ConditionList = [];
        };

    }]);