(function () {
    'use strict';

    angular
        .module('indicadoresoeeapp')
        .controller('CapturaIndicadorController', CapturaIndicadorController);
    
    CapturaIndicadorController.$inject = ['$element', '$scope', '$sce', '$timeout', '$filter',
        '$anchorScroll', '$log', '$window', '$mdDialog', 'moment', 'ESTADO_PAROS',
        'CentroService', 'DepartamentoService', 'LineaService', 'ProcesoService', 'VelocidadService',
        'IndicadorService', 'SAPService', 'UtilFactory'];

    function CapturaIndicadorController($element, $scope, $sce, $timeout, $filter, $anchorScroll,
        $log, $window, $mdDialog, moment, ESTADO_PAROS,
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
            DescripcionMaterial: null,
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
            EstadoHorasParo: false,
            EstadoValidacionOrden: 0,
            ExistenIndicadoresPeriodo: false,
            Estado: ESTADO_PAROS.SIN_ESTADO,
            Estados: ESTADO_PAROS
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
                        $scope.ListaNombres = [];

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

                            var Nombre = Enumerable.From(ListaParos)
                                .Where(function (col) { return col.Indice === IndiceParo; })
                                .OrderBy(function (col) { return col.Indice; })
                                .Select(function (col) { return col.Nombre; })
                                .FirstOrDefault();

                            $scope.ListaNombres.push(Nombre);
                                
                            $scope.ObtenerParos(SiguienteNivel);
                        };

                        $scope.AgregarParo = function () {
                            var Paro = null;

                            $scope.Paro.Nombre = $scope.ListaNombres.join(' - ');
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
            },
            function () { })
            .finally(function () { });
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

        $scope.ValidarOrden = function (ev)
        {
            if (!$scope.DatosGenerales.Orden)
                return;
            
            return IndicadorService.ValidarOrden($scope.DatosGenerales.Orden)
                .then(function (response) {
                    var Estado = response.data.Estado;
                    if (!Estado) {
                        var Mensaje = response.data.Mensaje;
                        $log.info('Se produjo el siguiente error en el método ObtenerProcesos = ' + Mensaje);
                    }
                    else {
                        var Indicador = response.data.Indicador;
                        if (Indicador !== null) {
                            $scope.DatosGenerales.Lote = Indicador.Lote;
                            $scope.DatosGenerales.Material = Indicador.Material;
                            $scope.DatosGenerales.DescripcionMaterial = Indicador.Descripcion;
                            $scope.Util.EstadoValidacionOrden = 1;
                        }
                        else {
                            $mdDialog.show(
                                $mdDialog.alert()
                                    .clickOutsideToClose(false)
                                    .title('Orden no válida')
                                    .textContent('La orden no fue encontrada en SAP')
                                    .ariaLabel('Validando orden')
                                    .ok('Entendido')
                                    .targetEvent(ev)
                            );

                            $scope.DatosGenerales.Lote = null;
                            $scope.DatosGenerales.Material = null;
                            $scope.DatosGenerales.DescripcionMaterial = null;

                            $scope.Util.EstadoValidacionOrden = -1;
                        }
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

        $scope.Guardar = function (ev)
        {
            var ListaParos = angular.copy($scope.ListaParosElegidos);

            if ($scope.Util.ParoSinCausaAsignada > 0) {
                ListaParos.push({ Indice: 0, Nombre: 'Sin causa asignada', Cantidad: $scope.Util.ParoSinCausaAsignada, Folio: null });
            }

            $scope.Indicador =
            {
                IndiceProceso: angular.copy($scope.DatosGenerales.IndiceProceso),
                IndiceVelocidad: angular.copy($scope.DatosGenerales.IndiceVelocidad),
                Orden: angular.copy($scope.DatosGenerales.Orden),
                Lote: angular.copy($scope.DatosGenerales.Lote),
                Material: angular.copy($scope.DatosGenerales.Material),
                DescripcionMaterial: angular.copy($scope.DatosGenerales.DescripcionMaterial),
                Piezas: angular.copy($scope.DatosGenerales.Piezas),
                Reales: 0,
                Ciclo: angular.copy($scope.DatosIndicador.Ciclo),
                Turno: angular.copy($scope.DatosIndicador.Turno),
                Fecha: angular.copy($scope.DatosIndicador.Fecha),
                ListaParos: ListaParos,
                ListaRechazos: $scope.ListaRechazosElegidos
            };

            $log.info($scope.Indicador);

            return IndicadorService.CrearIndicador($scope.Indicador)
                .then(function (response) {
                    var Estado = response.data.Estado;
                    if (!Estado) {
                        var Mensaje = response.data.Mensaje;
                        $log.info('Se produjo el siguiente error en el método CrearIndicador() = ' + Mensaje);
                    }
                    else {
                        var IndiceIndicador = response.data.IndiceIndicador;
                        
                        if (IndiceIndicador > 0) {
                            $mdDialog.show({
                                locals: { IndiceIndicador: IndiceIndicador },
                                controller: ['$scope', 'IndiceIndicador', function ($scope, IndiceIndicador) {
                                    $scope.IndiceIndicador = IndiceIndicador;
                                }],
                                templateUrl: '../Scripts/app/templates/OpcionesGuardar.html',
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
                                closeTo: angular.element(document.querySelector('#btnGuardar'))
                            })
                                .then(function (result) {
                                },
                                    function () { })
                                .finally(function () { });
                        }
                        else {
                            $mdDialog.show(
                                $mdDialog.alert()
                                    .clickOutsideToClose(false)
                                    .title('Creación de indicadores')
                                    .textContent('Hubo un error al intentar crear el indicador')
                                    .ariaLabel('creacion indicadores')
                                    .ok('Entendido'));
                        }
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
                    $log.info('Método BusquedaIndicadoresPeriodo() finalizado');
                });
        };

        $scope.BusquedaIndicadoresPeriodo = function (IndiceProceso, FechaInicial, FechaFinal)
        {
            return IndicadorService.BusquedaIndicadoresPeriodo(IndiceProceso, FechaInicial, FechaFinal)
                .then(function (response) {
                    var Estado = response.data.Estado;
                    if (!Estado) {
                        var Mensaje = response.data.Mensaje;
                        $log.info('Se produjo el siguiente error en el método ObtenerProcesos = ' + Mensaje);
                    }
                    else {
                        $scope.ExistenIndicadoresPeriodo = response.data.Existe;
                        
                        $log.info('Existe = ' + $scope.ExistenIndicadoresPeriodo);
                        //if ($scope.ExistenIndicadoresPeriodo) {
                        //    $scope.Util.Estado = ESTADO_PAROS.SIN_ESTADO;

                        //    $mdDialog.show(
                        //        $mdDialog.alert()
                        //            .clickOutsideToClose(false)
                        //            .title('Búsqueda de indicadores')
                        //            .textContent('Ya existe un indicador en el período que estableciste')
                        //            .ariaLabel('existencia indicadores')
                        //            .ok('Entendido'));
                        //}
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
                    $log.info('Método BusquedaIndicadoresPeriodo() finalizado');
                });
        };

        $scope.ValidacionBotonGuardar = function () {
            var SeDesactiva = true; 

            var EstadoConParos =
                   $scope.Util.Estado === $scope.Util.Estados.CON_PAROS
                && $scope.Util.SumaParos <= $scope.Util.CalculoHorasParo
                && $scope.Util.SumaPiezasRechazadas <= $scope.DatosIndicador.Piezas;

            var EstadoSinParos =
                $scope.Util.Estado === $scope.Util.Estados.SIN_PAROS
                && $scope.Util.SumaPiezasRechazadas <= $scope.DatosIndicador.Piezas;
            
            SeDesactiva = !(EstadoConParos || EstadoSinParos);

            return SeDesactiva;
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
                        var Fecha = moment().year(Indicador.Año).month(Indicador.Mes - 1).date(Indicador.Dia).hour(Indicador.Hora).minute(Indicador.Minuto).second(0).toDate();

                        $scope.DatosGenerales.Orden = Indicador.Orden;
                        $scope.DatosGenerales.Lote = Indicador.Lote;
                        $scope.DatosGenerales.Material = Indicador.Material;
                        $scope.DatosGenerales.DescripcionMaterial = Indicador.DescripcionMaterial;
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
        function ObtenerVelocidad(IndiceProceso, Material)
        {
            return VelocidadService.ObtenerVelocidadPorMaterial(IndiceProceso, Material)
                .then(function (response) {
                    var Estado = response.data.Estado;
                
                    if (!Estado) {
                        var Mensaje = response.data.Mensaje;
                        $log.info('Se produjo el siguiente error en el método ObtenerVelocidad = ' + Mensaje);
                    }
                    else {
                        var Velocidad = response.data.velocidadModel;
                        $scope.DatosGenerales.Velocidad = Velocidad.Velocidad;
                        $scope.DatosGenerales.IndiceVelocidad = Velocidad.Indice;
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
        
        function ObtenerMinutosParos()
        {
            var Velocidad = angular.copy($scope.DatosGenerales.Velocidad);
            var Piezas = angular.copy($scope.DatosIndicador.Piezas);
            var Ciclo = angular.copy($scope.DatosIndicador.Ciclo);

            if (!Velocidad || !Piezas || !Ciclo)
                return;

            $log.info(Piezas);
            Velocidad = parseInt(Velocidad);
            Piezas = parseInt(Piezas);
            Ciclo = parseInt(Ciclo);

            var VelocidadReal = Velocidad * Ciclo / 60;
            var CalculoHoras = parseFloat(Piezas / VelocidadReal);
            var CalculoHorasParo = parseInt((1 - CalculoHoras) * Ciclo);

            $scope.Util.CalculoHorasParo = CalculoHorasParo > 0 ? CalculoHorasParo : 0;
            $scope.Util.CalculoHoras = CalculoHoras > 0 ? CalculoHoras : 0;

            $scope.Util.ParoSinCausaAsignada = 0;

            if ($scope.Util.CalculoHoras < 1 && $scope.Util.CalculoHorasParo > 0) {
                $scope.Util.Estado = $scope.Util.Estados.CON_PAROS;

                var Mensaje = $sce.trustAsHtml('Debes capturar <b>' + CalculoHorasParo + '</b> minutos');
                $scope.Util.MensajeCalculoHoras = 'Minutos de paro';
                $scope.Util.MensajeCalculoHorasParo = Mensaje;
                $scope.Util.ParoSinCausaAsignada = CalculoHorasParo;
                $scope.Util.EstadoHorasParo = true;
            }
            else if ($scope.Util.CalculoHoras >= 0 && $scope.Util.CalculoHoras <= 1.1 && $scope.Util.CalculoHorasParo <= 0) {
                $scope.Util.Estado = $scope.Util.Estados.SIN_PAROS;

                $scope.Util.MensajeCalculoHoras = 'Minutos de paros';
                $scope.Util.MensajeCalculoHorasParo = 'No hay minutos de paros por agregar';
                $scope.Util.EstadoHorasParo = false;
            }
            else if ($scope.Util.CalculoHoras > 1.1) {
                $scope.Util.Estado = $scope.Util.Estados.ERROR;

                $scope.Util.MensajeCalculoHoras = 'Minutos de paros';
                $scope.Util.MensajeCalculoHorasParo = 'Corrige las piezas producidas';
                $scope.Util.EstadoHorasParo = false;
            }
            else {
                $scope.Util.Estado = $scope.Util.Estados.SIN_ESTADO;
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
                $scope.DatosGenerales.DescripcionMaterial = null;
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
                $scope.DatosGenerales.DescripcionMaterial = null;
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
                $scope.DatosGenerales.DescripcionMaterial = null;
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
                $scope.DatosGenerales.DescripcionMaterial = null;
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

                ObtenerVelocidad($scope.DatosGenerales.IndiceProceso, $scope.DatosGenerales.Material);
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
        
        $scope.$watch('Util.Estado', function (newValue, oldValue) {
            if (newValue !== undefined && newValue !== null && newValue !== '' && newValue === 0) {
                $scope.Util.MensajeCalculoHoras = null;
                $scope.Util.MensajeCalculoHorasParo = null;
                $scope.Util.EstadoHorasParo = false;

                $scope.Util.CalculoHoras = 0;
                $scope.Util.CalculoHorasParo = 0;

                //$scope.SumaParos = 0;
                //$scope.SumaPiezasRechazadas = 0;
                //$scope.ParoSinCausaAsignada = 0;
                $scope.MensajeCalculoHoras = null;
                $scope.MensajeCalculoHorasParo = null;

                //$scope.ListaRechazosElegidos = [];
                //$scope.ListaParosElegidos = [];
                
                //$scope.ListaIndicesRechazosEnUso = [];
                //$scope.ListaIndicesParosEnUso = [];

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
                
                if (EsValido) 
                    ObtenerMinutosParos();
                else
                    $scope.Util.Estado = ESTADO_PAROS.SIN_ESTADO;
            }
        );

        $scope.$watchGroup(['DatosGenerales.IndiceProceso', 'DatosIndicador.Fecha', 'DatosIndicador.Hora', 'DatosIndicador.Minuto', 'DatosIndicador.Ciclo'],
            function (newValues, oldValues)
            {
                if (newValues === oldValues)
                    return;

                var IndiceProceso = newValues[0];
                var FechaInicial = newValues[1];
                var Hora = newValues[2];
                var Ciclo = newValues[3];

                if (!IndiceProceso || !FechaInicial || !Ciclo)
                    return;

                var FechaFinal = angular.copy(FechaInicial);
                FechaFinal.setMinutes(FechaFinal.getMinutes() + Ciclo);

                var FechaInicialFormateada = $filter('date')(FechaInicial, "yyyy-MM-dd HH:mm");
                var FechaFinalFormateada = $filter('date')(FechaFinal, "yyyy-MM-dd HH:mm");

                $log.info('$watchGroup');
                $log.info('IndiceProceso = ' + IndiceProceso);
                $log.info('Ciclo = ' + Ciclo);
                $log.info('FechaInicial = ' + FechaInicial);
                $log.info('FechaFinal = ' + FechaFinal);
                $log.info('FechaInicio = ' + FechaInicialFormateada);
                $log.info('FechaFin = ' + FechaFinalFormateada);
                $log.info('Hora = ' + Hora);

                $scope.BusquedaIndicadoresPeriodo(IndiceProceso, FechaInicialFormateada, FechaFinalFormateada);
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
            $scope.Util.FechaLimite = null;

            $scope.Util.EstadoHorasParo = false;
            $scope.Util.Estado = ESTADO_PAROS.SIN_ESTADO;
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