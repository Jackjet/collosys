﻿angular.module('ui.multiselect', [])

  //from bootstrap-ui typeahead parser
  .factory('optionParser', ['$parse', function ($parse) {

      //                      00000111000000000000022200000000000000003333333333333330000000000044000
      // ReSharper disable InconsistentNaming
      var TYPEAHEAD_REGEXP = /^\s*(.*?)(?:\s+as\s+(.*?))?\s+for\s+(?:([\$\w][\$\w\d]*))\s+in\s+(.*)$/;
      // ReSharper restore InconsistentNaming

      return {
          parse: function (input) {

              var match = input.match(TYPEAHEAD_REGEXP);
              if (!match) {
                  throw new Error(
                    "Expected typeahead specification in form of '_modelValue_ (as _label_)? for _item_ in _collection_'" +
                      " but got '" + input + "'.");
              }

              return {
                  itemName: match[3],
                  source: $parse(match[4]),
                  viewMapper: $parse(match[2] || match[1]),
                  modelMapper: $parse(match[1])
              };
          }
      };
  }])

  .directive('multiselect', ['$parse', '$document', '$compile', 'optionParser',

    function ($parse, $document, $compile, optionParser) {
        return {
            restrict: 'E',
            require: 'ngModel',
            link: function (originalScope, element, attrs, modelCtrl) {

                var exp = attrs.options,
                  parsedResult = optionParser.parse(exp),
                  isMultiple = attrs.multiple ? true : false,
                  required = false,
                  scope = originalScope.$new(),
                  changeHandler = attrs.change || angular.noop;

                scope.items = [];
                scope.header = 'Select';
                scope.multiple = isMultiple;
                scope.disabled = false;

                originalScope.$on('$destroy', function () {
                    scope.$destroy();
                });

                var popUpEl = angular.element('<multiselect-popup></multiselect-popup>');

                //required validator
                if (attrs.required || attrs.ngRequired) {
                    required = true;
                }
                attrs.$observe('required', function (newVal) {
                    required = newVal;
                });

                //watch disabled state
                scope.$watch(function () {
                    return $parse(attrs.disabled)(originalScope);
                }, function (newVal) {
                    scope.disabled = newVal;
                });

                //watch single/multiple state for dynamically change single to multiple
                scope.$watch(function () {
                    return $parse(attrs.multiple)(originalScope);
                }, function (newVal) {
                    isMultiple = newVal || false;
                });

                //watch option changes for options that are populated dynamically
                scope.$watch(function () {
                    return parsedResult.source(originalScope);
                }, function (newVal) {
                    if (angular.isDefined(newVal))
                        parseModel();
                }, true);

                //watch model change
                scope.$watch(function () {
                    return modelCtrl.$modelValue;
                }, function (newVal) {
                    //when directive initialize, newVal usually undefined. Also, if model value already set in the controller
                    //for preselected list then we need to mark checked in our scope item. But we don't want to do this every time
                    //model changes. We need to do this only if it is done outside directive scope, from controller, for example.
                    if (angular.isDefined(newVal)) {
                        if (newVal.length === 0) scope.uncheckAll();
                    }
                    if (angular.isUndefined(newVal)) scope.uncheckAll();
                    if (angular.isDefined(newVal)) {
                        markChecked(newVal);
                        scope.$eval(changeHandler);
                    }
                    getHeaderText();
                    modelCtrl.$setValidity('required', scope.valid());
                }, true);

                function parseModel() {
                    scope.items.length = 0;
                    var model = parsedResult.source(originalScope);
                    if (!angular.isDefined(model)) return;
                    for (var i = 0; i < model.length; i++) {
                        var local = {};
                        local[parsedResult.itemName] = model[i];
                        scope.items.push({
                            label: parsedResult.viewMapper(local),
                            model: model[i],
                            checked: false
                        });
                    }
                }

                parseModel();

                element.append($compile(popUpEl)(scope));

                function getHeaderText() {
                    if (is_empty(modelCtrl.$modelValue)) scope.header = 'Select';
                    if (isMultiple) {
                        if (angular.isUndefined(modelCtrl.$modelValue)) {
                            scope.header = "0 selected";
                        } else {
                            scope.header = modelCtrl.$modelValue.length + ' ' + 'selected';
                        }

                    } else {
                        var local = {};
                        local[parsedResult.itemName] = modelCtrl.$modelValue;

                        scope.header = parsedResult.viewMapper(local);
                    }
                };

                // ReSharper disable InconsistentNaming
                function is_empty(obj) {
                    // ReSharper restore InconsistentNaming
                    if (!obj) return true;
                    if (obj.length && obj.length > 0) return false;
                    for (var prop in obj) if (obj[prop]) return false;
                    return true;
                };

                scope.valid = function validModel() {
                    if (!required) return true;
                    var value = modelCtrl.$modelValue;
                    return (angular.isArray(value) && value.length > 0) || (!angular.isArray(value) && value != null);
                };

                function selectSingle(item) {
                    if (item.checked) {
                        scope.uncheckAll();
                    } else {
                        scope.uncheckAll();
                        item.checked = !item.checked;
                    }
                    setModelValue(false);
                }

                function selectMultiple(item) {
                    item.checked = !item.checked;
                    setModelValue(true);
                }

                // ReSharper disable once DuplicatingLocalDeclaration
                function setModelValue(isMultiple) {
                    var value;

                    if (isMultiple) {
                        value = [];
                        angular.forEach(scope.items, function (item) {
                            if (item.checked) value.push(item.model);
                        });
                    } else {
                        angular.forEach(scope.items, function (item) {
                            if (item.checked) {
                                value = item.model;
                                //return false;
                            }
                        });
                    }
                    modelCtrl.$setViewValue(value);
                }

                function markChecked(newVal) {
                    if (!angular.isArray(newVal)) {
                        angular.forEach(scope.items, function (item) {
                            if (angular.equals(item.model, newVal)) {
                                item.checked = true;
                                //return false;
                            }
                        });
                    } else {
                        angular.forEach(newVal, function (i) {
                            angular.forEach(scope.items, function (item) {
                                if (angular.equals(item.model, i)) {
                                    item.checked = true;
                                }
                            });
                        });
                    }
                }

                //scope.$watch(function () {
                //    return $parse(attrs.ngModel)(originalScope);
                //}, function () {
                //    console.log("model changed: ", $parse(attrs.ngModel)(originalScope));
                //    var modelVal = $parse(attrs.ngModel)(originalScope);
                //    if (modelVal.length === 0) {
                //        angular.forEach(scope.items, function (item) {
                //            item.checked = false;
                //        });
                //        setModelValue(true);
                //    }

                //});

                scope.checkAll = function () {
                    if (!isMultiple) return;
                    angular.forEach(scope.items, function (item) {
                        item.checked = true;
                    });
                    setModelValue(true);
                };

                scope.uncheckAll = function () {
                    angular.forEach(scope.items, function (item) {
                        item.checked = false;
                    });
                    setModelValue(true);
                };

                scope.select = function (item) {
                    if (isMultiple === false) {
                        selectSingle(item);
                        scope.toggleSelect();
                    } else {
                        selectMultiple(item);
                    }
                };
            }
        };
    }])

  .directive('multiselectPopup', ['$document', function ($document) {
      return {
          restrict: 'E',
          scope: false,
          replace: true,
          templateUrl: baseUrl + 'Shared/templates/multiselect.tmpl.html',
          link: function (scope, element) {

              scope.isVisible = false;

              scope.toggleSelect = function () {
                  if (element.hasClass('open')) {
                      element.removeClass('open');
                      $document.unbind('click', clickHandler);
                  } else {
                      element.addClass('open');
                      $document.bind('click', clickHandler);
                      scope.focus();
                  }
              };

              function clickHandler(event) {
                  if (elementMatchesAnyInArray(event.target, element.find(event.target.tagName)))
                      return;
                  element.removeClass('open');
                  $document.unbind('click', clickHandler);
                  scope.$apply();
              }

              scope.focus = function () {
                  var searchBox = element.find('input')[0];
                  searchBox.focus();
              };

              var elementMatchesAnyInArray = function (el, elementArray) {
                  for (var i = 0; i < elementArray.length; i++)
                      if (el == elementArray[i])
                          return true;
                  return false;
              };
          }
      };
  }]);

