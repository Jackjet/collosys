﻿csapp.factory('matrixDataLayer', ['Restangular', '$csnotify', '$csModels',
    function (rest, $csnotify, $csModels) {
        var restApi = rest.all("MatrixApi");
        var dldata = {};
        dldata.columnDef = [];

        dldata.custInfoData = $csModels.getColumns("CustomerInfo"); //customerInfo from model.js

        var getProducts = function () {
            restApi.customGET("GetProducts").then(function (data) {
                dldata.productsList = data;
            }, function (data) {
                $csnotify.error(data);
            });
        };

        var selectMatrix = function (smatrix) {
            dldata.isMatrixCreated = false;
            dldata.matrix = {};
            dldata.matrix.BMatricesValues = [];
            restApi.customGET("GetMatrixValues", { matrixId: smatrix.Id }).then(function (data) {
                dldata.isMatrixCreated = true;
                dldata.matrix = angular.copy(smatrix);
                dldata.matrix.BMatricesValues = data;
            }, function (data) {
                $csnotify.error(data);
            });
        };

        var changeProductCategory = function () {
            dldata.isDuplicate = false;
            var matrix = dldata.matrix;
            matrix.Category = "Liner";
            if (dldata.isMatrixCreated == true)
                return;
            if (angular.isUndefined(matrix)) {
                return;
            }
            if (!angular.isUndefined(matrix.Products)) {

                // get matrix
                restApi.customGET("GetMatrix", { product: matrix.Products }).then(function (data) {
                    dldata.matrixList = data;
                }, function (data) {
                    $csnotify.error(data);
                });

                //get column names
                restApi.customGET("GetColumnNames").then(function (data) {
                    dldata.columnNames = [];
                    dldata.columnDef = data;
                    _.forEach(data, function (item) {
                        dldata.columnNames.push(item.field);
                    });
                    // $scope.columnNames = data;
                }, function (data) {
                    $csnotify.error(data);
                });

                // get formula names
                restApi.customGET("GetFormulaNames", { product: matrix.Products }).then(function (data) {
                    dldata.formulaNames = data;
                }, function (data) {
                    $csnotify.error(data);
                });
            }
        };

        var saveMatrix = function (matrix) {
            _.forEach(matrix.BMatricesValues, function (item) {
                item.ColumnOperator = operatorNameFromValue(item.ColumnOperator);
                item.RowOperator = operatorNameFromValue(item.RowOperator);
            });
            matrix.Dimension = parseInt(matrix.Dimension);
           return restApi.customPOST(matrix, "Post")
                .then(function (data) {
                    $csnotify.success('matrix created successfully');
                    afterSavedMatrix(data);
                }, function (data) {
                    $csnotify.error(data);
                });
        };

        var operatorNameFromValue = function (selValue) {
            return dldata.operatorsEnumReverse[selValue];
        };

        var afterSavedMatrix = function (data) {
            dldata.matrixList = _.reject(dldata.matrixList,
                function (mat) { return mat.Id == data.Id; });
            dldata.matrixList.push(data);
            dldata.matrix = angular.copy(data);
            reset();
        };
        var reset = function () {
            dldata.isMatrixCreated = false;
            dldata.matrix = {};
            dldata.matrix.Category = 'Liner';
        };

        return {
            dldata: dldata,
            getProducts: getProducts,
            selectMatrix: selectMatrix,
            changeProductCategory: changeProductCategory,
            saveMatrix: saveMatrix,
            reset: reset
        };
    }]);

