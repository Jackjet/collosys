﻿csapp.factory("$csLegalModels", function () {

    var requisitionPreparation = function () {
        return {
            Prepare: { label: 'Select options', type: 'radio', options: [{ value: 'Add', display: 'Add' }, { value: 'Edit', display: 'Edit' }, { value: 'Approve', display: 'Approve' }], textField: 'display', valueField: 'value' },
            City: { label: 'City', type: 'select' },
            Products: { label: 'Products', type: 'select' },
            LoanNo: { label: 'Loan No', type: 'text' },
            LoanStatus: { label: 'Loan Status', type: 'select' },
            CaseStatus: { label: 'Case Status', type: 'select' },
        };
    };

    //$scope.location = [
    //    { state: "Maharashtra", District: "Osmanabad" },
    //    { state: "Maharashtra", District: "Nagpur" },
    //    { state: "Maharashtra", District: "Latur" },
    //    { state: "Maharashtra", District: "Beed" },
    //    { state: "Gujrat", District: "Ahemadabad" },
    //    { state: "Kolkatta", District: "Magma Carta" },
    //    { state: "Karnatka", District: "Banglore" }
    //];
    var requisitionIntiation = function () {
        return {
            Function: { label: 'Function', type: 'radio' },
            Location: { label: "Location", type: "select", textField: "state", valueField: "District" },
            Division: { label: "Division", type: "select", textField: "District", valueField: "District" },
            LoanNo: { label: "Loan No", type: "text" },
            DateFrom: { label: "Loan Date From", type: "text" },
            DateTo: { label: "Loan Date To", type: "text" },
            RequsitionNo: { label: "Requsition No", type: "text" },
            RequsitionDateFrom: { label: "Requsition Date From", type: "text" },
            RequsitionDateTo: { label: "Requsition Date To", type: "text" },

        };
    };

    var init = function () {
        var models = {};

        models.RequisitionPreparation = {
            Table: "RequisitionPreparation",
            Columns: requisitionPreparation(),
        };

        models.RequsitionIntiation = {
            Table: "RequsitionIntiation",
            Columns: requisitionIntiation(),
        };
        return models;
    };

    return {
        init: init
    };
});