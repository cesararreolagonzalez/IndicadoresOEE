(function () {
    'use strict';

    angular
        .module('indicadoresoeeapp')
        .controller('CuentaController', Controller);

    Controller.$inject = ['$scope', '$timeout', '$location', '$log', '$http', '$window', '$mdDialog', '$auth'];

    function Controller($scope, $timeout, $location, $log, $http, $window, $mdDialog, $auth)
    {
        $scope.Usuario = 'caarreola@corpcab.com.mx';
        $scope.Contraseña = 'Pisa.21';

        var InformacionUsuario = {
            Usuario: $scope.Usuario,
            Contraseña: $scope.Contraseña
        };

        $scope.IniciarSesion = function () {
            $log.info(InformacionUsuario);
            $auth.login(InformacionUsuario)
                .then(function (response) {
                    // Redirect user here after a successful log in.
                    $log.info('then');
                    $log.info(response);
                })
                .catch(function (response) {
                    // Handle errors here, such as displaying a notification
                    // for invalid email and/or password.
                    $log.info('catch');
                    $log.info(response);
                });
        };


        $scope.authenticate = function (provider) {
            $auth.authenticate(provider);
        };

        $scope.isAuthenticated = function () {
            $scope.EstasAutenticado = $auth.isAuthenticated();
            $log.info($scope.EstasAutenticado);

            return $scope.EstasAutenticado;
        };
    }
})();