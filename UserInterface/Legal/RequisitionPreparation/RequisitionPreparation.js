﻿csapp.controller("RequisitionCtrl", ["$scope", "$csModels", "RequisitionDataLayer",
    function ($scope, $csModels, datalayer) {
        (function () {
            $scope.datalayer = datalayer;
            $scope.dldata = datalayer.dldata;
            $scope.legal = {};
            $scope.dldata.Products = ['AUTO', 'SMC', 'SME-BIL', 'MORT'];
            $scope.dldata.City = ['Mumbai', 'Pune', 'Kolkata', 'Bangalore', 'Hyderabad', 'Jaipur'];
            $scope.dldata.loanstatus = ['Disbursed', 'Do/Sanction LetterMade', 'FCI Allocated', 'FCI Despatched', 'FCI Notrequired', 'Received', 'In-Principally Sanctioned'];
            $scope.dldata.casestatus = ['Cancelled', 'Closed', 'Disposed', 'Expired', 'Legal', 'Live', 'Released', 'Repossessed'];
            $scope.legalprepare = $csModels.getColumns("RequisitionPreparation");
            $scope.dldata.Requisitiondata = [];
        })();

        $scope.Clear = function (legal) {
            return datalayer.clear(legal);
        };
        {
           
        }
        
        $scope.save = function (legal) {
            if (angular.isDefined(legal)) {
                $scope.showDiv = true;
            } else {
                $scope.showDiv = false;
            }
            legal.RequsitionNo = 123456789;
            legal.ReqDate = moment().format('L');
            legal.PartyName = 'sandip';
            legal.OSamount = 123456;
            legal.FutureReceivable = 'Unpredictable';
            return datalayer.save(legal);
        };
        

        $scope.Requisitionlist = [{
            GroupName: 'abcd123456789',
            Product: 'abc',
            ProductType: 'abcd',
            ModelName: 'Suzuki',
            VehicleNo: 'MH40 123',
            EngineNo: 123456789,
            ChasisNo: 123456789,
        }];

        $scope.legal = {
            Nameofhirer: 'Sandip',
            Addressasperaggrement: 'Pune',
            Presentaddress: 'Pune',
            Dateofrepossession: moment().format('L'),
            Dateofsalenotice: moment().format('L'),
            DateofSale: moment().format('L'),
            Saleconsideration: 'Old',
            Soldto: 'Parekh Agrawal',
            AddressSoldto: 'Mumbai',
            ReasonBranchIncharge : 'Because of customer deposite his monthly',
            AccusedName: 'Hakim',
            FileNo: 007,
            EntityType:true
    };
        
        $scope.Chequedata = [{
            PDCType: 'Order Cheque',
            ChequeNo: '1234abc',
            Date: moment().format('L'),
            DrawnonBank: 'Dena Bank',
            Depositdate: moment().format('L'),
            Bouncedate: moment().format('L'),
            BounceReason:'Amount not Enough',
        }];

    }]);

csapp.factory("RequisitionDataLayer", ["$csnotify", function ($csnotify) {

    var dldata = {};
    //var errorDisplay = function (response) {
    //    $csnotify.error(response);
    //};
  

    var save = function (legal) {
        dldata.Requisitiondata.push(legal);
    };

    var clear = function(legal) {
        legal.City = '';
        legal.Products = '';
        legal.LoanNo = '';
        legal.LoanStatus = '';
        legal.CaseStatus = '';
    };
   
    return {
        dldata: dldata,
        clear: clear,
        save: save,
        //reset: resetdata
    };
}]);
