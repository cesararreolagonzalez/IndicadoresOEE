(function () {
    'use strict';

    angular
        .module('indicadoresoeeapp')
        .factory('IndicadorService', IndicadorService);

    IndicadorService.$inject = ['$http'];

    function IndicadorService($http)
    {
        var service = {};

        service.ObtenerIndicadorPorProceso = ObtenerIndicadorPorProceso;
        service.ObtenerIndicadores = ObtenerIndicadores;
        service.ObtenerIndicador = ObtenerIndicador;
        service.CrearIndicador = CrearIndicador;
        service.ActualizarIndicador = ActualizarIndicador;
        service.EliminarIndicador = EliminarIndicador;
        service.BusquedaIndicadoresPeriodo = BusquedaIndicadoresPeriodo;
        service.ValidarOrden = ValidarOrden;

        return service;

        function ObtenerIndicadorPorProceso(IndiceProceso) {
            return $http.get('/Indicador/ObtenerIndicadorPorProceso?IndiceProceso=' + IndiceProceso).then(manejoExitoso, manejoError);
        }

        function ObtenerIndicadores() {
            return $http.get('/Indicador/ObtenerIndicadores').then(manejoExitoso, manejoError);
        }

        function ObtenerIndicador(id) {
            return $http.get('/Indicador/ObtenerIndicador' + id).then(manejoExitoso, manejoError);
        }

        function CrearIndicador(Indicador) {
            return $http.post('/Indicador/CrearIndicador', Indicador).then(manejoExitoso, manejoError);
        }

        function ActualizarIndicador(Indicador) {
            return $http.put('/Indicador/ActualizarIndicador' + Indicador.id, Indicador).then(manejoExitoso, manejoError);
        }

        function EliminarIndicador(id) {
            return $http.delete('/Indicador/EliminarIndicador?IndiceIndicador=' + id).then(manejoExitoso, manejoError);
        }

        function BusquedaIndicadoresPeriodo(idProceso, fechaInicial, fechaFinal) {
            return $http.get('/Indicador/BusquedaIndicadoresPeriodo?IndiceProceso=' + idProceso + '&FechaInicial=' + fechaInicial + '&FechaFinal=' + fechaFinal).then(manejoExitoso, manejoError);
        }
        

        function ValidarOrden(Orden) {
            return $http.get('/Indicador/ValidarOrden?Orden=' + Orden).then(manejoExitoso, manejoError);
        }


        // private functions

        function manejoExitoso(response) {
            return response;
        }

        function manejoError(error) {
            return error;
            //return function () {
            //    return { success: false, message: error };
            //};
        }
    }

})();