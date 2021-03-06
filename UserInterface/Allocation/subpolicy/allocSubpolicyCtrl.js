﻿
csapp.controller('allocSubpolicyCtrl', ['$scope', 'subpolicyDataLayer', 'subpolicyFactory', '$modal', '$csModels', '$csShared',
    function ($scope, datalayer, factory, $modal, $csModels, $csShared) {
        "use strict";


        (function () {
            $scope.factory = factory;
            $scope.datalayer = datalayer;
            $scope.dldata = datalayer.dldata;
            $scope.dldata.allocSubpolicy = {};
            $scope.allocSubpolicy = $csModels.getColumns("AllocSubpolicy");
            $scope.CustomerInfo = $csModels.getColumns("CustomerInfo");
            $scope.GPincode = $csModels.getColumns("Pincode");
            $scope.dldata.allocSubpolicyList = [];
            $scope.showDiv = false;
            $scope.datalayer.getReasons();
            $scope.fieldname = '';
            $scope.showField = true;
            $scope.showField2 = false;
            $scope.data1 = $scope.dldata.list;
            $scope.data2 = $scope.dldata.list1;
            $scope.dldata.policyapproved = false;
            $scope.dldata.isActive = false;
            $scope.allocSubpolicy.Products.valueList = _.reject($csShared.enums.Products, function (item) {
                return (item === "UNKNOWN" || item === "ALL");
            });

        })();

        $scope.clickMe = function (obj) {
        };
        
        $scope.openmodal = function () {
            $scope.modalData = $scope.dldata.allocSubpolicy;
            $scope.modalData.forActivate = true;
            $scope.modalData.startDate = null;
            $scope.modalData.endDate = null;
            $modal.open({
                templateUrl: baseUrl + 'Allocation/subpolicy/date-model.html',
                controller: 'datemodelCtrl',
                resolve: {
                    modalData: function () {
                        return $scope.modalData;
                    }
                }
            });
        };

        $scope.selectAllocSubpolicy = function (sallocSubpolicy) {
            $scope.datalayer.selectAllocSubpolicy(sallocSubpolicy);
            $scope.showDiv = true;
        };

        $scope.changeProductCategory = function (product) {
            $scope.datalayer.changeProductCategory();
            // $scope.listtwo = $scope.dldata.allocSubpolicyList;
            $scope.addsubpolicy(product);
            $scope.showDiv = false;

        };
        $scope.addsubpolicy = function (product) {
            $scope.showDiv = true;
            $scope.datalayer.resetAllocSubpolicy(product);
        };

        $scope.changeLeftColName = function (condition) {
            $scope.showField = $scope.showField === true ? false : true;
            $scope.showField2 = !$scope.showField2;
            var fieldVal = condition.ColumnName.split(".");
            $scope.fieldname = $scope[fieldVal[0]][fieldVal[1]];
            $scope.dldata.selectedLeftColumn = _.find($scope.dldata.columnDefs, { field: condition.ColumnName });
            var inputType = $scope.dldata.selectedLeftColumn.InputType;

            if (inputType === "text") {
                condition.Operator = '';
                condition.Rtype = 'Value';
                condition.Rvalue = '';
                $scope.allocSubpolicy.ConditionOperators.valueList = $csShared.enums.TextConditionOperators;
                datalayer.getColumnValues(condition.ColumnName).then(function (data) {
                    $scope.fieldname.valueList = data;
                });
                return;
            }
            if (inputType === "checkbox") {
                condition.Operator = 'EqualTo';
                condition.Rtype = 'Value';
                condition.Rvalue = '';
                $scope.allocSubpolicy.ConditionOperators.valueList = $csShared.enums.CheckboxConditionOperators;
                return;
            }
            if (inputType === "dropdown") {
                condition.Rtype = 'Value';
                condition.Rvalue = '';
                $scope.allocSubpolicy.ConditionOperators.valueList = $csShared.enums.DropdownConditionOperators;
                return;
            }
            condition.Operator = '';
            condition.Rtype = 'Value';
            condition.Rvalue = '';
            $scope.allocSubpolicy.ConditionOperators.valueList = $csShared.enums.ConditionOperators;
        };

        $scope.manageField = function (condition) {
            condition.Rvalue = '';
            $scope.showField = $scope.showField === true ? false : true;
            $scope.showField2 = !$scope.showField2;
            $scope.dldata.selectedLeftColumn = _.find($scope.dldata.columnDefs, { field: condition.ColumnName });
            var inputType = $scope.dldata.selectedLeftColumn.InputType;
            if (inputType !== 'text') {
                return;
            }
            if (condition.Operator === 'EndsWith' || condition.Operator === 'StartsWith' ||
                condition.Operator === 'Contains' || condition.Operator === 'DoNotContains') {
                $scope.fieldname.type = "text";
                $scope.fieldname.required = true;
                return;
            }
            if (condition.Operator === "IsInList") {
                $scope.fieldname.multiple = "multiple";
            }
            $scope.fieldname.type = "enum";
        };

        $scope.showIndividual = function (stkh) {
            if (angular.isUndefined(stkh.Hierarchy)) return false;
            return (stkh.Hierarchy.IsIndividual === true);
        };

        $scope.$watch('allocSubpolicy.AllocateType', factory.watchAllocateType());

    }]);

