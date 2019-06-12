(function () {
    'use strict';

    angular
        .module('indicadoresoeeapp')
        .factory('ProcesoService', ProcesoService);

    ProcesoService.$inject = ['$http', '$httpParamSerializer'];

    function ProcesoService($http, $httpParamSerializer)
    {
        var service = {};

        service.ObtenerProcesosPorLinea = ObtenerProcesosPorLinea;
        service.ObtenerProcesosPorLineas = ObtenerProcesosPorLineas;
        service.ObtenerProcesosPorUsuario = ObtenerProcesosPorUsuario;
        service.ObtenerProcesos = ObtenerProcesos;
        service.ObtenerProceso = ObtenerProceso;
        service.CrearProceso = CrearProceso;
        service.AsociarProcesosUsuario = AsociarProcesosUsuario;
        service.ActualizarProceso = ActualizarProceso;
        service.EliminarProceso = EliminarProceso;
        service.EliminarProcesos = EliminarProcesos;

        return service;

        function ObtenerProcesosPorLinea(IndiceLinea) {
            return $http.get('/Proceso/ObtenerProcesosPorLinea?IndiceLinea=' + IndiceLinea).then(handleSuccess, handleError);
        }

        function ObtenerProcesosPorLineas(ListaIndicesLineas) {
            return $http.get('/Proceso/ObtenerProcesosPorLineas?' + $httpParamSerializer({ IndiceLinea: ListaIndicesLineas })).then(handleSuccess, handleError);
        }

        function ObtenerProcesosPorUsuario() {
            return $http.get('/Proceso/ObtenerProcesosPorUsuario').then(handleSuccess, handleError);
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

        function AsociarProcesosUsuario(ListaIndicesProcesos) {
            return $http.post('/Proceso/AsociarProcesosUsuario?', + $httpParamSerializer({ ListaIndicesProcesos: ListaIndicesProcesos })).then(handleSuccess, handleError);
        }

        function ActualizarProceso(Proceso) {
            return $http.put('/Proceso/ActualizarProceso' + Proceso.id, Proceso).then(handleSuccess, handleError);
        }

        function EliminarProceso(IndiceProceso) {
            return $http.post('/Proceso/EliminarProceso?' + + $httpParamSerializer({ IndiceProceso: IndiceProceso })).then(handleSuccess, handleError);
        }

        function EliminarProcesos(ListaIndicesProcesos) {
            return $http.post('/Proceso/EliminarProcesos?' + $httpParamSerializer({ ListaIndicesProcesos: ListaIndicesProcesos })).then(handleSuccess, handleError);
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