csapp.factory('matrixFactory', ['matrixDataLayer', '$csfactory',
    function (datalayer, $csfactory) {
        var dldata = datalayer.dldata;

        var initEnumsConst = function () {
            dldata.operatorsEnum = {
                'GreaterThan': '>',
                'LessThan': '<',
                'GreaterThanEqualTo': '>=',
                'LessThanEqualTo': '<=',
                'EqualTo': '='
            };

            dldata.operatorsEnumReverse = {
                '>': 'GreaterThan',
                '<': 'LessThan',
                '>=': 'GreaterThanEqualTo',
                '<=': 'LessThanEqualTo',
                '=': 'EqualTo'
            };

            dldata.categorySwitch = [{ Name: 'Collection', Value: 'Liner' }, { Name: 'Recovery', Value: 'WriteOff' }];
            dldata.typeSwitch = [{ Name: 'Table', Value: 'Table' }, { Name: 'Formula', Value: 'Formula' }];
            dldata.columnNames = [];
        };

        var buttonDisable = function (dimension) {
            switch (dimension) {
                case "2":
                    if (!$csfactory.isNullOrEmptyString(dldata.matrix.Row1DTypeName))
                        if (dldata.matrix.Row1DTypeName === dldata.matrix.Column2DTypeName)
                            return true;
                    break;
            }
            return false;
        };

        var changeDimension = function (matrix) {
            matrix.Row1DCount = 1;
            matrix.Row1DType = "Table";
            matrix.Row1DTypeName = "";
            matrix.Column2DCount = 1;
            matrix.Column2DType = "Table";
            matrix.Column2DTypeName = "";
        };

        var createMatrix = function (matrix) {
            dldata.isMatrixCreated = false;
            matrix.BMatricesValues = [];
            for (var i = 0; i < matrix.Row1DCount + 1; i++) {
                if (matrix.Dimension == 1 && i == 0) {
                    continue;
                }
                for (var j = 0; j < matrix.Column2DCount + 1; j++) {
                    if (i == 0 && j == 0) {
                        continue;
                    }
                    var matrixValue = {
                        RowNo1D: i,
                        ColumnNo2D: j,
                        RowNo3D: 0,
                        ColumnNo4D: 0,
                        Value: '',   //i + j
                        RowOperator: 'None',
                        ColumnOperator: 'None'
                    };
                    matrix.BMatricesValues.push(angular.copy(matrixValue));
                }
            }
            dldata.isMatrixCreated = true;
        };

        var checkDupName = function (name) {
            dldata.isDuplicate = false;
            if (!$csfactory.isNullOrEmptyString(name)) {
                _.find(dldata.matrixList, function (item) {
                    if (item.Name.toUpperCase() === name.toUpperCase()) {
                        dldata.isDuplicate = true;
                        return;
                    }
                });
            }
        };

        var highlightSelectedMatrix = function (smatrix) {
            if (smatrix.Name.toUpperCase() === dldata.matrix.Name.toUpperCase())
                return { backgroundColor: 'rgba(195, 201, 204, 0.24)' };
            return { backgroundColor: 'white' };
        };

        var getMatrixValue = function (row, col) {
            var matVal = _.find(dldata.matrix.BMatricesValues, function (matrixVal) {
                return (matrixVal.RowNo1D == row && matrixVal.ColumnNo2D == col);
            });
            return matVal;
        };

        var highlightColumn = function (n) {
            if (n === 0) {
                return ({ backgroundColor: 'rgba(128, 128, 128, 0.29)' });
            }
            return ({ backgroundColor: '' });
        };

        var opertorValue = function (index, totalRows, selOperator) {
            if (index === totalRows) {
                return dldata.operatorsEnum[getOppositeOperator(selOperator)];
            }
            return dldata.operatorsEnum[selOperator];
        };

        var setInputTypeForColumn = function (columnTypeValue) {
            var inputTypeItem = _.find(dldata.columnDef, function (item) {
                return (item.field === columnTypeValue);
            });
            dldata.columnType = inputTypeItem.InputType === 'number' ? inputTypeItem.InputType : 'text';
        };

        var setInputTypeForRow = function (rowTypeValue) {
            var inputTypeItem = _.find(dldata.columnDef, function (item) {
                if (item.field === rowTypeValue)
                    return item;
            });
            dldata.rowType = inputTypeItem.InputType === 'number' ? inputTypeItem.InputType : 'text';
        };

        var getOppositeOperator = function (selOperator) {
            if (angular.isUndefined(selOperator) || selOperator === "None") {
                return "";
            }
            if (selOperator === 'GreaterThan') {
                return 'LessThanEqualTo';
            }
            if (selOperator === 'LessThan') {
                return 'GreaterThanEqualTo';
            }
            if (selOperator === 'EqualTo') {
                return 'EqualTo';
            }
            throw "Invalid operator in getOppositeOperator";
        };

        var getInputType = function (rowIndex, columnIndex) {
            if (rowIndex === 0 && columnIndex > 0) {
                return dldata.columnType;
            }
            if (rowIndex > 0 && columnIndex === 0) {
                return dldata.rowType;
            }
            return 'text';
        };

        var getInputPattern = function (rowIndex, columnIndex) {
            if (rowIndex === 0 && columnIndex > 0) {
                return "/^[a-zA-Z0-9]{1,100}$/";
            }
            if (rowIndex > 0 && columnIndex === 0) {
                return "/^[a-zA-Z0-9]{1,100}$/";
                //return dldata.rowType;
            }
            return "/^[0-9]{1,7}(\.[0-9]+)?$/";
        };

        var isDisabled = function (rowIndex, columnIndex, totalRows, totalColumns, matrixValue) {
            if (rowIndex === totalRows && columnIndex === 0 && matrixValue.RowOperator !== '=') {
                return true;
            }
            if (columnIndex === totalColumns && rowIndex === 0 && matrixValue.ColumnOperator !== '=') {
                return true;
            }
            return false;
        };

        var setNextValue = function (rowIndex, columnIndex, totalRows, totalColumns, value) {
            var matrixValue;
            if (rowIndex === totalRows - 1 && columnIndex === 0) {
                matrixValue = getMatrixValue(rowIndex + 1, columnIndex);
                matrixValue.Value = value;
            }
            if (columnIndex === totalColumns - 1 && rowIndex === 0) {
                matrixValue = getMatrixValue(rowIndex, columnIndex + 1);
                matrixValue.Value = value;
            }
        };

        return {
            initEnumsConst: initEnumsConst,
            buttonDisable: buttonDisable,
            changeDimension: changeDimension,
            createMatrix: createMatrix,
            checkDupName: checkDupName,
            highlightSelectedMatrix: highlightSelectedMatrix,
            getMatrixValue: getMatrixValue,
            highlightColumn: highlightColumn,
            opertorValue: opertorValue,
            setInputTypeForColumn: setInputTypeForColumn,
            setInputTypeForRow: setInputTypeForRow,
            getOppositeOperator: getOppositeOperator,
            getInputType: getInputType,
            getInputPattern: getInputPattern,
            isDisabled: isDisabled,
            setNextValue: setNextValue
        };
    }]);

csapp.controller('matrixCtrl', [
    '$scope', 'matrixDataLayer', 'matrixFactory', '$csModels',
    function ($scope, datalayer, factory, $csModels) {
        (function () {
            $scope.dldata = datalayer.dldata;
            $scope.datalayer = datalayer;
            $scope.factory = factory;
            factory.initEnumsConst();
            $scope.Matrix = $csModels.getColumns("Matrix");
            datalayer.getProducts();
        })();

        $scope.change = function (condition) {
            var con = condition.toString();
            var field = con.split(".");
            if (field[0] === "CustBillViewModel") {
                field[0] = "Customer";
                var fieldName = "";
                fieldName = (field[0] + "." + field[1]);
                return fieldName;
            } else {
                return condition;
            }

        };
    }]);