csapp.factory('subpolicyDataLayer', ['Restangular', '$csnotify',
    function (rest, $csnotify) {

        var dldata = {};
        var restApi = rest.all("AllocationSubPolicyApi");
        var getReasons = function () {
            restApi.customGET("GetReasons").then(function (data) {
                dldata.reasonsNotAllocate = data;
            }, function (data) {
                $csnotify.error(data);
            });
        };

        var selectAllocSubpolicy = function (sallocSubpolicy) {
            dldata.IsPolicyApproved = false;

            var subpolicy = angular.copy(sallocSubpolicy);
            dldata.allocSubpolicy = sallocSubpolicy;

            restApi.customGET("GetConditions", { allocationId: sallocSubpolicy.Id }).then(function (data) {
                changeProductCategory();
                dldata.allocSubpolicy.Conditions = data;
            }, function (data) {
                $csnotify.error(data.data.Message);
            });
            restApi.customPOST(subpolicy, "GetRelations").then(function (relation) {
                dldata.curRelation = relation;
                setIsPolicyApproved(dldata.curRelation);
            });
        };

        var setIsPolicyApproved = function (data) {

            if (data.Status === 'Approved') {
                dldata.IsPolicyApproved = true;
                dldata.policyapproved = true;
                $csnotify.success("Policy is already Approved");
            } else {
                dldata.policyapproved = false;
            }
        };

        var changeProductCategory = function () {

            if (angular.isUndefined(dldata.allocSubpolicy.Id)) {
                dldata.allocSubpolicy.Conditions = [];

            } else {
                check(dldata.allocSubpolicy.ReasonNotAllocate);
            }
            resetCondition();

            dldata.allocSubpolicy.Category = 'Liner';

            var allocSubpolicy = dldata.allocSubpolicy;

            if (!angular.isUndefined(allocSubpolicy.Products) && !angular.isUndefined(allocSubpolicy.Category)) {

                // get sub policy list
                restApi.customGET("GetSubPolicy", { products: allocSubpolicy.Products, category: allocSubpolicy.Category }).then(function (data) {
                    dldata.allocSubpolicyList = data;
                    if (dldata.allocSubpolicyList.length == 0) {
                        $csnotify.success("SubPolicy not Available");
                    }
                }, function (data) {
                    $csnotify.error(data.data.Message);
                });

                //get column names
                restApi.customGET("GetConditionColumns", { products: allocSubpolicy.Products, category: allocSubpolicy.Category }).then(function (data) {
                    dldata.columnDefs = data;
                    dldata.condLcolumnNames = _.pluck(data, 'field');
                }, function (data) {
                    $csnotify.error(data);
                });

                //stakeholderList
                restApi.customGET('GetStakeholders', { products: allocSubpolicy.Products }).then(function (data) {

                    dldata.stakeholderList = data;
                }, function (data) {
                    $csnotify.error(data);
                });
            } else {
                dldata.LcolumnNames = [];
            }
        };

        var check = function (val) {
            if (angular.isUndefined(val)) {
                return;
            }
            var arr = val.split(" ");
            _.find(arr, function (string) {
                if (string == 'dead' || string == 'died') {
                    dldata.allocSubpolicy.NoAllocMonth = 0;
                    dldata.readTrue = true;
                } else {
                    // dldata.allocSubpolicy.NoAllocMonth = 1;
                    dldata.readTrue = false;
                }
            });
        };

        var resetCondition = function () {
            dldata.newCondition = {};
        };

        var getColumnValues = function (columnName) {
            return restApi.customGET('GetValuesofColumn', { columnName: columnName }).then(function (data) {
                //  dldata.conditionValues = data;
                return data;
            }, function (data) {
                $csnotify.error(data);
            });
        };

        var saveAllocSubpolicy = function (allocSubpolicy) {
            if (allocSubpolicy.Stakeholder && allocSubpolicy.Stakeholder.Id) {
                allocSubpolicy.Stakeholder = _.find(dldata.stakeholderList, { Id: allocSubpolicy.Stakeholder.Id });
            }

            if (dldata.allocSubpolicy.Products === 'CC') {
                dldata.allocSubpolicy.Category = 'Liner';
            }


            if (allocSubpolicy.Id) {

               return restApi.customPUT(allocSubpolicy, "Put", { id: allocSubpolicy.Id }).then(function (data) {
                    dldata.allocSubpolicyList = _.reject(dldata.allocSubpolicyList, function (subpolicy) { return subpolicy.Id == data.Id; });
                    dldata.allocSubpolicyList.push(data);
                    resetAllocSubpolicy(data.Products);
                    selectAllocSubpolicy(data);
                    $csnotify.success("Alloc Subpolicy saved");
                }, function (data) {
                    $csnotify.error(data);
                });

            } else {
               return restApi.customPOST(allocSubpolicy, "Post").then(function (data) {
                    dldata.allocSubpolicyList = _.reject(dldata.allocSubpolicyList, function (subpolicy) { return subpolicy.Id == data.Id; });
                    dldata.allocSubpolicyList.push(data);
                    resetAllocSubpolicy(data.Products);
                    selectAllocSubpolicy(data);
                    $csnotify.success("Alloc Subpolicy saved");
                }, function (data) {
                    $csnotify.error(data);
                });
            }
        };

        var activateSubpolicy = function (currelation) {
            return restApi.customPOST(currelation, "ActivateSubpolicy")
                .then(function (data) {
                    data.AllocPolicy = null;
                    data.AllocSubpolicy = null;
                    $csnotify.success("Policy Activated");
                    return data;
                });
        };

        var resetAllocSubpolicy = function (products, form, form2) {
            dldata.policyapproved = false;
            dldata.allocSubpolicy = {};
            dldata.allocSubpolicy.Conditions = [];
            dldata.isDuplicateName = false;
            dldata.deleteConditions = [];
            dldata.newCondition = {};
            dldata.allocSubpolicy.Products = products;
            dldata.allocSubpolicy.Category = 'Liner';
            //dldata.allocSubpolicy.DoAllocate = 1;
            dldata.allocSubpolicy.NoAllocMonth = 1;
            resetCondition();
            if (angular.isDefined(form) || angular.isDefined(form2)) {
                form.$setPristine();
                form2.$setPristine();

            }
        };

        return {
            dldata: dldata,
            //getProducts: getProducts,
            getReasons: getReasons,
            selectAllocSubpolicy: selectAllocSubpolicy,
            getColumnValues: getColumnValues,
            saveAllocSubpolicy: saveAllocSubpolicy,
            changeProductCategory: changeProductCategory,
            activateSubpolicy: activateSubpolicy,
            resetAllocSubpolicy: resetAllocSubpolicy,
            resetCondition: resetCondition
        };

    }]);


