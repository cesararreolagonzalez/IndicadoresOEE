(function () {
    'use strict';

    angular
        .module('indicadoresoeeapp')
        .factory('UtilFactory', UtilFactory);

    UtilFactory.$inject = [];

    function UtilFactory()
    {
        var service = {};

        service.EsNuloOVacio = EsNuloOVacio;
        service.CompararFecha = CompararFecha;
        service.FiltrarArreglo = FiltrarArreglo;

        return service;
        
        function EsNuloOVacio(cadena) {
            if (cadena === undefined || cadena === null || cadena === '')
                return true;
            return false;
        }
    }

    function CompararFecha(FechaInicial, FechaFinal) {
        var ComparacionAño = FechaInicial.getFullYear() > FechaFinal.getFullYear();
        var ComparacionMes = FechaInicial.getMonth() > FechaFinal.getMonth();
        var ComparacionDia = FechaInicial.getDay() > FechaFinal.getDay();

        return ComparacionAño && ComparacionMes && ComparacionDia;
    }


    function FiltrarArreglo(array, predicateFunction)
    {
        var length = array === null ? 0 : array.length;
        if (!length) {
            return -1;
        }
        var index = -1;
        for (var i = 0; i < array.length; ++i) {
            if (predicateFunction(array[i])) {
                index = i;
                break;
            }
        }

        return index;
    }

})();