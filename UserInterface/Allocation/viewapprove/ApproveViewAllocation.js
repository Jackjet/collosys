﻿
csapp.controller('approveViewCntrl', ['$scope', 'approveViewDataLayer', 'approveViewFactory', '$modal', '$csfactory', "$csGrid", "$csModels", "$csShared",
    function ($scope, datalayer, factory, $modal, $csfactory, $grid, $csModels, $csShared) {

        (function () {
            $scope.dldata = datalayer.dldata;
            $scope.datalayer = datalayer;
            $scope.factory = factory;
            $csfactory.enableSpinner();
            // $scope.datalayer.getProducts();
            $scope.ViewApprovePolicy = $csModels.getColumns("ViewApprovePolicy");
            $scope.ProductList = $csShared.enums.Products;
            $scope.allocData = {};
            $scope.allocData.fromDate = moment().startOf('month').add('minute', 330).format('YYYY-MM-DD');
            $scope.allocData.toDate = moment().endOf('month').format('YYYY-MM-DD');
            $scope.$grid = $grid;
        })();

        $scope.openChangeModal = function () {
            $modal.open({
                templateUrl: baseUrl + 'Allocation/viewapprove/change-allocation-modal.html',
                controller: 'changAllocCtrl',
                windowClass: 'modal-large',
            });
        };

        $scope.openChurnModal = function () {
            $modal.open({
                templateUrl: baseUrl + 'Allocation/viewapprove/churn-allocation-modal.html',
                controller: 'churnAllocCtrl',
                resolve: {
                    modalData: function () {
                        return $scope.modalData;
                    }
                }
            });
        };

        $scope.getPagedData = function (allocData) {
            if (($csfactory.isNullOrEmptyString(allocData.selectedProduct))
                || ($csfactory.isNullOrEmptyString(allocData.selectedAllocation))) {
                return;
            }

            if ($scope.gettingPageData === true) return; //never used in html
            $scope.gettingPageData = true;//never used in html
            $csfactory.enableSpinner();

            datalayer.fetchData(allocData).then(function () {
                $scope.gridOptions = datalayer.dldata.gridOptions;
            }).finally(function () {
                $scope.gettingPageData = false;//never used in html
            });;
        };

        $scope.allocationApprove = function (allocdata) {
            datalayer.approveAllocations().then(function () {
                datalayer.fetchData(allocdata).then(function () {
                    $scope.gridOptions = datalayer.dldata.gridOptions;
                });
            });
        };

        $scope.allocationReject = function (allocdata) {
            datalayer.rejectAllocations().then(function () {
                datalayer.fetchData(allocdata).then(function () {
                    $scope.gridOptions = datalayer.dldata.gridOptions;
                });
            });
        };

    }]);

