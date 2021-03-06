﻿(function () {
    'use strict';

    angular
        .module('indicadoresoeeapp')
        .factory('VelocidadService', VelocidadService);

    VelocidadService.$inject = ['$http', '$httpParamSerializer'];

    function VelocidadService($http, $httpParamSerializer)
    {
        var service = {};

        service.ObtenerVelocidadesPorProcesos = ObtenerVelocidadesPorProcesos;
        service.ObtenerVelocidadPorMaterial = ObtenerVelocidadPorMaterial;
        service.ObtenerVelocidades = ObtenerVelocidades;
        service.ObtenerVelocidad = ObtenerVelocidad;
        service.CrearVelocidad = CrearVelocidad;
        service.ActualizarVelocidad = ActualizarVelocidad;
        service.EliminarVelocidad = EliminarVelocidad;

        return service;

        function ObtenerVelocidadesPorProcesos(ListaIndicesProcesos) {
            return $http.get('/Velocidad/ObtenerVelocidadesPorProcesos?' + $httpParamSerializer({ IndiceProceso: ListaIndicesProcesos })).then(handleSuccess, handleError);
        }
        
        function ObtenerVelocidadPorMaterial(IndiceProceso, Material) {
            return $http.get('/Velocidad/ObtenerVelocidadPorMaterial?IndiceProceso=' + IndiceProceso + '&Material=' + Material).then(handleSuccess, handleError);
        }

        function ObtenerVelocidades() {
            return $http.get('/Velocidad/ObtenerVelocidades').then(handleSuccess, handleError);
        }

        function ObtenerVelocidad(id) {
            return $http.get('/Velocidad/ObtenerVelocidad' + id).then(handleSuccess, handleError);
        }

        function CrearVelocidad(Velocidad) {
            return $http.post('/Velocidad/CrearVelocidad', Velocidad).then(handleSuccess, handleError);
        }

        function ActualizarVelocidad(Velocidad) {
            return $http.put('/Velocidad/ActualizarVelocidad' + Velocidad.id, Velocidad).then(handleSuccess, handleError);
        }

        function EliminarVelocidad(id) {
            return $http.delete('/Velocidad/EliminarVelocidad' + id).then(handleSuccess, handleError);
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