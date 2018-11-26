(function () {
    'use strict';

    angular
        .module('indicadoresoeeapp')
        .controller('CapturaIndicadorController', CapturaIndicadorController);
    
    CapturaIndicadorController.$inject = ['$scope', '$timeout', '$location', '$anchorScroll', '$log', '$http', '$window', '$compile', '$mdToast', '$mdDialog'];

    function CapturaIndicadorController($scope, $timeout, $location, $anchorScroll, $log, $http, $window, $compile, $mdToast, $mdDialog)
    {
        $scope.DatosGenerales = { IndiceCentro: null, IndiceDepartamento: null, IndiceLinea: null, IndiceProceso: null, IndiceVelocidad: null };
        
        $scope.ResetearTerminoBusqueda = function () {
            $scope.TerminoBusqueda = '';
        };

        $scope.ObtenerCentros = function ()
        {
            $http
                .post('/Centro/ObtenerCentros')
                .then(function (response) {
                    var Estado = response.data.Estado;
                    if (!Estado) {
                        var Mensaje = response.data.Mensaje;
                        $log.info('Se produjo el siguiente error en el método ObtenerCentros = ' + Mensaje);
                    }
                    else
                        $scope.ListaCentros = response.data.ListaCentros;
                },
                function (response) {
                    $log.info('Hubo un error: ' + response);
                })
                .catch(function (response) {
                    $log.info('Excepcion: ', response);
                    throw e;
                })
                .finally(function () {
                    $log.info('Finally');
                });
        };

        $scope.ObtenerDepartamentos = function ()
        {
            $http
                .post('/Departamento/ObtenerDepartamentos', JSON.stringify({ IndiceCentro: $scope.DatosGenerales.IndiceCentro }))
                .then(function (response) {
                    var Estado = response.data.Estado;
                    if (!Estado) {
                        var Mensaje = response.data.Mensaje;
                        $log.info('Se produjo el siguiente error en el método ObtenerDepartamentos = ' + Mensaje);
                    }
                    else {
                        $scope.ListaDepartamentos = response.data.ListaDepartamentos;
                        $scope.DatosGenerales.IndiceDepartamento = $scope.ListaDepartamentos.length === 1 ? $scope.ListaDepartamentos[0].Indice : null;
                    }
                },
                function (response) {
                    $log.info('Hubo un error: ' + response);
                })
                .catch(function (response) {
                    $log.info('Excepcion: ', response);
                    throw e;
                })
                .finally(function () {
                    $log.info('Finally');
                });
        };

        $scope.ObtenerLineas = function ()
        {
            $http
                .post('/Linea/ObtenerLineas', JSON.stringify({ IndiceLinea: $scope.DatosGenerales.IndiceLinea }))
                .then(function (response) {
                    var Estado = response.data.Estado;
                    if (!Estado) {
                        var Mensaje = response.data.Mensaje;
                        $log.info('Se produjo el siguiente error en el método ObtenerLineas = ' + Mensaje);
                    }
                    else {
                        $scope.ListaLineas = response.data.ListaLineas;
                        $scope.DatosGenerales.IndiceLinea = $scope.ListaLineas.length === 1 ? $scope.ListaLineas[0].Indice : null;
                    }
                },
                function (response) {
                    $log.info('Hubo un error: ' + response);
                })
                .catch(function (response) {
                    $log.info('Excepcion: ', response);
                    throw e;
                })
                .finally(function () {
                    $log.info('Finally');
                });
        };

        $scope.ObtenerProcesos = function ()
        {
            $http
                .post('/Procesos/ObtenerProcesos', JSON.stringify({ IndiceProceso: $scope.DatosGenerales.IndiceProceso }))
                .then(function (response) {
                    var Estado = response.data.Estado;
                    if (!Estado) {
                        var Mensaje = response.data.Mensaje;
                        $log.info('Se produjo el siguiente error en el método ObtenerLineas = ' + Mensaje);
                    }
                    else {
                        $scope.ListaProcesos = response.data.ListaProcesos;
                        $scope.DatosGenerales.IndiceProceso = $scope.ListaProcesos.length === 1 ? $scope.ListaProcesos[0].Indice : null;
                    }
                },
                function (response) {
                    $log.info('Hubo un error: ' + response);
                })
                .catch(function (response) {
                    $log.info('Excepcion: ', response);
                    throw e;
                })
                .finally(function () {
                    $log.info('Finally');
                });
        };
    }
}) ();