//#region "changes successfully Done"
csapp.factory('approveViewDataLayer', ['Restangular', '$csnotify', '$csGrid', '$csfactory',
    function (rest, $csnotify, $grid, $csfactory) {

        var restApi = rest.all("ApproveViewAllocationApi");

        var dldata = {};
        dldata.selectedAllocations = [];

        var fetchData = function (allocData) {
            var allocStatus = "None";
            var aprovedStatus = "Approved";
            if (!$csfactory.isNullOrEmptyString(allocData.selectedAllocation)) {
                if (allocData.selectedAllocation === "Submitted") {
                    aprovedStatus = allocData.selectedAllocation;
                    allocStatus = "None";
                } else {
                    allocStatus = allocData.selectedAllocation;
                }
            }

            dldata.viewAllocationModel = {
                Products: allocData.selectedProduct,
                AllocationStatus: allocStatus,
                AproveStatus: aprovedStatus,
                FromDate: allocData.fromDate,
                ToDate: allocData.toDate
            };

            dldata.gridOptions = {};
            return restApi.customPOST(dldata.viewAllocationModel, "FetchPageData")
                .then(function (data) {
                    if (angular.isUndefined(data.QueryParams) || angular.isUndefined(data.QueryResult)) { return; }
                    dldata.gridOptions = $grid.InitGrid(data.QueryParams, dldata.gridOptions); // query params
                    $grid.SetData(dldata.gridOptions, data.QueryResult); // query result
                    $grid.RepotingHelper.GetReportList(dldata.gridOptions, data.ScreenName);
                }, function (response) {
                    $csnotify.error("Failed to fetch the data." + response.data.Message);
                });
        };

        var getstakeholders = function (param) {
            if (param != 'DoNotAllocate' && param != 'AllocateToTelecalling') {
                //var products = dldata.selectedProduct;
                var products = dldata.viewAllocationModel.Products;
                restApi.customGET("GetStakeholders", { 'products': products }).then(function (data) {
                    dldata.stakeholder = data;
                    if (dldata.stakeholder.length === 0) {
                        $csnotify.success("Stakeholder Not available");
                    }
                });
            }
        };

        var approveAllocations = function () {

            var allocStatus = "None";
            var aprovedStatus = "Approved";
            if (!$csfactory.isNullOrEmptyString(dldata.viewAllocationModel.AllocationStatus)) {
                if (dldata.viewAllocationModel.AllocationStatus === "Submitted") {
                    aprovedStatus = dldata.viewAllocationModel.AllocationStatus;
                    allocStatus = "None";
                } else {
                    allocStatus = dldata.viewAllocationModel.AllocationStatus;
                }
            }

            dldata.ChangeAllocationModel = {
                AllocList: dldata.gridOptions.$gridScope.selectedItems,
                AllocationStatus: allocStatus,
                Products: dldata.viewAllocationModel.Products,
                AproveStatus: aprovedStatus,
                fromDate: dldata.viewAllocationModel.FromDate,
                toDate: dldata.viewAllocationModel.ToDate
            };

            dldata.isInProcessing = true;
            return restApi.customPOST(dldata.ChangeAllocationModel, "ApproveAllocations").then(function () {
                $csnotify.success("Allocations Approved");
                dldata.gridOptions.$gridScope.selectedItems = [];
            });
        };

        var rejectAllocations = function () {

            var allocStatus = "None";
            var aprovedStatus = "Approved";
            if (!$csfactory.isNullOrEmptyString(dldata.viewAllocationModel.AllocationStatus)) {
                if (dldata.viewAllocationModel.AllocationStatus === "Submitted") {
                    aprovedStatus = dldata.viewAllocationModel.AllocationStatus;
                    allocStatus = "None";
                } else {
                    allocStatus = dldata.viewAllocationModel.AllocationStatus;
                }
            }

            dldata.ChangeAllocationModel = {
                AllocList: dldata.gridOptions.$gridScope.selectedItems,
                AllocationStatus: allocStatus,
                Products: dldata.viewAllocationModel.Products,
                AproveStatus: aprovedStatus,
                fromDate: dldata.viewAllocationModel.FromDate,
                toDate: dldata.viewAllocationModel.ToDate
            };

            dldata.isInProcessing = true;
            restApi.customPOST(dldata.ChangeAllocationModel, "RejectChangeAllocations").then(function () {
                $csnotify.success("Allocations Rejected");
            });
        };

        var saveAllocationChanges = function (param) {
            dldata.isInProcessing = true;

            var allocStatus = "None";
            var aprovedStatus = "Approved";
            if (!$csfactory.isNullOrEmptyString(dldata.viewAllocationModel.AllocationStatus)) {
                if (dldata.viewAllocationModel.AllocationStatus === "Submitted") {
                    aprovedStatus = dldata.viewAllocationModel.AllocationStatus;
                    allocStatus = "None";
                } else {
                    allocStatus = dldata.viewAllocationModel.AllocationStatus;
                }
            }

            dldata.ChangeAllocationModel = {
                AllocList: dldata.selectedAllocations,
                ChangeAllocStatus: param,
                AllocationStatus: allocStatus,
                Products: dldata.viewAllocationModel.Products,
                AproveStatus: aprovedStatus,
                fromDate: dldata.viewAllocationModel.FromDate,
                toDate: dldata.viewAllocationModel.ToDate
            };

            return restApi.customPOST(dldata.ChangeAllocationModel, "ChangeAllocations").then(function (data) {
               
                $csnotify.success("Allocations Changed");
                dldata.selectedAllocations = [];
                dldata.gridOptions.$gridScope.selectedItems = [];
                if (angular.isUndefined(data.QueryParams) || angular.isUndefined(data.QueryResult)) { return; }
                dldata.gridOptions = $grid.InitGrid(data.QueryParams, dldata.gridOptions); // query params
                $grid.SetData(dldata.gridOptions, data.QueryResult); // query result
                $grid.RepotingHelper.GetReportList(dldata.gridOptions, data.ScreenName);
                dldata.isInProcessing = false;
            });

        };

        return {
            dldata: dldata,
            //getProducts: getProducts,
            fetchData: fetchData,
            getstakeholders: getstakeholders,
            approveAllocations: approveAllocations,
            rejectAllocations: rejectAllocations,
            saveAllocationChanges: saveAllocationChanges
        };
    }]);
//#endregion

