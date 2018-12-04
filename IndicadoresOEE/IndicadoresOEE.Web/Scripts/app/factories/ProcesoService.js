(function () {
    'use strict';

    angular
        .module('indicadoresoeeapp')
        .factory('ProcesoService', ProcesoService);

    ProcesoService.$inject = ['$http'];

    function ProcesoService($http)
    {
        var service = {};

        service.ObtenerProcesosPorLinea = ObtenerProcesosPorLinea;
        service.ObtenerProcesos = ObtenerProcesos;
        service.ObtenerProceso = ObtenerProceso;
        service.CrearProceso = CrearProceso;
        service.ActualizarProceso = ActualizarProceso;
        service.EliminarProceso = EliminarProceso;

        return service;

        function ObtenerProcesosPorLinea(IndiceLinea) {
            return $http.get('/Proceso/ObtenerProcesos?IndiceLinea=' + IndiceLinea).then(handleSuccess, handleError);
        }

        function ObtenerProcesos() {
            return $http.get('/Proceso/ObtenerProcesos').then(handleSuccess, handleError);
        }

        function ObtenerProceso(id) {
            return $http.get('/Proceso/ObtenerProceso' + id).then(handleSuccess, handleError);
        }

        function CrearProceso(Proceso) {
            return $http.post('/Proceso/CrearProceso', Proceso).then(handleSuccess, handleError);
        }

        function ActualizarProceso(Proceso) {
            return $http.put('/Proceso/ActualizarProceso' + Proceso.id, Proceso).then(handleSuccess, handleError);
        }

        function EliminarProceso(id) {
            return $http.delete('/Proceso/EliminarProceso' + id).then(handleSuccess, handleError);
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