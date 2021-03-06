﻿csapp.controller('adhocPayoutCtrl', ['$scope', 'adhocPayoutDataLayer', 'adhocPayoutFactory', '$location', '$csModels',
    function ($scope, datalayer, factory, $location, $csModels) {
        (function () {
            $scope.dldata = datalayer.dldata;
            $scope.datalayer = datalayer;
            $scope.factory = factory;
            datalayer.getProducts();
            $scope.dldata.selectedProduct = '';
            $scope.dldata.adhocPayoutList = [];
            $scope.adhocPayout = {};
            $scope.adhocPayoutbill = $csModels.getColumns("AdhocPayout");
        })();

        $scope.ShowIndividual = function (stkh) {
            if (angular.isUndefined(stkh.Hierarchy)) return false;
            return stkh.Hierarchy.IsIndividual === true;
        };

        //$scope.openmodal = function () {
        //      $scope.dldata.adhocPayout.Products = $scope.dldata.selectedProduct;
        //      if ($scope.dldata.selectedStkholderId) {
        //          $scope.dldata.adhocPayout.Stakeholder = _.find($scope.dldata.stakeholderList, { Id: $scope.dldata.selectedStkholderId });
        //      }
        //      $modal.open({
        //          templateUrl: baseUrl + 'Billing/adhoc/add-hoc-payment-details.html',
        //          controller: 'adhocPaymentCtrl',
        //      });
        //  };

        $scope.openmodal = function (mode) {
            $scope.dldata.adhocPayout.Products = $scope.dldata.selectedProduct;
            if ($scope.dldata.selectedStkholderId) {
                $scope.dldata.adhocPayout.Stakeholder = _.find($scope.dldata.stakeholderList, { Id: $scope.dldata.selectedStkholderId });
            }
            $location.path("/billing/adhoc/addedit/" + mode);
        };
    }]);

csapp.factory('adhocPayoutDataLayer', ['Restangular', '$csnotify',
    function (rest, $csnotify) {
        var dldata = {};
        var restApi = rest.all("AddhocPayoutsApi");

        dldata.transcationtypes = [{ display: 'Incentive', value: 'true' }, { display: 'Fine', value: 'false' }];
        dldata.taxtype = ['PreTax', 'PostTax'];
        dldata.Reasonstype = [{ display: 'Performance', transcationtype: 'true' },
            { display: 'Customer Complaints', transcationtype: 'false' }];

        var getProducts = function () {
            restApi.customGET("GetProducts").then(function (data) {
                dldata.productsList = data;
            }, function (data) {
                $csnotify.error(data);
            });
        };

        var getdetails = function (product, month) {
            month = moment(month).format('YYYYMM');
            return restApi.customGET("GetStatus", { product: product, startmonth: month }).then(function (data) {
                dldata.isBilled = data;
                if (data == "true") {
                    $csnotify.success("Billing Already Done");
                }
                return data;
            }, function () {
                $csnotify.error();
            });
        };

        var changeProductCategory = function () {
            if (angular.isUndefined(dldata.selectedProduct)) {
                return;
            }
            restApi.customGET("GetStakeHolders", { products: dldata.selectedProduct }).then(function (data) {
                dldata.stakeholderList = data;
                dldata.adhocPayout.Tenure = 1;
            }, function (data) {
                $csnotify.error(data);
            });
            restApi.customGET("GetAdhocdata", { products: dldata.selectedProduct }).then(function (data) {
                //convert date
                _.forEach(data, function (item) {
                    item.StartMonth = moment(item.StartMonth, 'YYYYMM');
                    item.StartMonth = moment(item.StartMonth).format('MMM-YYYY');
                    item.EndMonth = moment(item.EndMonth, 'YYYYMM');
                    item.EndMonth = moment(item.EndMonth).format('MMM-YYYY');
                });
                dldata.adhocPayoutAllList = data;
                dldata.adhocPayoutList = data;

            }, function (data) {
                $csnotify.error(data);
            });
        };

        var saveData = function (adhocPayout) {

            if (adhocPayout.IsRecurring !== true) {
                adhocPayout.Tenure = 1;
            }
            var endDate = moment(adhocPayout.StartMonth).add('month', (adhocPayout.Tenure - 1));
            adhocPayout.StartMonth = moment(adhocPayout.StartMonth).format('YYYYMM');
            adhocPayout.EndMonth = moment(endDate).format('YYYYMM');
            adhocPayout.RemainingAmount = adhocPayout.TotalAmount;

            return restApi.customPOST(adhocPayout, 'Post').then(function (data) {
                data.StartMonth = moment(data.StartMonth, 'YYYYMM');
                data.StartMonth = moment(data.StartMonth).format('MMM-YYYY');
                data.EndMonth = moment(data.EndMonth, 'YYYYMM');
                data.EndMonth = moment(data.EndMonth).format('MMM-YYYY');
                dldata.adhocPayoutList.push(data);
                $csnotify.success('All File Columns Save Successfully');
                return data;
            }, function () {
                $csnotify.error();
            });
        };

        return {
            dldata: dldata,
            getProducts: getProducts,
            changeProductCategory: changeProductCategory,
            saveData: saveData,
            getdetails: getdetails
        };
    }]);

