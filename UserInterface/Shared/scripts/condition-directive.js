﻿csapp.directive("csOutput", function () {
    return {
        restrict: 'E',
        controller: 'outputCtrl',
        templateUrl: baseUrl + 'Shared/templates/output-directive.html',
        scope: {
            tableName: '@',
            selected: '=',
            formulaList: '=',
            groupId: '@',
            tokensList: '=',
            debug:'@'
        }
    };

});

csapp.controller('outputCtrl', ['$scope', '$csModels', 'operatorsFactory', 'tokenValidations', 'queryGenHelpers', 'tokenHelpers',
    function ($scope, $csmodels, operatorFactory, validations, helpers, tokenHelpers) {

        //#region init
        var tokenHelper = tokenHelpers.tokenHelper;

        var initLocals = function () {
            $scope.modal = $csmodels.getTable($scope.tableName);
            initToken();
        };

        var initToken = function () {
            $scope.tokens = {
                tokensList: [],
                selected: [],
                nextTokens: [],
                lastToken: {},
                collections: {
                    formulaListC: [],
                    tableColumns: []
                },
                filterString: ''
            };
            $scope.tokensList = $scope.tokens.selected;
        };

        var initFirstTokens = function () {
            tokenHelper.initListOutput($scope.tokens, $scope.modal,
                $scope.tableName, $scope.formulaList);

            $scope.tokens.nextTokens = _.filter($scope.tokens.tokensList, function (row) {
                return ((row.Type == 'Formula' || row.Type == 'Table' || row.Type == 'Sql') && row.DataType == 'number');
            });
            return;
        };

        var assignTokensForEdit = function () {
            if ($scope.tokensList.length > 0) {
                $scope.tokens.selected = _.sortBy($scope.tokensList,'Priority');
            }
        };

        (function () {
            initLocals();
            initFirstTokens();
        })();

        $scope.$watch('formulaList', initFirstTokens);

        $scope.$watch('tokensList', assignTokensForEdit);
        //#endregion

        //#region 

        $scope.addToken = function (item, model, label) {
            tokenHelper.addTokenToTokenList($scope.tokens, item,$scope.groupId);
            setNextToken(item);
        };

        $scope.addValue = function (value) {
            if (validations.validateValue($scope.tokens, value)) {
                var seleVal = tokenHelper.setAddValue($scope.tokens, value, $scope.groupId);
                setNextToken(seleVal);
            } else {
                $scope.tokens.error = 'Please select field or operator first';
                tokenHelper.clearFilterString($scope.tokens);
            }
        };

        $scope.tokens.resetClearList = function () {
            $scope.tokens.tokensList = [];
            $scope.tokens.nextTokens = [];
            $scope.tokens.collections.formulaListC = [];
            $scope.tokens.collections.tableColumns = [];
        };

        var setNextToken = function (token) {
            if (token.Type == 'Operator' || token.Type == 'Sql') {
                $scope.tokens.nextTokens = _.filter($scope.tokens.tokensList, function (row) {
                    return ((row.Type == 'Formula' || row.Type == 'Table') &&
                    (row.datatype === token.datatype));
                });
                if (token.datatype == 'number') {
                    $scope.tokens.nextTokens = _.union($scope.tokens.nextTokens, _.filter($scope.tokens.tokensList, function (row) {
                        return (row.Type == 'Sql');
                    }));
                }
            } else if (token.Type == 'Formula' || token.Type == 'Table') {
                $scope.tokens.nextTokens = _.filter($scope.tokens.tokensList, function (row) {
                    return ((row.Type === 'Operator') && (row.datatype === token.datatype));
                });
            } else if (token.Type === 'Value') {
                $scope.tokens.nextTokens = _.filter($scope.tokens.tokensList, function (row) {
                    return ((row.Type === 'Operator') && (row.datatype === $scope.tokens.secondLastToken.datatype));
                });
            }

            if (token.Type == 'Sql') {
                $scope.tokens.nextTokens = _.filter($scope.tokens.nextTokens, function (row) {
                    return (row.Type !== token.Type);
                });
            }
        };

        $scope.setValidation = function () {
            if ($scope.tokens.lastToken.Type == 'Operator' || $scope.tokens.selected.length<2) {
                return 'alert-danger';
            }
            return 'alert-info';
        };

        $scope.reset = function () {
            initToken();
            initFirstTokens();
        };

    }]);


