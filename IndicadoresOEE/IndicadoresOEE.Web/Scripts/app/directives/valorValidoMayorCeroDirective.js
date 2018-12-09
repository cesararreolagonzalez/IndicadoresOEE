(function () {
    'use strict';

    angular
        .module('indicadoresoeeapp')
        .directive('valorValidoMayorCero', valorValidoMayorCeroDirective);
    
    //soloNumericoDirective.$inject = ['scope', 'element', 'attrs', 'modelCtr'];

    function valorValidoMayorCeroDirective() {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, element, attrs, ngModel)
            {
                ngModel.$validators.valorValidoMayorCero = function (inputValue) {
                    if (inputValue === null || inputValue === undefined || inputValue === '')
                        return true;

                    inputValue = inputValue + "";
                    var transformedInput = inputValue ? inputValue.replace(/[^\d.-]/g, '') : null;

                    if (transformedInput !== inputValue) {
                        ngModel.$setViewValue(transformedInput);
                        ngModel.$commitViewValue();
                        ngModel.$render();

                        return null;
                    }

                    return parseInt(inputValue) > 0;
                };
            }
        };
    }
})();