csapp.factory('approveViewFactory', ['approveViewDataLayer',
    function (datalayer) {

        var dldata = datalayer.dldata;

        var disableSelect = function (data) {
            if (dldata.selectedAllocations.length > 0) {
                return (dldata.selectedAllocations.indexOf(data) === -1);
            }
            return true;
        };

        var showChurnButton = function () {
            var cnt = 0;
            if (angular.isDefined(dldata.gridOptions)) {
                if (angular.isDefined(dldata.gridOptions.$gridScope)) {
                    if (dldata.gridOptions.$gridScope.selectedItems.length > 0) {
                        _.forEach(dldata.gridOptions.$gridScope.selectedItems, function (item) {
                            if (item.AllocStatus !== "PolicyAllocated") {
                                return;
                            }
                            cnt++;
                        });
                        return (cnt === dldata.gridOptions.$gridScope.selectedItems.length);
                    } else return false;
                } else return false;
            }
            return false;
        };

        var setRowColor = function (data) {
            if (dldata.selectedAllocations.indexOf(data) !== -1) {
                return ({ backgroundColor: 'rgba(196, 224, 230, 0.66)' });
            }
            if (data.Status === "Approved")
                return ({ backgroundColor: '#c9dde1' });
            return {};
        };

        var assignStakeholderToAll = function (stkh) {
            if (stkh == "") {
                return null;
            }
            for (var i = 0; i < dldata.gridOptions.$gridScope.selectedItems.length; i++) {
                dldata.gridOptions.$gridScope.selectedItems[i].Stakeholder = JSON.parse(stkh);
            }
            return dldata;
        };

        var setStakeholder = function (stkh) {
            if (stkh === "" || angular.isUndefined(stkh)) {
                return null;
            }
            return JSON.parse(stkh);
        };

        return {
            disableSelect: disableSelect,
            showChurnButton: showChurnButton,
            setRowColor: setRowColor,
            assignStakeholderToAll: assignStakeholderToAll,
            setStakeholder: setStakeholder
        };

    }]);

//#region "changes successfully Done"
csapp.controller('changAllocCtrl', ['$scope', '$modalInstance', 'approveViewDataLayer', 'approveViewFactory', '$csModels',
function ($scope, $modalInstance, datalayer, factory, $csModels) {

    (function () {
        $scope.dldata = datalayer.dldata;
        $scope.gridOptions = $scope.dldata.gridOptions;
        $scope.datalayer = datalayer;
        $scope.factory = factory;
        $scope.ViewApprovePolicy = $csModels.getColumns("ViewApprovePolicy");

    })();

    $scope.closeModel = function () {
        $scope.reset();
        $modalInstance.close();
    };
    $scope.selectAllocation = function (allocation, selected) {
        selected = !selected;
        if (selected === true) {
            $scope.dldata.selectedAllocations.push(allocation);
            if ($scope.dldata.selectedAllocations.length === $scope.dldata.gridOptions.$gridScope.selectedItems.length)
                $scope.selectedAll = true;
        }
        if (selected === false) {
            $scope.dldata.selectedAllocations.splice($scope.dldata.selectedAllocations.indexOf(allocation), 1);
            $scope.selectedAll = false;
        }

        if (angular.isDefined($scope.dldata.approveView.Stkh) &&  $scope.dldata.selectedAllocations.length !== $scope.gridOptions.$gridScope.selectedItems.length) {
            $scope.dldata.approveView.Stkh = "";
        }
    };
    $scope.ticks = function (data) {
        return ($scope.dldata.selectedAllocations.indexOf(data) !== -1);
    };

    $scope.selectAll = function (selected) {
        selected = !selected;

        if (selected === true) {
            _.forEach($scope.dldata.gridOptions.$gridScope.selectedItems, function (item) {
                $scope.dldata.selectedAllocations.push(item);
            });
            $scope.selected = true;
            $scope.selectedAll = true;
        }
        if (selected === false) {
            $scope.selectedAll = false;
            $scope.dldata.selectedAllocations = [];
            $scope.selected = false;
        }
    };

    $scope.reset = function () {
        $scope.selectAll = false;
        $scope.selected = false;
        $scope.dldata.selectedAllocations = [];
        $scope.dldata.approveView.Param = "";
        $scope.dldata.approveView.Stkh = "";
        $scope.dldata.selectedStakeholder = "";
    };

    $scope.saveAllocationChanges = function (param) {
        $scope.datalayer.saveAllocationChanges(param).then(function () {
            $scope.reset();
            $modalInstance.close();
        });
    };

}]);
//#endregion

csapp.controller('churnAllocCtrl', ['$scope', '$modalInstance', 'approveViewDataLayer', 'approveViewFactory',
    function ($scope, $modalInstance, datalayer, factory) {

        (function () {
            $scope.dldata = datalayer.dldata;
            $scope.datalayer = datalayer;
            $scope.factory = factory;
        })();

        $scope.closeModel = function () {
            $modalInstance.close();
        };
    }]);