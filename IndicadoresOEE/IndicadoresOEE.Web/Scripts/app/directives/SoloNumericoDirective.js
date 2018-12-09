(function () {
    'use strict';

    angular
        .module('indicadoresoeeapp')
        .directive('soloNumerico', soloNumericoDirective);
    
    //soloNumericoDirective.$inject = ['scope', 'element', 'attrs', 'modelCtr'];

    function soloNumericoDirective() {
        return {
            require: 'ngModel',
            link: function (scope, element, attrs, modelCtrl) {

                modelCtrl.$parsers.push(function (valorEntrada) {
                    var valorEntradaTransformado = null;

                    if (valorEntrada === undefined || valorEntrada === null || valorEntrada === '')
                        return true;

                    valorEntradaTransformado = valorEntrada ? valorEntrada.replace(/[^\d.-]/g, '') : null;

                    if (valorEntradaTransformado !== null && valorEntradaTransformado !== valorEntrada)
                    {
                        modelCtrl.$setViewValue(valorEntradaTransformado);
                        modelCtrl.$commitViewValue();
                        modelCtrl.$render();
                    }

                    return valorEntradaTransformado;
                });
            }
        };
    }
})();