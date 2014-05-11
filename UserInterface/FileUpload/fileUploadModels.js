﻿csapp.factory("$csFileUploadModels", ["$csShared", function ($csShared) {
    var models = {};

    var fileDetail = function () {
        return {
            AliasName: { label: "Alias Name", type: "enum", required: true, valueList: $csShared.enums.FileAliasName },
            AliasDescription: { label: "Alias Description", type: "text", required: true },
            FileName: { label: "File Name", type: "text", placeholder: "Enter File Name", required: true },
            FileCount: { label: "File Count", type: "number", template: 'uint', min: 1, max: 100, required: true, placeholder: "Enter no of files" },
            DependsOnAlias: { label: "DependsOnAlias", type: "enum", valueList: $csShared.enums.FileAliasName },
            FileReaderType: { type: "enum", valueList: $csShared.enums.FileUploadBy },
            DateFormat: { label: "Date Format", type: "enum", valueList: $csShared.enums.DateFormat, required: true },
            FileType: { label: "File Type", type: "enum", valueList: $csShared.enums.FileType, required: true, },
            SheetName: { label: "Sheet Name", type: "text", placeholder: "Enter Sheet Name"},
            Frequency: { label: "Frequency", type: "enum", valueList: $csShared.enums.FileFrequency, required: true, },
            SkipLine: { label: "Skip Line", type: "number", template: 'int', pattern: "/^[0-9]+$/", min: 0, required: true, placeholder: "Enter Skip Lines" },
            FileDirectory: { label: "FileDirectory", type: "text",  },
            ActualTable: { type: "enum", valueList: $csShared.enums.ClientDataTables },
            EmailId: { label: "Email Id", type: "email", required: true },
            Description: { label: "Description", type: "text", required: true },
            UsedFor: { label: "UsedFor", type: "enum", valueList: $csShared.enums.UsedFor, required: true },
            StartDate: { label: "Start Date", type: "date", required: true },
            EndDate: { label: "End Date", type: "date", required: true },
            ScbSystems: { label: "SCB Systems", type: "enum", valueList: $csShared.enums.ScbSystems, required: true, },
            Category: { label: "Category", type: "enum", valueList: $csShared.enums.Category, required: true },
        };
    };

    var fileColumn = function () {

        return {
            Position: { label: "Position", type: "number", template: 'int', required: true, min: 0 },
            FileColumnName: { label: "Excel Column Name", required: true, type: "text", editable: false },
            Description: { label: "Description", type: "text" },
            Length: { label: "Length", type: "number", template: "int", min: 0, required: true },
            ColumnDataType: { label: "Column Data Type", type: "enum", valueList: $csShared.enums.FileDataType, required: true },
            TempColumnName: { label: "DB Column Name", type: "text", required: true, pattern: "/^\w*$/", patternMessage: "Invalid Column Name" },
            DateFormat: { label: "Date Format", type: "enum", valueList: $csShared.enums.DateFormat },
            StartDate: { label: "Start Date", type: "date", required: true },
            EndDate: { label: "End Date", type: "date" }//data-date-start-date have function.
        };
    };
    var fileMapping = function () {
        return {
            ActualTable: { label: "Actual Table", type: "text", editable: false },
            FileDetail: { label: "File Name", type: "enum" },// tobe disscuss Enum query 
            ActualColumn: { label: "Actual Column", type: "text" },
            Position: { label: "Position", type: "number",template:"uint", required: true },
            OutputPosition: { label: "Output Position", type: "number",template:"uint", required: true },
            OutputColumnName: { label: "Output ColumnName", type: "text", required: true },
            ValueType: { label: "Value Type", type: "enum", valueList: $csShared.enums.FileMappingValueType, required: true },
            TempTable: { label: "Temp Table", type: "text" },
            TempColumn: { label: "Temp Column", type: "text", required: true },//similar to FileDetails
            DefaultValue: { label: "Default Value", type: "text", required: true },
            StartDate: { label: "Start Date", type: "date", required: true },
            EndDate: { label: "End Date", type: "date", required: true },
            fileDetail: { label: "File Name", type: 'select', valueField: 'Id', textField: 'AliasName' },
            actualTable: { label: 'Actual Table', type: 'text' }

        };
    };

    var customerInfo = function () {
        return {
            Flag: { type: "enum", valueList: $csShared.enums.DelqFlag },
            AccountNo: { label: "AccountNo", type: "text", valueList: [], pattern: "/^[0-9]+$/", placeholder: "Enter Account Number", required: true },
            GlobalCustId: { type: "enum", valueList: [] },
            CustomerName: { label: "CustomerName", type: "text" },
            Pincode: { label: "Pincode", type: "number", template: "uint" },
            Product: { label: "Product", type: "enum", valueList: $csShared.enums.Products },
            CustStatus: { label: "CustStatus", type: "text" },
            AllocStartDate: { label: "AllocStartDate", type: "date" },
            IsInRecovery: { type: "enum", valueList: ['Yes', 'No'] },//to be disscuss for checkbox
            IsReferred: { label: "IsReferred", type: 'radio', options: [{ value: true, key: 'True' }, { value: false, key: 'False' }], valueField: 'value', textField: 'key', },
            IsXHoldAccount: { type: "enum", valueList: ['Yes', 'No'] },
            AllocEndDate: { label: "AllocEndDate", type: "date" },
            ChargeofDate: { type: "date" },
            AllocStatus: { type: "enum", valueList: $csShared.enums.AllocStatus },
            TotalDue: { label: "TotalDue", type: "number", template: "decimal" },
            NoAllocResons: { label: "NoAllocResons", type: "text" },
            Cycle: { label: "Cycle", type: "number", template: "uint" },
            Bucket: { label: "Bucket", type: "number", template: "uint" },
            ConditionSatisfy: { type: 'text' },
            ResolutionPercentage: { type: 'number', template: 'percentage' },
            MobWriteoff: { type: "number", template: "uint" },
            Vintage: { type: "number", template: "uint" },
            TotalDueOnAllocation: { type: "number", template: "uint" },
            TotalAmountRecovered: { type: "number", template: "uint" },
            City: { type: 'text' },
            CityCategory: { type: 'enum', valueList: $csShared.enums.CityCategory },
            ////TODO: remove ICICI
            //LanNo: { label: 'LanNo', type: 'text' },
            //Zone: { label: 'Zone', type: 'text' },
            //Region: { label: 'Region', type: 'text' },
            //Location: { label: 'Location', type: 'text' },
            //CustName: { label: 'CustName', type: 'text' },
            //SanctionAmt: { label: 'SanctionAmt', type: 'number', template: 'ulong' },
            //StartDate: { label: 'StartDate', type: 'date' },
            //SanctionDate: { label: 'SanctionDate', type: 'date' },
            //AgreementDate: { label: 'AgreementDate', type: 'date' },
            //CustCat: { label: 'CustCat', type: 'text' },
            //IRR: { label: 'IRR', type: 'number', template: 'decimal' },
            //Tenure: { label: 'Tenure', type: 'number', template: 'ulong' },
            //RepaymentMode: { label: 'RepaymentMode', type: 'text' },
            //AssetCode: { label: 'AssetCode', type: 'number', template: 'ulong' },
            //AssetType: { label: 'AssetType', type: 'text' },
            //Scheme: { label: 'Scheme', type: 'text' },
            //DisbMemoNo: { label: 'DisbMemoNo', type: 'text' },
            //DisbMemoDate: { label: 'DisbMemoDate', type: 'date' },
            //ProcessingFees: { label: 'ProcessingFees', type: 'number', template: 'ulong' },
            //NetDisb: { label: 'NetDisb', type: 'number', template: 'ulong' },
            //DisbAmt: { label: 'DisbAmt', type: 'number', template: 'ulong' },
            //DisbMode: { label: 'DisbMode', type: 'text' },
            //DisbStatus: { label: 'DisbStatus', type: 'text' },
            //EmpIdCredit: { label: 'EmpIdCredit', type: 'number', template: 'ulong' },
            //EmpIdOps: { label: 'EmpIdOps', type: 'text' },
            //LoanSource: { label: 'LoanSource', type: 'text' },
            //DMACode: { label: 'DMACode', type: 'number', template: 'long' },
            //CityCat: { label: 'CityCat', type: 'enum', valueList: $csShared.enums.CityCategory },
            //LoanType: { label: 'LoanType', type: 'text' },
            //MemoApprovalDate: { label: 'MemoApprovalDate', type: 'date' },
            //SubProduct: { label: 'Subproduct', type: 'text' },
            //TotalPF: { label: 'TotalPF', type: 'number', template: 'ulong' },
            //TotalDisb: { label: 'TotalDisb', type: 'number', template: 'ulong' },
            //TotalPayout: { label: 'TotalPayout', type: 'number', template: 'ulong' },
            //Payout: { label: 'Payout', type: 'number', template: 'ulong' }
        };
    };

    var fcondition = function () {
        return {
            RelationType: { type: "enum", valueList: $csShared.enums.RelationType },
            ColumnName: { label: "ColumnName", type: "text" },
            Operator: { label: "Operator", type: "enum", valueList: $csShared.enums.ConditionOperators },
            Value: { label: "Value", type: "text" },
            FilterCondition: { label: "FilterCondition", type: "text" }
        };
    };

    var filterCondition = function () {
        return {
            FileDetail: { label: "FileDetail", type: "text" },
            AliasConditionName: { label: "Name", type: "text" }
        };
    };

    var excludeCase = function () {
        return {
            Products: { label: "Product", type: "enum", valueList: $csShared.enums.ProductEnum, required: true },
            AccountNo: { label: "AccountNo", type: "text", required: true, pattern: "/^[0-9]+$/" },
            customerName: { label: "customerName", type: "text", required: "true" },
            TransCode: { label: "Transaction Code", type: "text", pattern: "/^[0-9]+$/", required: 'true' },
            TransDate: { label: "TransDate", type: "date", required: "true" },
            TransDesc: { label: "Remark", type: "text", required: "true" },
            TransAmount: { label: "Amount", type: "text", pattern: "/^[0-9]+$/", required: true },
            IsDebit: { label: 'Transaction Type', type: 'radio', options: [{ value: 'Payment', key: 'Payment' }, { value: 'Reversal', key: 'Reversal' }], valueField: 'value', textField: 'key', required: true },

        };
    };

    var uploadPincode = function () {
        return {
            Product: { label: "Product", type: "enum", valueList: $csShared.enums.ProductEnum, required: true },
        };
    };

    var clientDataDownload = function () {
        return {
            ShowDataBy: { label: 'Download By', type: 'select', textField: 'display', valueField: 'value' },
            SelectedProduct: { label: 'Product', type: "enum", valueList: $csShared.enums.ProductEnum },
            SelectedSystem: { label: 'System', type: 'enum', valueList: $csShared.enums.ScbSystems },
            SelectedCategory: { label: 'Category', type: 'select' },
            SelectedDate: { label: 'Date', type: 'date' }
        };
    };

    var fileStatus = function () {
        return {
            fromDate: { label: 'Date Range', type: 'date' },
            toDate: { label: 'Date Range', type: 'date' },
        };
    };

    var fileScheduler = function () {
        return {
            SelectedSystem: { label: 'System', type: 'select' },
            SelectedCategory: { label: 'Product', type: 'select' },
            SelectedDateDaily: { label: 'File Date', type: 'date', template: 'Daily' },
            SelectedDateWeekly: { label: 'File Date', type: 'date', template: 'Weekly' },
            SelectedDateMonthly: { label: 'File Date', type: 'date', template: 'Monthly' },
            IsImmediate: { label: 'Select Schedule', type: 'radio', options: [{ value: 'true', key: 'Immediate' }, { value: 'false', key: 'Nightly' }], valueField: 'value', textField: 'key' },
            ImmediateReason: { label: 'ImmediateReason',type:'textarea', required: true, minlength: 5 }
        };
    };

    var init = function (tables) {
        models.FileDetail = fileDetail();
        models.FileColumn = fileColumn();
        models.FileMapping = fileMapping();
        models.UploadPincode = uploadPincode();
        models.CustomerInfo = customerInfo();
        models.Fcondition = fcondition();
        models.FilterCondition = filterCondition();
        models.ExcludeCase = excludeCase();
        models.ClientDataDownload = clientDataDownload();
        models.FileStatus = fileStatus();
        models.FileScheduler = fileScheduler();

        tables.FileDetail = models.FileDetail;
        tables.CustomerInfo = models.CustomerInfo;
        return models;
    };



    return {
        init: init,
        models: models
    };
}]);
