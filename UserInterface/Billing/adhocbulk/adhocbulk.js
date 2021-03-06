﻿

csapp.factory('adhocbulkDataLayer', ['Restangular', '$csnotify',
    function (rest, $csnotify) {
        var dldata = {};
        var restApi = rest.all("AdhocBulkApi");

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

        var stakeholdersList = function (name, product) {
            return restApi.customGET('StakeholderList', { name: name, products: product }).then(function (data) {
                return data;
            });
        };

        var checkBillStatus = function (product, month) {
            return restApi.customGET("GetStatus", { product: product, startmonth: month }).then(function (data) {
                return data;
            });
        };

        var save = function (paymentList) {
            return restApi.customPOST(paymentList, 'SaveList').then(function (data) {
                $csnotify.success('data saved');
            });
        };
        return {
            dldata: dldata,
            getProducts: getProducts,
            stakeholdersList: stakeholdersList,
            checkBillStatus: checkBillStatus,
            save: save
        };
    }]);

csapp.factory('adhocbulkFactory', ['$csfactory', 'adhocbulkDataLayer',
    function ($csfactory, datalayer) {
        var dldata = datalayer.dldata;
        var selectTransaction = function (st) {
            var data = _.where(dldata.Reasonstype, { 'transcationtype': st });
            return data;
        };
        return {
            selectTransaction: selectTransaction
        };
    }]);

csapp.controller('adhocbulkCtrl', ['$scope', 'adhocbulkDataLayer', 'adhocbulkFactory','$csModels',
    function ($scope, datalayer, factory, $csModels) {

        var addDefaultPayment = function (payment) {
            $scope.PaymentList.push(payment);
        };

        var getDefaultPayment = function () {
            var payment = {
                Products: '',
            };
            return payment;
            //TotalAmount: '',
            //IsCredit: '',
            //ReasonCode: '',
            //Description: '',
            //IsRecurring: '',
        };

        var calculateMonthList = function (product) {
            var i = 0;
            datalayer.checkBillStatus(product, moment().format('YYYYMM')).then(function (data2) {
               var isBillDoneForCurrentMonth = data2;
                if (isBillDoneForCurrentMonth === 'true') {
                    i = 1;
                }
                $scope.monthList = [];
                for (var j = i; j < 6; j++) {
                    var data = {
                        Key: moment().add('month', j).format('YYYYMM'),
                        Value: moment().add('month', j).format("MMM-YYYY")
                    };
                    $scope.monthList.push(data);
                }
                $scope.BillAdhoc.StartMonth.valueList = $scope.monthList;
            });
        };

        var assignList = function() {
            $scope.BillAdhoc.IsCredit.valueList = [{ display: 'Incentive', value: 'true' }, { display: 'Fine', value: 'false' }];
            $scope.BillAdhoc.IsCredit.textField = 'display';
            $scope.BillAdhoc.IsCredit.valueField = 'value';
        };

        $scope.changeCredit = function (isCredit) {
            $scope.selecttransdata = factory.selectTransaction(isCredit);
          $scope.BillAdhoc.ReasonCode.valueList = $scope.selecttransdata;
        };

        (function () {
            $scope.dldata = datalayer.dldata;
            $scope.datalayer = datalayer;
            $scope.factory = factory;
            $scope.BillAdhoc = $csModels.getColumns("BillAdhoc");
            datalayer.getProducts();
            $scope.PaymentList = [];
            $scope.selecttransdata = [];
            assignList();
            $scope.abc = {};
            $scope.BillAdhoc.IsPretax.valueList = datalayer.dldata.taxtype;
        })();

        $scope.initialiseRow = function (product) {
            if ($scope.PaymentList.length > 0)
                return;
            var defaultPayment = getDefaultPayment();
            defaultPayment.Products = product;
            addDefaultPayment(defaultPayment);
            calculateMonthList(product);
        };
        $scope.onSubmit = function () {
            var defaultPayment = getDefaultPayment();
            defaultPayment.Products = $scope.Product;
            addDefaultPayment(defaultPayment);
        };
        $scope.Delete = function (index) {
            $scope.PaymentList.splice(index, 1);
        };

        $scope.stakeholdersOnProduct = function (name, product) {
            if (name.length < 2) {
                return [];
            }
            return datalayer.stakeholdersList(name, product);
        };

        $scope.save = function (paymentList) {
           return datalayer.save(paymentList).then(function () {
                $scope.Product = '';
                $scope.PaymentList = [];
            });
        };
    }]);