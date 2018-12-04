(function () {
    'use strict';

    angular
        .module('indicadoresoeeapp')
        .controller('CapturaIndicadorController', CapturaIndicadorController);
    
    CapturaIndicadorController.$inject = ['$element', '$scope', '$timeout', '$location',
        '$anchorScroll', '$log', '$http', '$window', '$mdDialog',
        'CentroService', 'DepartamentoService', 'LineaService', 'ProcesoService', 'VelocidadService', 'IndicadorService', 'SAPService'];

    function CapturaIndicadorController($element, $scope, $timeout, $location, $anchorScroll,
        $log, $http, $window,  $mdDialog,
        CentroService, DepartamentoService, LineaService, ProcesoService, VelocidadService, IndicadorService, SAPService)
    {
        $element.find('input').on('keydown', function (ev) {
            ev.stopPropagation();
        });

        $scope.TerminoBusqueda = '';

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
            CentroService.ObtenerCentros()
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
                    $log.error('Excepcion: ', response);
                })
                .finally(function () {
                    $log.info('Método ObtenerCentros finalizado');
                });
        };

        $scope.ObtenerDepartamentos = function ()
        {
            DepartamentoService.ObtenerDepartamentosPorCentro($scope.DatosGenerales.IndiceCentro)
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
                    throw response;
                })
                .finally(function () {
                    $log.info('Método ObtenerDepartamentos finalizado');
                });
        };

        $scope.ObtenerLineas = function ()
        {
            LineaService.ObtenerLineasPorDepartamento($scope.DatosGenerales.IndiceDepartamento)
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
                    throw response;
                })
                .finally(function () {
                    $log.info('Método ObtenerLineas finalizado');
                });
        };

        $scope.ObtenerProcesos = function ()
        {
            ProcesoService.ObtenerProcesosPorLinea($scope.DatosGenerales.IndiceLinea)
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
                    throw response;
                })
                .finally(function () {
                    $log.info('Método ObtenerProcesos finalizado');
                });
        };

        // Al obtener el Proceso
        function ObtenerIndicadorPorProceso()
        {
            IndicadorService.ObtenerIndicadorPorProceso($scope.DatosGenerales.IndiceProceso)
                .then(function (response) {
                    var Estado = response.data.Estado;
                    if (!Estado) {
                        var Mensaje = response.data.Mensaje;
                        $log.info('Se produjo el siguiente error en el método ObtenerLineas = ' + Mensaje);
                    }
                    else {
                        var Indicador = response.data.Indicador;
                        $scope.DatosGenerales.Orden = Indicador.Orden;
                        $scope.DatosGenerales.Lote = Indicador.Lote;
                        $scope.DatosGenerales.Material = Indicador.Material;
                        $scope.DatosGenerales.Descripcion = Indicador.DescripcionMaterial;
                        $scope.DatosGenerales.Velocidad = Indicador.Velocidad;
                        $scope.DatosGenerales.IndiceVelocidad = Indicador.IndiceVelocidad;

                    }
                },
                    function (response) {
                        $log.info('Hubo un error: Estatus = ' + response.status + ', Error = ' + response.data);
                    })
                .catch(function (response) {
                    $log.info('Excepcion: ', response);
                    throw response;
                })
                .finally(function () {
                    $log.info('Método ObtenerProcesos finalizado');
                });
        }

        // Al obtener el Material
        function ObtenerVelocidad()
        {
            VelocidadService.ObtenerVelocidadPorMaterial($scope.DatosGenerales.IndiceProceso, $scope.DatosGenerales.Material)
                .then(function (response) {
                    var Estado = response.data.Estado;
                    if (!Estado) {
                        var Mensaje = response.data.Mensaje;
                        $log.info('Se produjo el siguiente error en el método ObtenerVelocidad = ' + Mensaje);
                    }
                    else {
                        var Velocidad = response.data.velocidadModel;
                        $scope.DatosGenerales.Velocidad = Velocidad.Velocidad;
                        $scope.DatosGenerales.IndiceVelocidad = Velocidad.IndiceVelocidad;

                    }
                },
                    function (response) {
                        $log.info('Hubo un error: Estatus = ' + response.status + ', Error = ' + response.data);
                    })
                .catch(function (response) {
                    $log.info('Excepcion: ', response);
                    throw response;
                })
                .finally(function () {
                    $log.info('Método ObtenerVelocidad finalizado');
                });
        }
        
        $scope.ValidarOrden = function () {
            ProcesoService.ObtenerProcesosPorLinea($scope.DatosGenerales.IndiceLinea)
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
                    throw response;
                })
                .finally(function () {
                    $log.info('Método ObtenerProcesos finalizado');
                });
        };

        $scope.$watch('DatosGenerales.IndiceCentro', function (newValue, oldValue) {
            if (newValue !== undefined && newValue !== null && newValue !== '') {

                $scope.DatosGenerales.IndiceDepartamento = null;
                $scope.DatosGenerales.IndiceLinea = null;
                $scope.DatosGenerales.IndiceProceso = null;
                $scope.DatosGenerales.Orden = null;
                $scope.DatosGenerales.Lote = null;
                $scope.DatosGenerales.IndiceVelocidad = null;
                $scope.DatosGenerales.Velocidad = null;
                $scope.DatosGenerales.Material = null;
                $scope.DatosGenerales.Descripcion = null;
                
                $scope.ObtenerDepartamentos();
            }
        });

        $scope.$watch('DatosGenerales.IndiceDepartamento', function (newValue, oldValue) {
            if (newValue !== undefined && newValue !== null && newValue !== '') {
                
                $scope.DatosGenerales.IndiceLinea = null;
                $scope.DatosGenerales.IndiceProceso = null;
                $scope.DatosGenerales.Orden = null;
                $scope.DatosGenerales.Lote = null;
                $scope.DatosGenerales.IndiceVelocidad = null;
                $scope.DatosGenerales.Velocidad = null;
                $scope.DatosGenerales.Material = null;
                $scope.DatosGenerales.Descripcion = null;

                $scope.ObtenerLineas();
            }
        });

        $scope.$watch('DatosGenerales.IndiceLinea', function (newValue, oldValue) {
            if (newValue !== undefined && newValue !== null && newValue !== '') {
                
                $scope.DatosGenerales.IndiceProceso = null;
                $scope.DatosGenerales.Orden = null;
                $scope.DatosGenerales.Lote = null;
                $scope.DatosGenerales.IndiceVelocidad = null;
                $scope.DatosGenerales.Velocidad = null;
                $scope.DatosGenerales.Material = null;
                $scope.DatosGenerales.Descripcion = null;

                $scope.ObtenerProcesos();
            }
        });

        $scope.$watch('DatosGenerales.IndiceProceso', function (newValue, oldValue) {
            if (newValue !== undefined && newValue !== null && newValue !== '') {
                
                $scope.DatosGenerales.Orden = null;
                $scope.DatosGenerales.Lote = null;
                $scope.DatosGenerales.IndiceVelocidad = null;
                $scope.DatosGenerales.Velocidad = null;
                $scope.DatosGenerales.Material = null;
                $scope.DatosGenerales.Descripcion = null;

                ObtenerIndicadorPorProceso();
            }
        });

        $scope.$watch('DatosGenerales.Material', function (newValue, oldValue) {
            if (newValue !== undefined && newValue !== null && newValue !== '') {
                
                $scope.DatosGenerales.IndiceVelocidad = null;
                $scope.DatosGenerales.Velocidad = null;

                ObtenerVelocidad();
            }
        });
    }
}) ();