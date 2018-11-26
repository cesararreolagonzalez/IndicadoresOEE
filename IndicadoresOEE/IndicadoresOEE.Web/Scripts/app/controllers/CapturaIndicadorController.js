(function () {
    'use strict';

    angular
        .module('indicadoresoeeapp')
        .controller('CapturaIndicadorController', CapturaIndicadorController);
    
    CapturaIndicadorController.$inject = ['$scope', '$timeout', '$location', '$anchorScroll', '$log', '$http', '$window', '$compile', '$mdToast', '$mdDialog'];

    function CapturaIndicadorController($scope, $timeout, $location, $anchorScroll, $log, $http, $window, $compile, $mdToast, $mdDialog)
    {
        $scope.DatosGenerales = {
            IndiceCentro: null,
            IndiceDepartamento: null,
            IndiceLinea: null,
            IndiceProceso: null,
            IndiceVelocidad: null,
            Orden: null,
            Lote: null,
            Material: null,
            Descripcion: null,
            Velocidad: null
        };
        
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
                    else {
                        $scope.ListaCentros = response.data.ListaCentros;
                        $scope.DatosGenerales.IndiceCentros = $scope.ListaCentros.length === 1 ? $scope.ListaCentros[0].Indice : null;

                        if ($scope.DatosGenerales.IndiceCentros !== null)
                            $scope.ObtenerDepartamentos();
                    }
                },
                function (response) {
                    $log.info('Hubo un error: Estatus = ' + response.status + ', Error = ' + response.data);
                })
                .catch(function (response) {
                    $log.info('Excepcion: ', response);
                    throw e;
                })
                .finally(function () {
                    $log.info('Método ObtenerCentros finalizado');
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

                        if ($scope.DatosGenerales.IndiceCentros !== null)
                            $scope.ObtenerLineas();
                    }
                },
                function (response) {
                    $log.info('Hubo un error: Estatus = ' + response.status + ', Error = ' + response.data);
                })
                .catch(function (response) {
                    $log.info('Excepcion: ', response);
                    throw e;
                })
                .finally(function () {
                    $log.info('Método ObtenerDepartamentos finalizado');
                });
        };

        $scope.ObtenerLineas = function ()
        {
            $http
                .post('/Linea/ObtenerLineas', JSON.stringify({ IndiceDepartamento: $scope.DatosGenerales.IndiceDepartamento }))
                .then(function (response) {
                    var Estado = response.data.Estado;
                    if (!Estado) {
                        var Mensaje = response.data.Mensaje;
                        $log.info('Se produjo el siguiente error en el método ObtenerLineas = ' + Mensaje);
                    }
                    else {
                        $scope.ListaLineas = response.data.ListaLineas;
                        $scope.DatosGenerales.IndiceLinea = $scope.ListaLineas.length === 1 ? $scope.ListaLineas[0].Indice : null;

                        if ($scope.DatosGenerales.IndiceCentros !== null)
                            $scope.ObtenerProcesos();
                    }
                },
                function (response) {
                    $log.info('Hubo un error: Estatus = ' + response.status + ', Error = ' + response.data);
                })
                .catch(function (response) {
                    $log.info('Excepcion: ', response);
                    throw e;
                })
                .finally(function () {
                    $log.info('Método ObtenerLineas finalizado');
                });
        };

        $scope.ObtenerProcesos = function ()
        {
            $http
                .post('/Proceso/ObtenerProcesos', JSON.stringify({ IndiceLinea: $scope.DatosGenerales.IndiceLinea }))
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
                    $log.info('Hubo un error: Estatus = ' + response.status + ', Error = ' + response.data);
                })
                .catch(function (response) {
                    $log.info('Excepcion: ', response);
                    throw e;
                })
                .finally(function () {
                    $log.info('Método ObtenerProcesos finalizado');
                });
        };


        $scope.$watch('DatosGenerales.IndiceCentro', function (newValue, oldValue) {
            if (newValue !== undefined && newValue !== null && newValue !== '') {
                $scope.ObtenerDepartamentos();
            }
        });

        $scope.$watch('DatosGenerales.IndiceDepartamento', function (newValue, oldValue) {
            if (newValue !== undefined && newValue !== null && newValue !== '') {
                $scope.ObtenerLineas();
            }
        });

        $scope.$watch('DatosGenerales.IndiceLinea', function (newValue, oldValue) {
            if (newValue !== undefined && newValue !== null && newValue !== '') {
                $scope.ObtenerProcesos();
            }
        });

        $scope.$watch('DatosGenerales.IndiceProceso', function (newValue, oldValue) {
            if (newValue !== undefined && newValue !== null && newValue !== '') {
            }
        });
    }
}) ();