//#region Condition directive
csapp.directive("csCondition", function () {
    return {
        restrict: 'E',
        controller: 'conditionCtrl',
        templateUrl: baseUrl + 'Shared/templates/condition-directive.html',
        scope: {
            tableName: '@',
            selected: '=',
            formulaList: '=',
            groupId: '@',
            tokensList: '=',
            debug: '@'
        }
    };

});

csapp.controller('conditionCtrl', ['$scope', '$csModels', 'operatorsFactory', 'tokenValidations', 'queryGenHelpers', 'tokenHelpers',
    function ($scope, $csmodels, operatorFactory, validations, helpers, tokenHelpers) {

        //#region init
        var tokenHelper = tokenHelpers.tokenHelper;

        var initLocals = function () {
            $scope.modal = $csmodels.getTable($scope.tableName);
            initToken();
        };

        var initToken = function () {
            $scope.tokens = {
                tokensList: [],
                selected: [],
                nextTokens: [],
                lastToken: {},
                collections: {
                    formulaListC: [],
                    tableColumns: []
                },
                filterString: '',
                hasConditional:false
            };
            $scope.tokensList = $scope.tokens.selected;
        };

        var initFirstTokens = function () {
            tokenHelper.initListsConditions($scope.tokens, $scope.modal,
                $scope.tableName, $scope.formulaList);

            $scope.tokens.nextTokens = _.filter($scope.tokens.tokensList, function (row) {
                return (row.Type == 'Formula' || row.Type == 'Table');
            });
            return;
        };
        
        var assignTokensForEdit = function () {
            if ($scope.tokensList.length > 0) {
                $scope.tokens.selected = _.sortBy($scope.tokensList, 'Priority');
            }
        };

        (function () {
            initLocals();
            initFirstTokens();
        })();

        $scope.$watch('formulaList', initFirstTokens);
        
        $scope.$watch('tokensList', assignTokensForEdit);

        //#endregion

        //#region 

        $scope.addToken = function (item, model, label) {
            tokenHelper.addTokenToTokenList($scope.tokens, item, $scope.groupId);
            if (item.datatype == 'conditional') {
                $scope.tokens.hasConditional = true;
            }
            if (item.datatype == 'relational') {
                $scope.tokens.hasConditional = false;
            }
            setNextToken(item);
        };

        $scope.addValue = function (value) {
            if (validations.validateValue($scope.tokens, value)) {
                var seleVal = tokenHelper.setAddValue($scope.tokens, value, $scope.groupId);
                seleVal.datatype = $scope.tokens.secondLastToken.datatype;
                setNextToken(seleVal);
            } else {
                $scope.tokens.error = 'Please select field or operator first';
                tokenHelper.clearFilterString($scope.tokens);
            }
        };

        $scope.tokens.resetClearList = function () {
            $scope.tokens.tokensList = [];
            $scope.tokens.nextTokens = [];
            $scope.tokens.collections.formulaListC = [];
            $scope.tokens.collections.tableColumns = [];
        };

        var setNextToken = function (token) {
            if (token.Type == 'Operator') {
                $scope.tokens.nextTokens = _.filter($scope.tokens.tokensList, function(row) {
                    return ((row.Type == 'Formula' || row.Type == 'Table') &&
                    (row.datatype == $scope.tokens.secondLastToken.datatype));
                });
            } else { //(token.Type == 'Formula' || token.Type == 'Table' || token.Type=='Value')
                if ($scope.tokens.hasConditional) {
                    $scope.tokens.nextTokens = _.filter($scope.tokens.tokensList, function (row) {
                        return ((row.Type == 'Operator') && (row.datatype == 'relational' ||
                            $scope.tokens.lastToken.datatype == row.datatype));
                    });
                } else {
                    $scope.tokens.nextTokens = _.filter($scope.tokens.tokensList, function (row) {
                        return ((row.Type == 'Operator') && (row.datatype == 'conditional' ||
                            $scope.tokens.lastToken.datatype == row.datatype));
                    });
                }
            }
        };

        $scope.setValidation = function() {
            if ($scope.tokens.hasConditional && $scope.tokens.lastToken.Type !== 'Operator') {
                return 'alert-info';
            }
            return 'alert-danger';
        };
        
        $scope.reset = function () {
            initToken();
            initFirstTokens();
        };

    }]);
