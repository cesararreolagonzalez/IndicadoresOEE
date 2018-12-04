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

})();