(function () {
    'use strict';

    angular
        .module('indicadoresoeeapp')
        .controller('CapturaIndicadorController', CapturaIndicadorController);
    
    CapturaIndicadorController.$inject = ['$element', '$scope', '$sce', '$timeout', '$location',
        '$anchorScroll', '$log', '$window', '$mdDialog', 'moment',
        'CentroService', 'DepartamentoService', 'LineaService', 'ProcesoService', 'VelocidadService',
        'IndicadorService', 'SAPService', 'UtilFactory'];

    function CapturaIndicadorController($element, $scope, $sce, $timeout, $location, $anchorScroll,
        $log, $window, $mdDialog, moment,
        CentroService, DepartamentoService, LineaService,
        ProcesoService, VelocidadService, IndicadorService, SAPService, UtilFactory)
    {
        $element.find('input').on('keydown', function (ev) {
            ev.stopPropagation();
        });

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
            Ciclo: 0,
            Piezas: 0,
            Fecha: new Date(FechaHoy.getFullYear(), FechaHoy.getMonth(), FechaHoy.getDate(), 0, 0, 0),
            Hora: '0',
            Minuto: '0'
        };

        $scope.Util = {
            FechaLimite: new Date(FechaHoy.getFullYear(), FechaHoy.getMonth(), FechaHoy.getDate(), 0, 0, 0),
            CalculoHoras: null,
            CalculoHorasParo: null,
            MensajeCalculoHoras: null,
            MensajeCalculoHorasParo: null,
            SumaParos: 0,
            SumaPiezasRechazadas: 0,
            ParoSinCausaAsignada: 0,
            EstadoHorasParo: false
        };

        $scope.Turnos = ['A', 'B', 'C', 'D'];

        $scope.TerminoBusqueda = '';

        $scope.ListaCentros = null;
        $scope.ListaDepartamentos = null;
        $scope.ListaLineas = null;
        $scope.ListaProcesos = null;

        $scope.ListaRechazosElegidos = [];
        $scope.ListaParosElegidos = [];

        // Sirven para desactivar de la lista los paros escogidos
        $scope.ListaIndicesRechazosEnUso = [];
        $scope.ListaIndicesParosEnUso = [];

        $scope.agregarParo = function (ev) {
            $mdDialog.show({
                locals: { IndiceProceso: $scope.DatosGenerales.IndiceProceso, ListaIndicesParosEnUso: $scope.ListaIndicesParosEnUso },
                controller: ['$scope', '$element', '$mdDialog', 'ParoService', 'IndiceProceso', 'ListaIndicesParosEnUso',
                    function ($scope, $element, $mdDialog, ParoService, IndiceProceso, ListaIndicesParosEnUso)
                    {
                        $element.find('input').on('keydown', function (ev) {
                            ev.stopPropagation();
                        });

                        $scope.TerminoBusqueda = '';
                        $scope.IndiceParoActual = 0;
                        $scope.HabilitarFolio = false;
                        $scope.EsUltimoNivel = false;

                        $scope.ListaParosPrimerNivel = null;
                        $scope.ListaParosSegundoNivel = null;
                        $scope.ListaParosTercerNivel = null;
                        $scope.ListaParosCuartoNivel = null;
                        $scope.ListaParosQuintoNivel = null;

                        $scope.Paro = {
                            'Indice': null,
                            'Nombre': null,
                            'Cantidad': null,
                            'Folio': null
                        };

                        $scope.IndiceParo = {
                            'Nivel01': null,
                            'Nivel02': null,
                            'Nivel03': null,
                            'Nivel04': null,
                            'Nivel05': null
                        };
                        
                        $scope.ObtenerParos = function (Nivel)
                        {
                            if (Nivel === 1)
                                $scope.IndiceParoActual = 0;

                            return ParoService.ObtenerParosPorGerarquia($scope.IndiceParoActual, IndiceProceso)
                                .then(function (response)
                                {
                                    var Estado = response.data.Estado;
                                    if (!Estado) {
                                        var Mensaje = response.data.Mensaje;
                                        $log.info('Se produjo el siguiente error en el método ObtenerCentros = ' + Mensaje);
                                    }
                                    else {
                                        var ListaParos = response.data.ListaParos;

                                        if (ListaParos !== null && ListaParos.length > 0)
                                        {
                                            switch (Nivel)
                                            {
                                                case 1:
                                                    $scope.HabilitarFolio = false;
                                                    $scope.ListaParosSegundoNivel = null;
                                                    $scope.ListaParosTercerNivel = null;
                                                    $scope.ListaParosCuartoNivel = null;
                                                    $scope.ListaParosQuintoNivel = null;
                                                    $scope.IndiceParo.Nivel01 = null;
                                                    $scope.IndiceParo.Nivel02 = null;
                                                    $scope.IndiceParo.Nivel03 = null;
                                                    $scope.IndiceParo.Nivel04 = null;
                                                    $scope.IndiceParo.Nivel05 = null;
                                                    $scope.ListaParosPrimerNivel = ListaParos;
                                                    break;
                                                case 2:
                                                    $scope.ListaParosSegundoNivel = ListaParos;
                                                    $scope.ListaParosTercerNivel = null;
                                                    $scope.ListaParosCuartoNivel = null;
                                                    $scope.ListaParosQuintoNivel = null;
                                                    $scope.IndiceParo.Nivel02 = null;
                                                    $scope.IndiceParo.Nivel03 = null;
                                                    $scope.IndiceParo.Nivel04 = null;
                                                    $scope.IndiceParo.Nivel05 = null;
                                                    break;
                                                case 3:
                                                    $scope.ListaParosTercerNivel = ListaParos;
                                                    $scope.ListaParosCuartoNivel = null;
                                                    $scope.ListaParosQuintoNivel = null;
                                                    $scope.IndiceParo.Nivel03 = null;
                                                    $scope.IndiceParo.Nivel04 = null;
                                                    $scope.IndiceParo.Nivel05 = null;
                                                    break;
                                                case 4:
                                                    $scope.ListaParosCuartoNivel = ListaParos;
                                                    $scope.ListaParosQuintoNivel = null;
                                                    $scope.IndiceParo.Nivel04 = null;
                                                    $scope.IndiceParo.Nivel05 = null;
                                                    break;
                                                case 5:
                                                    $scope.ListaParosQuintoNivel = ListaParos;
                                                    $scope.IndiceParo.Nivel05 = null;
                                                    break;
                                            }

                                            $scope.EsUltimoNivel = false;
                                            InicializarParo();
                                        }
                                        else {
                                            $scope.EsUltimoNivel = true;
                                            $scope.Paro.Indice = $scope.IndiceParoActual;
                                        }

                                    }
                                })
                                .catch(function (response) {
                                    $log.error('Excepcion: ', response.data);
                                })
                                .finally(function () {
                                    $log.info('Método ObtenerParos() finalizado');
                                });
                        };

                        $scope.AveriaParoPadre = function ()
                        {
                            var Nombre = Enumerable.From($scope.ListaParosPrimerNivel)
                                .Where(function (col) { return col.Indice === $scope.IndiceParo.Nivel01; })
                                .Select(function (col) { return col.Nombre; })
                                .FirstOrDefault();

                            if (!Nombre)
                                return false;
                            return EsAveria(Nombre);

                        };

                        function EsAveria(Nombre) {
                            return Nombre.toLowerCase() === 'averías' || Nombre.toLowerCase() === 'averias' || Nombre.toLowerCase() === 'avería' || Nombre.toLowerCase() === 'averia';
                        }
                        
                        $scope.ParoEscogido = function (IndiceParo, Nivel)
                        {
                            $scope.IndiceParoActual = IndiceParo;
                            var SiguienteNivel = parseInt(Nivel) + 1;

                            var ListaParos = null;
                            switch (Nivel) {
                                case 1:
                                    ListaParos = $scope.ListaParosPrimerNivel;
                                    $scope.HabilitarFolio = $scope.AveriaParoPadre();
                                    break;
                                case 2:
                                    ListaParos = $scope.ListaParosSegundoNivel;
                                    break;
                                case 3:
                                    ListaParos = $scope.ListaParosTercerNivel;
                                    break;
                                case 4:
                                    ListaParos = $scope.ListaParosCuartoNivel;
                                    break;
                                case 5:
                                    ListaParos = $scope.ListaParosQuintoNivel;
                                    break;
                                default:
                                    ListaParos = [];
                            }

                            $scope.Paro.Nombre = Enumerable.From(ListaParos)
                                .Where(function (col) { return col.Indice === IndiceParo; })
                                .OrderBy(function (col) { return col.Indice; })
                                .Select(function (col) { return col.Nombre; })
                                .FirstOrDefault();



                            $scope.ObtenerParos(SiguienteNivel);
                        };

                        $scope.AgregarParo = function () {
                            var Paro = null;

                            $scope.Cantidad = parseInt($scope.Cantidad);
                            Paro = angular.copy($scope.Paro);
                            $mdDialog.hide(Paro);
                        };

                        $scope.ResetearTerminoBusqueda = function () {
                            $scope.TerminoBusqueda = '';
                        };

                        $scope.DesactivarSiEstaEnUso = function (IndiceParo) {
                            var Existe = Enumerable.From(ListaIndicesParosEnUso).Any(function (item) { return item === IndiceParo; });

                            return Existe;
                        };

                        $scope.Inicializar = function () {
                            $scope.TerminoBusqueda = '';
                            $scope.EsUltimoNivel = false;
                            $scope.IndiceParoActual = 0;
                            $scope.HabilitarFolio = false;

                            $scope.ListaParosPrimerNivel = null;
                            $scope.ListaParosSegundoNivel = null;
                            $scope.ListaParosTercerNivel = null;
                            $scope.ListaParosCuartoNivel = null;
                            $scope.ListaParosQuintoNivel = null;
                            
                            $scope.IndiceParo.Nivel01 = null;
                            $scope.IndiceParo.Nivel02 = null;
                            $scope.IndiceParo.Nivel03 = null;
                            $scope.IndiceParo.Nivel04 = null;
                            $scope.IndiceParo.Nivel05 = null;

                            InicializarParo();
                        };

                        function InicializarParo () {
                            $scope.Paro.Indice = null;
                            $scope.Paro.Nombre = null;
                            $scope.Paro.Cantidad = null;
                            $scope.Paro.Folio = null;
                        }

                }],
                templateUrl: '../Scripts/app/templates/AgregarParos.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                onShowing: function () {
                },
                onComplete: function () {
                },
                onRemoving: function (event, removePromise) {
                },
                fullscreen: true,
                closeTo: angular.element(document.querySelector('#btnAddParo'))
            })
                .then(function (Paro) {
                    $scope.ListaParosElegidos.push(Paro);
                    $scope.ListaIndicesParosEnUso.push(Paro.Indice);
                    $scope.Util.SumaParos += Paro.Cantidad;
                    var resta = $scope.Util.ParoSinCausaAsignada - Paro.Cantidad;
                    $scope.Util.ParoSinCausaAsignada = resta >= 0 ? resta : 0;
                }, function () {
                })
                .finally(function () {
                });
        };

        $scope.agregarRechazo = function (ev) {
            $mdDialog.show({
                locals: { IndiceProceso: $scope.DatosGenerales.IndiceProceso, ListaIndicesRechazosEnUso: $scope.ListaIndicesRechazosEnUso },
                controller: ['$scope', '$element', '$mdDialog', 'RechazoService', 'UtilFactory', 'IndiceProceso', 'ListaIndicesRechazosEnUso',
                    function ($scope, $element, $mdDialog, RechazoService, UtilFactory, IndiceProceso, ListaIndicesRechazosEnUso)
                    {
                        $scope.TerminoBusqueda = '';
                        $scope.Rechazo = { 'Indice': null, 'Nombre': null, 'Cantidad': null };

                        $element.find('input').on('keydown', function (ev) {
                            ev.stopPropagation();
                        });

                        $scope.ResetearTerminoBusqueda = function () {
                            $scope.TerminoBusqueda = '';
                        };

                        $scope.DesactivarSiEstaEnUso = function (IndiceRechazo) {
                            var Existe = Enumerable.From(ListaIndicesRechazosEnUso).Any(function (item) { return item === IndiceRechazo; });

                            return Existe;
                        };

                        $scope.ObtenerRechazos = function ()
                        {
                            return RechazoService.ObtenerRechazos(IndiceProceso)
                                .then(function (response)
                                {
                                    var Estado = response.data.Estado;
                                    if (!Estado)
                                    {
                                        var Mensaje = response.data.Mensaje;
                                        $log.info('Se produjo el siguiente error en el método ObtenerCentros = ' + Mensaje);
                                    }
                                    else
                                    {
                                        $scope.ListaRechazos = response.data.ListaRechazos;
                                        $scope.Rechazo.Indice = $scope.ListaRechazos.length === 1 ? $scope.ListaRechazos[0].Indice : null;
                                    }
                                })
                                .catch(function (response)
                                {
                                    $log.error('Excepcion: ', response.data);
                                })
                                .finally(function ()
                                {
                                    $log.info('Método ObtenerCentros() finalizado');
                                });
                        };

                        $scope.cancel = function () {
                            $mdDialog.cancel();
                        };

                        $scope.AgregarRechazo = function () {
                            var Rechazo = null;

                            $scope.Rechazo.Nombre  = Enumerable.From($scope.ListaRechazos)
                                .Where(function (x) { return x.Indice === $scope.Rechazo.Indice; })
                                .OrderBy(function (x) { return x.Indice; })
                                .Select(function (x) { return x.Nombre; })
                                .FirstOrDefault();

                            $scope.Rechazo.Cantidad = parseInt($scope.Rechazo.Cantidad);
                            Rechazo = angular.copy($scope.Rechazo);
                            $mdDialog.hide(Rechazo);
                        };

                        $scope.Inicializar = function () {
                            $scope.Rechazo.Indice = null;
                            $scope.Rechazo.Nombre = null;
                            $scope.Rechazo.Cantidad = null;
                        };
                    }],
                templateUrl: '../Scripts/app/templates/AgregarRechazos.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                onShowing: function () {
                },
                onComplete: function () {
                },
                onRemoving: function (event, removePromise) {
                },
                fullscreen: true,
                closeTo: angular.element(document.querySelector('#btnAddRechazo'))
            })
                .then(function (Rechazo) {
                    $scope.ListaRechazosElegidos.push(Rechazo);
                    $scope.ListaIndicesRechazosEnUso.push(Rechazo.Indice);
                    $scope.Util.SumaPiezasRechazadas += Rechazo.Cantidad;
                }, function () {
            })
            .finally(function () {
            });
        };

        
        $scope.ObtenerCentros = function ()
        {
            return CentroService.ObtenerCentros()
                .then(function (response)
                {
                    var Estado = response.data.Estado;
                    if (!Estado) {
                        var Mensaje = response.data.Mensaje;
                        $log.info('Se produjo el siguiente error en el método ObtenerCentros = ' + Mensaje);
                    }
                    else {
                        $scope.ListaCentros = response.data.ListaCentros;
                        $scope.DatosGenerales.IndiceCentro = $scope.ListaCentros.length === 1 ? $scope.ListaCentros[0].Indice : null;
                    }
                })
                .catch(function (response) {
                    $log.error('Excepcion: ', response.data);
                })
                .finally(function () {
                    $log.info('Método ObtenerCentros() finalizado');
                });
        };

        $scope.ObtenerDepartamentos = function ()
        {
            if ($scope.ListaDepartamentos)
                return;

            return DepartamentoService.ObtenerDepartamentosPorCentro($scope.DatosGenerales.IndiceCentro)
                .then(function (response)
                {
                    var Estado = response.data.Estado;
                    if (!Estado) {
                        var Mensaje = response.data.Mensaje;
                        $log.info('Se produjo el siguiente error en el método ObtenerDepartamentos = ' + Mensaje);
                    }
                    else {
                        $scope.ListaDepartamentos = response.data.ListaDepartamentos;
                        $scope.DatosGenerales.IndiceDepartamento = $scope.ListaDepartamentos.length === 1 ? $scope.ListaDepartamentos[0].Indice : null;
                    }
                })
                .catch(function (response) {
                    $log.error('Excepcion: ', response.data);
                })
                .finally(function () {
                    $log.info('Método ObtenerDepartamentos() finalizado');
                });
        };

        $scope.ObtenerLineas = function ()
        {
            if ($scope.ListaLineas)
                return;

            return LineaService.ObtenerLineasPorDepartamento($scope.DatosGenerales.IndiceDepartamento)
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
            if ($scope.ListaProcesos)
                return;

            return ProcesoService.ObtenerProcesosPorLinea($scope.DatosGenerales.IndiceLinea)
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
            return IndicadorService.ObtenerIndicadorPorProceso($scope.DatosGenerales.IndiceProceso)
                .then(function (response) {
                    var Estado = response.data.Estado;
                    if (!Estado) {
                        var Mensaje = response.data.Mensaje;
                        $log.info('Se produjo el siguiente error en el método ObtenerIndicadorPorProceso = ' + Mensaje);
                    }
                    else {
                        var Indicador = response.data.Indicador;
                        var Fecha = moment().year(Indicador.Año).month(Indicador.Mes).date(Indicador.Dia).hour(Indicador.Hora).minute(Indicador.Minuto).second(0).toDate();

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
                    $log.info('Método ObtenerIndicadorPorProceso() finalizado');
                });
        }

        // Al obtener el Material
        function ObtenerVelocidad()
        {
            if ($scope.DatosGenerales.IndiceProceso === null || $scope.DatosGenerales.IndiceProceso === '')
                return;
            if ($scope.DatosGenerales.Material === null || $scope.DatosGenerales.Material === '')
                return;

            return VelocidadService.ObtenerVelocidadPorMaterial($scope.DatosGenerales.IndiceProceso, $scope.DatosGenerales.Material)
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
            return SAPService.ValidarOrden($scope.DatosGenerales.Orden)
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
        
        function ObtenerMinutosParos()
        {
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

            $scope.Util.ParoSinCausaAsignada = 0;

            if ($scope.Util.CalculoHoras < 1 && $scope.Util.CalculoHorasParo > 0) {
                var Mensaje = $sce.trustAsHtml('Debes capturar lo equivalente a <b>' + CalculoHorasParo + '</b> minutos de paros');
                $scope.Util.MensajeCalculoHoras = 'Atención';
                $scope.Util.MensajeCalculoHorasParo = Mensaje;
                $scope.Util.ParoSinCausaAsignada = CalculoHorasParo;
                $scope.Util.EstadoHorasParo = true;
            }
            else if ($scope.Util.CalculoHoras >= 0 && $scope.Util.CalculoHoras <= 1.1 && $scope.Util.CalculoHorasParo <= 0) {
                $scope.Util.MensajeCalculoHoras = 'Correcto';
                $scope.Util.MensajeCalculoHorasParo = 'No hay minutos de paros por agregar';
                $scope.Util.EstadoHorasParo = false;
            }
            else if ($scope.Util.CalculoHoras > 1.1) {
                $scope.Util.MensajeCalculoHoras = 'Incorrecto';
                $scope.Util.MensajeCalculoHorasParo = 'Corrige las piezas producidas';
                $scope.Util.EstadoHorasParo = false;
            }

            $log.info('Método ObtenerMinutosParos() finalizado');
        }
        
        $scope.$watch('DatosGenerales.IndiceCentro', function (newValue, oldValue)
        {
            if (newValue)
            {
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

                $scope.ListaDepartamentos = null;
                $scope.ListaLineas = null;
                $scope.ListaProcesos = null;

                $scope.ObtenerDepartamentos();
            }
        });

        $scope.$watch('DatosGenerales.IndiceDepartamento', function (newValue, oldValue)
        {
            if (newValue)
            {
                $scope.DatosGenerales.IndiceLinea = null;
                $scope.DatosGenerales.IndiceProceso = null;
                $scope.DatosGenerales.Orden = null;
                $scope.DatosGenerales.Lote = null;
                $scope.DatosGenerales.IndiceVelocidad = null;
                $scope.DatosGenerales.Velocidad = null;
                $scope.DatosGenerales.Material = null;
                $scope.DatosGenerales.Descripcion = null;
                $scope.ResetearDatosIndicador();
                
                $scope.ListaLineas = null;
                $scope.ListaProcesos = null;

                $scope.ObtenerLineas();
            }
        });

        $scope.$watch('DatosGenerales.IndiceLinea', function (newValue, oldValue)
        {
            if (newValue)
            {
                $scope.DatosGenerales.IndiceProceso = null;
                $scope.DatosGenerales.Orden = null;
                $scope.DatosGenerales.Lote = null;
                $scope.DatosGenerales.IndiceVelocidad = null;
                $scope.DatosGenerales.Velocidad = null;
                $scope.DatosGenerales.Material = null;
                $scope.DatosGenerales.Descripcion = null;
                $scope.ResetearDatosIndicador();

                $scope.ListaProcesos = null;

                $scope.ObtenerProcesos();
            }
        });

        $scope.$watch('DatosGenerales.IndiceProceso', function (newValue, oldValue)
        {
            if (newValue)
            {
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

        $scope.$watch('DatosGenerales.Material', function (newValue, oldValue)
        {
            if (newValue)
            {
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
            function (newValues, oldValues)
            {
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
            $scope.DatosIndicador.Ciclo = 0;
            $scope.DatosIndicador.Piezas = 0;
            $scope.DatosIndicador.Fecha = null;
            $scope.DatosIndicador.Hora = null;
            $scope.DatosIndicador.Minuto = null;
            
            $scope.Util.MensajeCalculoHoras = null;
            $scope.Util.MensajeCalculoHorasParo = null;
            $scope.Util.SumaParos = 0;
            $scope.Util.SumaPiezasRechazadas = 0;
            $scope.Util.ParoSinCausaAsignada = 0;
            $scope.Util.CalculoHorasParo = null;
            $scope.Util.CalculoHoras = null;

            $scope.Util.EstadoHorasParo = false;
        };

        $scope.ValidarHora = function (Index) {
            if (!$scope.DatosGenerales.IndiceProceso || !$scope.DatosIndicador.Fecha)
                return;

            var Fecha1 = angular.copy($scope.DatosIndicador.Fecha);
            var Fecha2 = angular.copy($scope.Util.FechaLimite);

            var HoraLimite = $scope.Util.FechaLimite.getHours();
            var FechasIguales = Fecha1.getTime() === Fecha2.getTime();
            var LaHoraActualEsMayorQueLaEstablecida = Index > HoraLimite;
            var SeDesactiva = false;

            //$log.info('Fecha1 = ' + Fecha1.getTime() + ', Fecha2 = ' + Fecha2.getTime());
            //$log.info('FechasIguales = ' + FechasIguales + ', LaHoraActualEsMayorQueLaEstablecida = ' + LaHoraActualEsMayorQueLaEstablecida);
            if (FechasIguales && LaHoraActualEsMayorQueLaEstablecida)
                SeDesactiva = true;
            else
                SeDesactiva = false;

            //$log.info('SeDesactiva = ' + SeDesactiva);
            return SeDesactiva;
        };
        
        $scope.ValidarMinuto = function (Index) {
            if (!$scope.DatosGenerales.IndiceProceso || !$scope.DatosIndicador.Fecha)
                return;

            var Fecha1 = angular.copy($scope.DatosIndicador.Fecha);
            var Fecha2 = angular.copy($scope.Util.FechaLimite);

            var MinutoLimite = $scope.Util.FechaLimite.getMinutes();
            var FechasIguales = Fecha1.getTime() === Fecha2.getTime();
            var LaHoraActualEsMayorQueLaEstablecida = Index > MinutoLimite;
            var SeDesactiva = false;

            if (FechasIguales && LaHoraActualEsMayorQueLaEstablecida)
                SeDesactiva = true;
            else
                SeDesactiva = false;

            return SeDesactiva;
        };

        $scope.TransformarChipParos = function (chip) {
            return {
                Nombre: chip.Nombre,
                Cantidad: chip.Cantidad,
                Folio: chip.Folio
            };
        };

        $scope.TransformarChipRechazos = function (chip) {
            return {
                Nombre: chip.Nombre,
                Cantidad: chip.Cantidad
            };
        };

        $scope.QuitarRechazo = function (Rechazo)
        {
            var IndiceLista = UtilFactory.FiltrarArreglo($scope.ListaIndicesRechazosEnUso, function (item) { return item === Rechazo.Indice; });

            if (IndiceLista !== -1) {
                $scope.ListaIndicesRechazosEnUso.splice(IndiceLista, 1);
                $scope.Util.SumaPiezasRechazadas -= Rechazo.Cantidad;
            }
        };

        $scope.QuitarParo = function (Paro)
        {
            var IndiceLista = UtilFactory.FiltrarArreglo($scope.ListaIndicesParosEnUso, function (item) { return item === Paro.Indice; });

            if (IndiceLista !== -1) {
                $scope.ListaIndicesParosEnUso.splice(IndiceLista, 1);
                $scope.Util.SumaParos -= Paro.Cantidad;
                var CantidadParoSinCausaAsignada = $scope.Util.ParoSinCausaAsignada + Paro.Cantidad;
                $scope.Util.ParoSinCausaAsignada = CantidadParoSinCausaAsignada > $scope.Util.CalculoHorasParo ? $scope.Util.CalculoHorasParo : CantidadParoSinCausaAsignada; 
            }
        };
    }
}) ();