//#endregion

//#region Single If else directive
csapp.directive('csIfElse', function() {
    return {
        restrict: 'E',
        controller: 'ifElseCtrl',
        templateUrl: baseUrl + 'Shared/templates/if-else-directive.html',
        scope: {
            tableName: '@',
            selected: '=',
            formulaList: '=',
            groupId: '@',
            tokensList: '=',
            debug: '@'
        }
    };
});

csapp.controller('ifElseCtrl', ['$scope', '$csModels', 'operatorsFactory', 'tokenValidations', 'queryGenHelpers', 'tokenHelpers',
    function ($scope, $csmodels, operatorFactory, validations, helpers, tokenHelpers) {
        
    }]);
//#endregion



csapp.factory('tokenValidations', ['$csfactory', function ($csfactory) {

    var validateOperator = function (tokens, newToken) {

        if (newToken.datatype === 'sql' &&
            (angular.isDefined(tokens.lastToken.Type) &&
                tokens.lastToken.Type !== 'Operator'))
            return false;

        if (newToken.datatype === 'sql' &&
            (angular.isDefined(tokens.lastToken.Type)
                && tokens.lastToken.Type === 'Operator'
                && tokens.lastToken.datatype !== 'sql')) {
            return true;
        }

        if (angular.isDefined(tokens.lastToken.Type) && tokens.lastToken.Type !== 'Operator')
            return true;
        if (newToken.datatype === 'sql') {
            if (tokens.lastToken.datatype !== 'sql') {
                return true;
            } else {
                return false;
            }
        }

        return false;
    };

    var validateFormula = function (tokens, newToken) {
        if (angular.isUndefined(tokens.lastToken.Type)) {
            return true;
        }
        if (tokens.lastToken.Type == 'Operator') {
            return true;
        }
        return false;
    };

    var validateTable = function (tokens, newToken) {
        return validateFormula(tokens, newToken);
    };

    var validate = function (tokens, newToken) {
        var result = false;
        switch (newToken.Type) {
            case 'Operator':
                result = validateOperator(tokens, newToken);
                break;
            case 'Formula':
                result = validateFormula(tokens, newToken);
                break;
            case 'Table':
                result = validateTable(tokens, newToken);
                break;
            default:
        }

        return result;
    };

    var validateValue = function (tokens, value) {
        if (angular.isDefined(tokens.lastToken.Type) &&
            tokens.lastToken.Type === 'Operator') {
            return true;
        }
        return false;
    };

    return {
        validate: validate,
        validateValue: validateValue
    };
}]);

