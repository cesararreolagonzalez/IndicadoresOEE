(function () {
    'use strict';

    angular
        .module('indicadoresoeeapp')
        .factory('DepartamentoService', DepartamentoService);

    DepartamentoService.$inject = ['$http', '$httpParamSerializer'];

    function DepartamentoService($http, $httpParamSerializer)
    {
        var service = {};

        service.ObtenerDepartamentosPorCentro = ObtenerDepartamentosPorCentro;
        service.ObtenerDepartamentosPorCentros = ObtenerDepartamentosPorCentros;
        service.ObtenerDepartamentos = ObtenerDepartamentos;
        service.ObtenerDepartamento = ObtenerDepartamento;
        service.CrearDepartamento = CrearDepartamento;
        service.ActualizarDepartamento = ActualizarDepartamento;
        service.EliminarDepartamento = EliminarDepartamento;

        return service;

        function ObtenerDepartamentosPorCentro(IndiceCentro) {
            return $http.get('/Departamento/ObtenerDepartamentosPorCentro?IndiceCentro=' + IndiceCentro).then(handleSuccess, handleError);
        }

        function ObtenerDepartamentosPorCentros(ListaIndicesCentros) {

            //var shallowDecoded1 = $httpParamSerializer({ IndiceCentro: ListaIndicesCentros });
            //console.log(shallowDecoded1);
            //var parametros = $.param({ IndiceCentro: ListaIndicesCentros }).replace(/%5B/g, '').replace(/%5D/g, '');
            //console.log(parametros);
            return $http.get('/Departamento/ObtenerDepartamentosPorCentros?' + $httpParamSerializer({ IndiceCentro: ListaIndicesCentros })).then(handleSuccess, handleError);
        } 
        
        function ObtenerDepartamentos() {
            return $http.get('/Departamento/ObtenerDepartamentos').then(handleSuccess, handleError);
        }

        function ObtenerDepartamento(id) {
            return $http.get('/Departamento/ObtenerDepartamento' + id).then(handleSuccess, handleError);
        }

        function CrearDepartamento(Departamento) {
            return $http.post('/Departamento/CrearDepartamento', Departamento).then(handleSuccess, handleError);
        }

        function ActualizarDepartamento(Departamento) {
            return $http.put('/Departamento/ActualizarDepartamento' + Departamento.id, Departamento).then(handleSuccess, handleError);
        }

        function EliminarDepartamento(id) {
            return $http.delete('/Departamento/EliminarDepartamento' + id).then(handleSuccess, handleError);
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