csapp.factory('adhocPayoutFactory', ['$csfactory', 'adhocPayoutDataLayer',
    function ($csfactory, datalayer) {
        var dldata = datalayer.dldata;
        dldata.adhocPayout = {};

        var selectTransaction = function (st) {
            var selecttransdata = _.where(dldata.Reasonstype, { 'transcationtype': st });
            return selecttransdata;
        };

        var showData = function (selectedStkholderId) {
            dldata.adhocPayoutList = _.filter(dldata.adhocPayoutAllList, function (adhocPayout) {
                return (adhocPayout.Stakeholder.Id == selectedStkholderId);
            });
        };

        return {
            selectTransaction: selectTransaction,
            showData: showData
        };
    }]);

csapp.controller('adhocPaymentCtrl', ['$scope', 'adhocPayoutDataLayer', 'adhocPayoutFactory',
    '$location', '$csModels', '$routeParams',
    function ($scope, datalayer, factory, $location, $csModels, $routeParams) {

        $scope.changeCredit = function () {
            $scope.adhocPayoutbill.IsCredit.valueList = datalayer.dldata.transcationtypes;
            $scope.adhocPayoutbill.IsPretax.valueList = datalayer.dldata.taxtype;
        };

        (function () {
            $scope.dldata = datalayer.dldata;
            $scope.datalayer = datalayer;
            $scope.adhocPayoutbill = $csModels.getColumns("AdhocPayout");
            $scope.factory = factory;
            $scope.adhocPayout = {};
            $scope.changeCredit();
        })();

        (function (mode) {
            switch (mode) {
                case "add":
                    $scope.modelTitle = "Add Holding Policy";
                    break;
                default:
                    throw ("Invalid display mode : " + JSON.stringify(adhocPayout));
            }
            $scope.mode = mode;
        })($routeParams.mode);

        $scope.CloseAdhocPayoutManager = function () {
            $scope.adhocPayout = {};
            $location.path("/billing/adhoc"); //failure
        };

        $scope.getdetails = function (product, month) {
            datalayer.getdetails(product, month);
        };

        $scope.changeCredit = function (credit) {
            $scope.selecttransdata = factory.selectTransaction(credit);
            $scope.adhocPayoutbill.ReasonCode.valueList = $scope.selecttransdata;
        };

        $scope.resetadhocPayout = function () {
            $scope.adhocPayout = {};
        };

        $scope.saveData = function (adhocPayout) {
            adhocPayout.Products = $scope.dldata.selectedProduct;
            adhocPayout.Stakeholder = $scope.dldata.adhocPayout.Stakeholder;
           return datalayer.saveData(adhocPayout).then(function (data) {
                $scope.adhocPayout.TotalAmount = '';
                $scope.adhocPayout.IsCredit = [];
                $scope.adhocPayout.ReasonCode = [];
                $scope.adhocPayout.Description = '';
                $scope.adhocPayout.IsRecurring = '';
                $scope.adhocPayout.StartMonth = '';
                $location.path("/billing/adhoc"); //success
            });
        };

    }]);