csapp.factory('subpolicyFactory', ['subpolicyDataLayer', '$csfactory', '$csnotify',
    function (datalayer, $csfactory, $csnotify) {
        var dldata = datalayer.dldata;

        var disableIfRelationExists = function () {
            if (angular.isDefined(dldata.curRelation)) {
                if ($csfactory.isNullOrEmptyString(dldata.curRelation.AllocPolicy) || $csfactory.isNullOrEmptyString(dldata.curRelation.AllocPolicy))
                    return true;
                else return false;
            }
            return false;
        };

        var checkDuplicateName = function () {
            dldata.isDuplicateName = false;
            _.forEach(dldata.allocSubpolicyList, function (subpolicy) {
                if (subpolicy.Name.toUpperCase() == dldata.allocSubpolicy.Name.toUpperCase()) {
                    dldata.isDuplicateName = true;
                    return;
                }
            });
        };

        var watchAllocateType = function () {

            if (angular.isUndefined(dldata))
                return;
            if (angular.isUndefined(dldata.allocSubpolicy))
                return;
            if (angular.isUndefined(dldata.allocSubpolicy.AllocateType))
                return;

            if (dldata.allocSubpolicy.AllocateType !== 'DoNotAllocate')
                dldata.allocSubpolicy.ReasonNotAllocate = '';

            if (dldata.allocSubpolicy.AllocateType !== 'AllocateToStkholder')
                dldata.allocSubpolicy.Stakeholder = {};
        };

        var addNewCondition = function (condition, form) {

            var duplicateCond = _.find(dldata.allocSubpolicy.Conditions, function (cond) {
                return (cond.ColumnName == condition.ColumnName && cond.Operator == condition.Operator && cond.Value == condition.Value);
            });

            if (duplicateCond) {
                $csnotify.error("condition is duplicate");
                return;
            }

            condition.Priority = dldata.allocSubpolicy.Conditions.length;

            if (condition.dateValueEnum && condition.dateValueEnum != 'Absolute_Date') {
                condition.Value = condition.dateValueEnum;
            }
            if (condition.Operator === "IsInList") {
                condition.Value = JSON.stringify(condition.Value);
            }

            //var con = angular.copy(condition);
            dldata.allocSubpolicy.Conditions.push(condition);
            dldata.conditionValueType = 'text';
            datalayer.resetCondition();
            form.$setPristine();
        };

        var deleteCondition = function (condition, index) {
            dldata.allocSubpolicy.Conditions[0].RelationType = "";
            dldata.allocSubpolicy.Conditions.splice(index, 1);
            for (var i = index; i < dldata.allocSubpolicy.Conditions.length; i++) {
                dldata.allocSubpolicy.Conditions[i].Priority = i;
            }
        };

        return {
            disableIfRelationExists: disableIfRelationExists,
            checkDuplicateName: checkDuplicateName,
            watchAllocateType: watchAllocateType,
            addNewCondition: addNewCondition,
            deleteCondition: deleteCondition

        };

    }]);

