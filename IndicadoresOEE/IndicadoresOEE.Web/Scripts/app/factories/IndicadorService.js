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
        service.ValidarOrden = ValidarOrden;

        return service;

        function ObtenerIndicadorPorProceso(IndiceProceso) {
            return $http.get('/Indicador/ObtenerIndicadorPorProceso?IndiceProceso=' + IndiceProceso).then(handleSuccess, handleError);
        }

        function ObtenerIndicadores() {
            return $http.get('/Indicador/ObtenerIndicadores').then(handleSuccess, handleError);
        }

        function ObtenerIndicador(id) {
            return $http.get('/Indicador/ObtenerIndicador' + id).then(handleSuccess, handleError);
        }

        function CrearIndicador(Indicador) {
            return $http.post('/Indicador/CrearIndicador', Indicador).then(handleSuccess, handleError);
        }

        function ActualizarIndicador(Indicador) {
            return $http.put('/Indicador/ActualizarIndicador' + Indicador.id, Indicador).then(handleSuccess, handleError);
        }

        function EliminarIndicador(id) {
            return $http.delete('/Indicador/EliminarIndicador?IndiceIndicador=' + id).then(handleSuccess, handleError);
        }

        function ValidarOrden(Orden) {
            return $http.get('/Indicador/ValidarOrden?Orden=' + Orden).then(handleSuccess, handleError);
        }


        // private functions

        function handleSuccess(response) {
            return response;
        }

        function handleError(error) {
            return error;
            //return function () {
            //    return { success: false, message: error };
            //};
        }
    }

})();