(function () {
    'use strict';

    angular
        .module('indicadoresoeeapp')
        .factory('UsuarioService', UsuarioService);

    UsuarioService.$inject = ['$http'];

    function UsuarioService($http)
    {
        var service = {};

        service.ObtenerUsuarios = ObtenerUsuarios;
        service.ObtenerUsuario = ObtenerUsuario;
        service.AgregarUsuario = AgregarUsuario;
        service.ActualizarUsuario = ActualizarUsuario;
        service.EliminarUsuario = EliminarUsuario;

        return service;

        function ObtenerUsuarios()
        {
            return $http.get('/Usuario/ObtenerUsuarios').then(ManejoExito, ManejoError);
        }

        function ObtenerUsuario(id)
        {
            return $http.get('/Usuario/ObtenerUsuario' + id).then(ManejoExito, ManejoError);
        }

        function AgregarUsuario(model)
        {
            return $http.post('/Usuario/AgregarUsuario', model).then(ManejoExito, ManejoError);
        }

        function ActualizarUsuario(model)
        {
            return $http.post('/Usuario/ActualizarUsuario' + model.id, model).then(ManejoExito, ManejoError);
        }

        function EliminarUsuario(Indice)
        {
            return $http.post('/Usuario/EliminarUsuario', JSON.stringify({ Indice: Indice})).then(ManejoExito, ManejoError);
        }
        
        function ManejoExito(response) {
            return response;
        }
        
        function ManejoError(error) {
            return error;
            //return function () {
            //    return { success: false, message: error };
            //};
        }

    }

})();