csapp.controller('datemodelCtrl', ['$scope', 'modalData', 'subpolicyDataLayer', '$modalInstance', '$csModels', '$csnotify',
    function ($scope, modalData, datalayer, $modalInstance, $csModels, $csnotify) {
        $scope.dldata = datalayer.dldata;

        $scope.modalData = modalData;
        $scope.allocmodalData = $csModels.getColumns("AllocPolicy");
        $scope.modelDateValidation = function (startDate, endDate) {
            if (angular.isUndefined(endDate) || endDate == null) {
                $scope.isModalDateValid = true;
                return;
            }
            startDate = moment(startDate);
            endDate = moment(endDate);
            $scope.isModalDateValid = (endDate > startDate);
            if ($scope.isModalDateValid === false) {
                $csnotify.success("EndDate should be Greater Than StartDate");
            }
        };

        $scope.activateSubPoicy = function (modelData) {
            $scope.dldata.curRelation.StartDate = modelData.startDate;
            $scope.dldata.curRelation.EndDate = modelData.endDate;
           return datalayer.activateSubpolicy($scope.dldata.curRelation).then(function (data) {
                $scope.dldata.curRelation = data;
                $scope.closeModel();
            });
        };

        $scope.closeModel = function () {
            $modalInstance.close();
        };

    }]);


