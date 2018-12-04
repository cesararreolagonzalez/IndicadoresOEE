(function () {
    'use strict';

    angular
        .module('indicadoresoeeapp')
        .controller('CapturaIndicadorController', CapturaIndicadorController);
    
    CapturaIndicadorController.$inject = ['$element', '$scope', '$sce', '$timeout', '$location',
        '$anchorScroll', '$log', '$http', '$window', '$mdDialog', 'moment',
        'CentroService', 'DepartamentoService', 'LineaService', 'ProcesoService', 'VelocidadService',
        'IndicadorService', 'SAPService', 'UtilFactory'];

    function CapturaIndicadorController($element, $scope, $sce, $timeout, $location, $anchorScroll,
        $log, $http, $window, $mdDialog, moment,
        CentroService, DepartamentoService, LineaService, ProcesoService, VelocidadService, IndicadorService, SAPService, UtilFactory)
    {
        $scope.Turnos = ['A', 'B', 'C', 'D'];

        $element.find('input').on('keydown', function (ev) {
            ev.stopPropagation();
        });

        $scope.TerminoBusqueda = '';

        var FechaHoy = new Date();
        
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

        $scope.DatosIndicador = {
            Turno: null,
            Ciclo: null,
            Piezas: null,
            Fecha: null,
            Hora: null,
            Minuto: null
        };
        
        $scope.Util = {
            FechaLimite: new Date(FechaHoy.getFullYear(), FechaHoy.getMonth(), FechaHoy.getDate(), 0, 0, 0),
            CalculoHoras: null,
            CalculoHorasParo: null,
            MensajeCalculoHoras: null,
            MensajeCalculoHorasParo: null
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

                        return response.data.ListaCentros;
                    }

                    return null;
                },
                    function (response) {
                        $log.info('Hubo un error: Estatus = ' + response.status + ', Error = ' + response.data);
                    })
                .catch(function (response) {
                    $log.error('Excepcion: ', response);
                })
                .finally(function () {
                    $log.info('Método ObtenerCentros() finalizado');
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
                    $log.info('Método ObtenerDepartamentos() finalizado');
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
                    $log.info('Método ObtenerLineas() finalizado');
                });
        };

        $scope.ObtenerProcesos = function ()
        {
            ProcesoService.ObtenerProcesosPorLinea($scope.DatosGenerales.IndiceLinea)
                .then(function (response) {
                    var Estado = response.data.Estado;
                    if (!Estado) {
                        var Mensaje = response.data.Mensaje;
                        $log.info('Se produjo el siguiente error en el método ObtenerProcesos = ' + Mensaje);
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
                    $log.info('Método ObtenerProcesos() finalizado');
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
                        $log.info('Se produjo el siguiente error en el método ObtenerIndicadorPorProceso = ' + Mensaje);
                    }
                    else {
                        var Indicador = response.data.Indicador;
                        var Fecha = moment().year(Indicador.Año).month(Indicador.Mes).date(Indicador.Dia).hour(Indicador.Hora).minute(Indicador.Minuto).second(0).toDate();
                        console.log('Fecha = ' + Fecha);

                        $scope.DatosGenerales.Orden = Indicador.Orden;
                        $scope.DatosGenerales.Lote = Indicador.Lote;
                        $scope.DatosGenerales.Material = Indicador.Material;
                        $scope.DatosGenerales.Descripcion = Indicador.DescripcionMaterial;
                        $scope.DatosGenerales.Velocidad = Indicador.Velocidad;
                        $scope.DatosGenerales.IndiceVelocidad = Indicador.IndiceVelocidad;

                        $scope.DatosIndicador.Ciclo = Indicador.Ciclo;
                        $scope.DatosIndicador.Turno = Indicador.Turno;
                        $scope.DatosIndicador.Hora = Indicador.Hora;
                        $scope.DatosIndicador.Minuto = Indicador.Minuto;

                        $scope.DatosIndicador.Fecha = angular.copy(Fecha);
                        $scope.Util.FechaLimite = angular.copy(Fecha);
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
                    $log.info('Método ObtenerProcesos() finalizado');
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
                    $log.info('Método ObtenerVelocidad() finalizado');
                });
        }

        // Opcional. Validación de la Orden en SAP
        $scope.ValidarOrden = function () {
            SAPService.ValidarOrden($scope.DatosGenerales.Orden)
                .then(function (response) {
                    var Estado = response.data.Estado;
                    if (!Estado) {
                        var Mensaje = response.data.Mensaje;
                        $log.info('Se produjo el siguiente error en el método ValidarOrden = ' + Mensaje);
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
                    $log.info('Método ValidarOrden() finalizado');
                });
        };
        
        function ObtenerMinutosParos() {
            var TotalMintuosParos = 0;

            var Velocidad = angular.copy($scope.DatosGenerales.Velocidad);
            var Piezas = angular.copy($scope.DatosIndicador.Piezas);
            var Ciclo = angular.copy($scope.DatosIndicador.Ciclo);

            if (UtilFactory.EsNuloOVacio(Velocidad) || UtilFactory.EsNuloOVacio(Piezas) || UtilFactory.EsNuloOVacio(Ciclo))
                return;

            Velocidad = parseInt(Velocidad);
            Piezas = parseInt(Piezas);
            Ciclo = parseInt(Ciclo);

            var VelocidadReal = Velocidad * Ciclo / 60;
            var CalculoHoras = parseFloat(Piezas / VelocidadReal);
            var CalculoHorasParo = parseInt((1 - CalculoHoras) * Ciclo);

            $scope.Util.CalculoHorasParo = CalculoHorasParo;
            $scope.Util.CalculoHoras = CalculoHoras;

            if ($scope.Util.CalculoHoras < 1 && $scope.Util.CalculoHorasParo > 0) {
                var Mensaje = $sce.trustAsHtml('Debes capturar lo equivalente a <b>' + CalculoHorasParo + '</b> minutos de paros');
                $scope.Util.MensajeCalculoHoras = 'Atención';
                $scope.Util.MensajeCalculoHorasParo = Mensaje;
            }
            else if ($scope.Util.CalculoHoras >= 0 && $scope.Util.CalculoHoras <= 1.1 && $scope.Util.CalculoHorasParo <= 0) {
                $scope.Util.MensajeCalculoHoras = 'Correcto';
                $scope.Util.MensajeCalculoHorasParo = 'No hay minutos de paros por agregar';
            }
            else if ($scope.Util.CalculoHoras > 1.1) {
                $scope.Util.MensajeCalculoHoras = 'Incorrecto';
                $scope.Util.MensajeCalculoHorasParo = 'Corrige las piezas producidas';
            }

            $log.info('Método ObtenerMinutosParos() finalizado');
        }
        
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
                $scope.ResetearDatosIndicador();
                
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
                $scope.ResetearDatosIndicador();

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
                $scope.ResetearDatosIndicador();

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
                $scope.ResetearDatosIndicador();

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

        $scope.$watch('DatosIndicador.Hora', function (newValue, oldValue) {
            if (newValue !== undefined && newValue !== null && newValue !== '') {
                $scope.DatosIndicador.Fecha.setHours(newValue);
            }
        });

        $scope.$watch('DatosIndicador.Minuto', function (newValue, oldValue) {
            if (newValue !== undefined && newValue !== null && newValue !== '') {
                $scope.DatosIndicador.Fecha.setMinutes(newValue);
            }
        });

        $scope.$watchGroup(['DatosIndicador.Piezas', 'DatosIndicador.Fecha', 'DatosIndicador.Ciclo'],
            function (newValues, oldValues) {
                if (newValues === oldValues)
                    return;

                var Piezas = newValues[0];
                var Fecha = newValues[1];
                var Ciclo = newValues[2];

                var EsValido = !UtilFactory.EsNuloOVacio(Piezas) && !UtilFactory.EsNuloOVacio(Fecha) && !UtilFactory.EsNuloOVacio(Ciclo);
                
                if (EsValido) {
                    
                    ObtenerMinutosParos();
                }
            }
        );


        $scope.ResetearTerminoBusqueda = function () {
            $scope.TerminoBusqueda = '';
        };


        $scope.ResetearDatosIndicador = function () {
            $scope.DatosIndicador.Turno = null;
            $scope.DatosIndicador.Ciclo = null;
            $scope.DatosIndicador.Piezas = null;
            $scope.DatosIndicador.Fecha = null;
            $scope.DatosIndicador.Hora = null;
            $scope.DatosIndicador.Minuto = null;
            
            $scope.Util.MensajeCalculoHoras = null;
            $scope.Util.MensajeCalculoHorasParo = null;
        };

        $scope.VerFecha = function () {
            $log.info($scope.DatosIndicador.Fecha);
            $log.info($scope.Util.FechaLimite);
            $log.info($scope.DatosIndicador.Fecha < $scope.Util.FechaLimite);
        };
    }
}) ();