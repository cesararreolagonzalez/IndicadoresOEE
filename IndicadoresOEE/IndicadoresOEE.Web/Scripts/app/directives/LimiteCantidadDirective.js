(function () {
    'use strict';

    angular
        .module('indicadoresoeeapp')
        .directive('limiteCantidad', LimiteCantidadDirective);
    
    function LimiteCantidadDirective() {
        return {
            require: 'ngModel',
            scope: {
                limiteCantidad: "=limiteCantidad"
            },
            link: function (scope, element, attrs, ngModel)
            {

                ngModel.$validators.limiteCantidad = function (valorEntrada)
                {
                    var EsValido = false;
                    
                    if (valorEntrada === undefined || valorEntrada === null || valorEntrada === '')
                        return true;
                    
                    var EsValorLimiteAceptado = Number(valorEntrada) <= Number(scope.limiteCantidad);

                    if (EsValorLimiteAceptado) 
                        EsValido = true;

                    return EsValido;
                };
            }
        };
    }
})();