csapp.factory('operatorsFactory', function () {
    var operators = {};

    operators.numberOperators = function () {
        return [
            {
                'Type': 'Operator',
                'Text': 'Opr:+',
                'Value': 'Plus',
                'DataType': 'number',
                'valuelist': []
            },
            {
                'Type': 'Operator',
                'Text': 'Opr:-',
                'Value': 'Minus',
                'DataType': 'number',
                'valuelist': []
            },
            {
                'Type': 'Operator',
                'Text': 'Opr:/',
                'Value': 'Divide',
                'DataType': 'number',
                'valuelist': []
            },
            {
                'Type': 'Operator',
                'Text': 'Opr:*',
                'Value': 'Multiply',
                'DataType': 'number',
                'valuelist': []
            },
            {
                'Type': 'Operator',
                'Text': 'Opr:%',
                'Value': 'ModuloDivide',
                'DataType': 'number',
                'valuelist': []
            }
        ];
    };

    operators.conditionals = function () {
        return [
            {
                'Type': 'Operator',
                'Text': 'Opr:=',
                'Value': 'EqualTo',
                'DataType': 'conditional',
                'valuelist': []
            },
            {
                'Type': 'Operator',
                'Text': 'Opr:!=',
                'Value': 'NotEqualTo',
                'DataType': 'conditional',
                'valuelist': []
            },
            {
                'Type': 'Operator',
                'Text': 'Opr:<',
                'Value': 'LessThan',
                'DataType': 'conditional',
                'valuelist': []
            },
            {
                'Type': 'Operator',
                'Text': 'Opr:<=',
                'Value': 'LessThanEqualTo',
                'DataType': 'conditional',
                'valuelist': []
            },
            {
                'Type': 'Operator',
                'Text': 'Opr:>',
                'Value': 'GreaterThan',
                'DataType': 'conditional',
                'valuelist': []
            },
            {
                'Type': 'Operator',
                'Text': 'Opr:>=',
                'Value': 'GreaterThanEqualTo',
                'DataType': 'conditional',
                'valuelist': []
            }
        ];
    };

    operators.relationals = function () {
        return [{
            'Type':
                'Operator',
            'Text':
                'Opr:And',
            'Value':
                'AND',
            'DataType':
                'relational',
            'valuelist':
                []
        },
            {
                'Type':
                    'Operator',
                'Text':
                    'Opr:Or',
                'Value':
                    'OR',
                'DataType':
                    'relational',
                'valuelist':
                    []
            }];
    };

    operators.stringOperators = function () {
        return [
             {
                 'Type': 'Operator',
                 'Text': 'Opr:=',
                 'Value': 'EqualTo',
                 'DataType': 'Text',
                 'valuelist': []
             },
             {
                 'Type': 'Operator',
                 'Text': 'Opr:!=',
                 'Value': 'NotEqualTo',
                 'DataType': 'Text',
                 'valuelist': []
             },
            {
                'Type': 'Operator',
                'Text': 'Opr:Contains',
                'Value': 'Contains',
                'DataType': 'Text',
                'valuelist': []
            },
            {
                'Type': 'Operator',
                'Text': 'Opr:DoNotContains',
                'Value': 'DoNotContains',
                'DataType': 'Text',
                'valuelist': []
            },
            {
                'Type': 'Operator',
                'Text': 'Opr:StartsWith',
                'Value': 'StartsWith',
                'DataType': 'Text',
                'valuelist': []
            },
            {
                'Type': 'Operator',
                'Text': 'Opr:EndsWith',
                'Value': 'EndsWith',
                'DataType': 'Text',
                'valuelist': []
            },
            {
                'Type': 'Operator',
                'Text': 'Opr:IsInList',
                'Value': 'IsInList',
                'DataType': 'Text',
                'valuelist': []
            }
        ];
    };

    operators.sqlOperators = function () {
        return [
            {
                'Type': 'Sql',
                'Text': 'Avg Of',
                'Value': 'AVG',
                'DataType': 'number',
                'valuelist': []
            },
            {
                'Type': 'Sql',
                'Text': 'Count Of',
                'Value': 'COUNT',
                'DataType': 'number',
                'valuelist': []
            },
            {
                'Type': 'Sql',
                'Text': 'Sum Of',
                'Value': 'SUM',
                'DataType': 'number',
                'valuelist': []
            }
        ];
    };

    operators.dateOperators = function () {
        return [
             {
                 'Type': 'Operator',
                 'Text': 'Date:Today',
                 'Value': 'Today',
                 'DataType': 'Date',
                 'valuelist': []
             },
            {
                'Type': 'Operator',
                'Text': 'Date:Yesterday',
                'Value': 'Yesterday',
                'DataType': 'Date',
                'valuelist': []
            },
            {
                'Type': 'Operator',
                'Text': 'Date:Tommorow',
                'Value': 'Tommorow',
                'DataType': 'Date',
                'valuelist': []
            },
            {
                'Type': 'Operator',
                'Text': 'Date:MonthStart',
                'Value': 'MonthStart',
                'DataType': 'Date',
                'valuelist': []
            },
            {
                'Type': 'Operator',
                'Text': 'Date:MonthEnd',
                'Value': 'MonthEnd',
                'DataType': 'Date',
                'valuelist': []
            }
        ];
    };

    return {
        Operators: operators
    };
});

csapp.filter('changetext', function () {
    return function (input) {
        if (input.search('Opr:') > -1) {
            return input.replace("Opr:", "");
        }
        if (input.search('For:') > -1) {
            return input.replace("For:", "");
        }
        if (input.search('Col:') > -1) {
            return input.replace("Col:", "");
        }
        return input;
    };
});

csapp.factory('queryGenHelpers', function () {

    var createTableList = function (modal, tableName) {
        var list = [];
        angular.forEach(modal.Columns, function (value, key) {
            list.push({
                'Type': 'Table',
                'Text': 'Col:' + key,
                'Value': tableName + '.' + key,
                'DataType': value.type,
                'valuelist': []
            });
        });
        return angular.copy(list);
    };

    var createFormulaList = function (formulaList) {
        var list = [];
        angular.forEach(formulaList, function (value, key) {
            list.push({
                'Type': 'Formula',
                'Text': 'For:' + value.Name + '()',
                'Value': value.Id,
                'DataType': value.OutputType.toLowerCase(),
                'valuelist': []
            });
        });
        return angular.copy(list);
    };

    var convertValueIntoObject = function (value) {
        return angular.copy({
            'Type': 'Value',
            'Text': value,
            'Value': value,
            'DataType': 'Value',
            'valuelist': []
        });
    };

    return {
        getTableList: createTableList,
        getFormulaList: createFormulaList,
        convertValue: convertValueIntoObject
    };
});

csapp.factory('tokenHelpers', ['queryGenHelpers', 'operatorsFactory',
    function (helpers, operatorFactory) {

        var token = {};

        token.resetTokenList = function (tokens) {
            tokens.tokensList = [];
            tokens.nextTokens = [];
        };

        token.resetCollections = function (tokens) {
            tokens.collections.formulaListC = [];
            tokens.collections.tableColumns = [];
        };

        token.clearFilterString = function (tokens) {
            tokens.filterString = '';
        };

        token.setLastandSecondToken = function (tokens, tokenVal) {
            tokens.secondLastToken = angular.isUndefined(tokens.secondLastToken) ?
                   angular.copy(tokenVal) : angular.isUndefined(tokens.lastToken) ?
                       angular.copy(tokenVal) : angular.copy(tokens.lastToken);
            tokens.lastToken = tokenVal;
        };

        token.createTableList = function (tokens, modal, tableName) {
            tokens.collections.tableColumns = helpers.getTableList(modal, tableName);
            tokens.tokensList = _.union(tokens.tokensList, tokens.collections.tableColumns);
        };

        token.createFormulaList = function (tokens, formulaList) {
            tokens.collections.formulaListC = helpers.getFormulaList(formulaList);
            tokens.tokensList = _.union(tokens.tokensList, tokens.collections.formulaListC);
        };

        token.loadAllOperators = function (tokens) {
            tokens.tokensList = _.union(tokens.tokensList,
                operatorFactory.Operators.numberOperators(),
                operatorFactory.Operators.relationals(),
                operatorFactory.Operators.stringOperators(),
                operatorFactory.Operators.sqlOperators(),
                operatorFactory.Operators.dateOperators(),
                operatorFactory.Operators.conditionals());

        };

        token.loadOutputOperators = function (tokens) {
            tokens.tokensList = _.union(tokens.tokensList,
           operatorFactory.Operators.numberOperators(),
           operatorFactory.Operators.sqlOperators());
        };

        token.initListOutput = function (tokens, modal, tableName, formulaList) {
            token.resetTokenList(tokens);
            token.resetCollections(tokens);
            token.createTableList(tokens, modal, tableName);
            token.loadOutputOperators(tokens);
            token.createFormulaList(tokens, formulaList);
        };

        token.initListsConditions = function (tokens, modal, tableName, formulaList) {
            token.resetTokenList(tokens);
            token.resetCollections(tokens);
            token.createTableList(tokens, modal, tableName);
            token.loadAllOperators(tokens);
            token.createFormulaList(tokens, formulaList);
        };

        token.setAddValue = function (tokens, value, groupId) {
            var seleVal = helpers.convertValue(value);
            seleVal.GroupId = groupId;
            seleVal.priority = tokens.selected.length;
            tokens.selected.push(seleVal);
            token.setLastandSecondToken(tokens, seleVal);
            token.clearFilterString(tokens);
            return seleVal;
        };

        token.addTokenToTokenList = function (tokens, tokenVal, groupId) {
            tokenVal.GroupId = groupId;
            tokenVal.priority = tokens.selected.length;
            tokens.selected.push(tokenVal);
            token.setLastandSecondToken(tokens, tokenVal);
            token.clearFilterString(tokens);
        };

        return {
            tokenHelper: token,
        };
    }]);

//$scope.tokens.tokensList = [];
//$scope.tokens.selected = [];
//$scope.tokens.lastToken = {};
//$scope.tokens.nextTokens = [];
//$scope.tokens.collections = {};
//$scope.tokens.collections.formulaListC = [];
//$scope.tokens.collections.tableColumns = [];
//$scope.tokens.filterString = '';