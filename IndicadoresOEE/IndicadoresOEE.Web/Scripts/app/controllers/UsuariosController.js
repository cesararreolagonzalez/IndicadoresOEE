(function () {
    'use strict';

    angular
        .module('indicadoresoeeapp')
        .controller('UsuariosController', UsuariosController);

    UsuariosController.$inject = ['$scope', '$timeout', '$log', '$mdDialog', 'ModalService', 'CentroService', 'DepartamentoService', 'LineaService', 'UsuarioService', 'PerfilService'];

    function UsuariosController($scope, $timeout, $log, $mdDialog, ModalService, CentroService, DepartamentoService, LineaService, UsuarioService, PerfilService)
    {
        // #region JavaScript's Methods
        $('.md-datepicker-input').prop('readonly', true);
        // #endregion
        // #region Attributes
        $scope.ListaUsuarios = null;
        $scope.selected = [];
        $scope.limitOptions = [5, 10, 15];

        $scope.filter = { search: null };
        $scope.options = {
            rowSelection: true,
            multiSelect: false,
            autoSelect: true,
            decapitate: false,
            largeEditDialog: false,
            boundaryLinks: false,
            limitSelect: true,
            pageSelect: true
        };
        $scope.query = {
            order: 'Usuario',
            limit: 10,
            page: 1
        };
        
        $scope.Parametros =
        {
            IndiceCentro: null,
            IndiceDepartamento: null,
            IndiceLinea: null,
            IndiceProceso: null,
            IndiceVelocidad: null,
            IndiceMotivo: null
        };
        $scope.ListaLineas = null;
        $scope.ListaCentros = null;
        $scope.ListaProcesos = null;
        $scope.ListaVelocidades = null;
        $scope.ListaDepartamentos = null;
        // #endregion
        // #region Methods
        $scope.Init = function () {
            var PromiseUsuarios = $scope.ObtenerUsuarios();
            var PromisePerfiles = $scope.ObtenerPerfiles();
            $scope.promise = PromiseUsuarios;
            Promise.all([PromiseUsuarios, PromisePerfiles]);
        };
        $scope.VerUsuario = function (IndiceUsuario, ev) {
            var confirm = $mdDialog.confirm()
                .title('Would you like to delete your debt?')
                .textContent('All of the banks have agreed to forgive you your debts.')
                .ariaLabel('Lucky day')
                .targetEvent(ev)
                .ok('Please do it!')
                .cancel('Sounds like a scam');
            $mdDialog.show(confirm).then(function () {
                $scope.status = 'You decided to get rid of your debt.';
            }, function () {
                $scope.status = 'You decided to keep your debt.';
            });
        };
        $scope.EditarUsuario = function (IndiceUsuario, ev) {
            $mdDialog.show({
                locals: { IndiceProceso: IndiceUsuario },
                controller: ['$scope', '$element', '$mdDialog', 'IndiceProceso',
                    function ($scope, $element, $mdDialog, IndiceProceso)
                    {
                        $element.find('input').on('keydown', function (ev) {
                            ev.stopPropagation();
                        });
                    }],
                templateUrl: '../Scripts/app/templates/Usuario/Editar.html',
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
                closeTo: angular.element(document.querySelector('#btnEditarUsuario'))
            })
                .then(function (Paro) {
                },
                    function () { })
                .finally(function () { });
        };
        $scope.EliminarUsuario = function (IndiceUsuario, NombreUsuario, ev) {
            var confirm = $mdDialog.confirm()
                .title('Eliminar usuario')
                .textContent('¿Confirmas que deseas eliminar el usuario ' + NombreUsuario + '?')
                .ariaLabel('Eliminar usuario')
                .parent(angular.element(document.querySelector('body')))
                .ok('Aceptar')
                .cancel('Cancelar');
            $mdDialog.show(confirm).then(function ()
            {
                ModalService.showWait();
                return UsuarioService.EliminarUsuario(IndiceUsuario)
                    .then(function (response) {
                        $log.info(response.data);
                        var Estado = response.data.Response.Estado;

                        if (!Estado) {
                            var Mensaje = response.data.Response.Mensaje;
                            $log.info('Se produjo el siguiente error en el método EliminarUsuario = ' + Mensaje);
                            $scope.MostrarDialogoError('Se produjo un error al intentar eliminar el usuario ' + NombreUsuario);
                        }
                        else {
                            $mdDialog.show(
                                $mdDialog.alert()
                                    .parent(angular.element(document.querySelector('body')))
                                    .clickOutsideToClose(false)
                                    .title('')
                                    .textContent('     El usuario ' + NombreUsuario + ' ha sido eliminado.     ')
                                    .ariaLabel('Usuario Eliminado')
                                    .ok('Aceptar')
                            );
                        }
                    })
                    .catch(function (response) {
                        $scope.MostrarDialogoError('Se produjo una excepción al intentar eliminar el usuario ' + NombreUsuario);
                        $log.error('Excepcion: ');
                        $log.error(response);
                    })
                    .finally(function () {
                        ModalService.hideWait();
                        $log.info('Método ObtenerUsuarios() finalizado');
                    });
            }, function () {
            });
        };
        $scope.ObtenerUsuarios = function () {
            return UsuarioService.ObtenerUsuarios()
                .then(function (response) {
                    $log.info(response.data);
                    var Estado = response.data.Response.Estado;

                    if (!Estado) {
                        var Mensaje = response.data.Response.Mensaje;
                        $log.info('Se produjo el siguiente error en el método ObtenerUsuarios = ' + Mensaje);
                        $scope.MostrarDialogoError('Se produjo un error al intentar obtener la lista de usuarios');
                    }
                    else {
                        $scope.ListaUsuarios = response.data.Response.Mensaje;
                        //Promise.all([$scope.ObtenerPerfiles()]);
                    }
                })
                .catch(function (response) {
                    $scope.MostrarDialogoError('Se produjo una excepción al intentar obtener la lista de usuarios');
                    $log.error('Excepcion: ');
                    $log.error(response);
                })
                .finally(function () {
                    $log.info('Método ObtenerUsuarios() finalizado');
                });
        };
        $scope.ObtenerPerfiles = function () {
            return PerfilService.ObtenerPerfiles()
                .then(function (response) {
                    $log.info(response.data);
                    var Estado = response.data.Response.Estado;

                    if (!Estado) {
                        var Mensaje = response.data.Response.Mensaje;
                        $log.info('Se produjo el siguiente error en el método ObtenerPerfiles = ' + Mensaje);
                        $scope.MostrarDialogoError('Se produjo un error al intentar obtener la lista de perfiles');
                    }
                    else {
                        $scope.ListaPerfiles = response.data.Response.Mensaje;
                    }
                })
                .catch(function (response) {
                    $scope.MostrarDialogoError('Se produjo una excepción al intentar obtener la lista de perfiles');
                    $log.error('Excepcion: ');
                    $log.error(response);
                })
                .finally(function () {
                    $log.info('Método ObtenerPerfiles() finalizado');
                });
        };
        $scope.ObtenerDepartamentos = function () {
            if ($scope.ListaDepartamentos)
                return;

            return DepartamentoService.ObtenerDepartamentosPorCentro($scope.Parametros.IndiceCentro)
                .then(function (response) {
                    var status = response.status;
                    var statusText = response.statusText;

                    var Estado = response.data.Estado;

                    if (!Estado) {
                        var Mensaje = response.data.Mensaje;
                        $log.info('Se produjo el siguiente error en el método ObtenerDepartamentos = ' + Mensaje);
                        $scope.MostrarDialogoError('Se produjo un error al intentar obtener la lista de Departamentos');
                    }
                    else {
                        $scope.ListaDepartamentos = response.data.ListaDepartamentos;
                    }
                })
                .catch(function (response) {
                    $log.error(response);
                    $scope.MostrarDialogoError('Se produjo una excepción al intentar obtener la lista de Departamentos');
                })
                .finally(function () {
                    $log.info('Método ObtenerDepartamentos() finalizado');
                });
        };
        $scope.ObtenerLineas = function () {
            return LineaService.ObtenerLineasPorDepartamento($scope.Parametros.IndiceDepartamento)
                .then(function (response) {
                    var Estado = response.data.Estado;
                    if (!Estado) {
                        var Mensaje = response.data.Mensaje;
                        $log.info('Se produjo el siguiente error en el método ObtenerLineas = ' + Mensaje);
                        $scope.MostrarDialogoError('Se produjo un error al intentar obtener la lista de Lineas');
                    }
                    else {
                        var ListaLineas = response.data.ListaLineas;
                        $scope.ListaLineas = ListaLineas;
                    }
                },
                    function (response) {
                        $log.info('Hubo un error: Estatus = ' + response.status + ', Error = ' + response.data);
                    })
                .catch(function (response) {
                    $log.info(response);
                    $scope.MostrarDialogoError('Se produjo una excepción al intentar obtener la lista de Lineas');
                    throw response;
                })
                .finally(function () {
                    $log.info('Método ObtenerLineas() finalizado');
                });
        };
        $scope.ObtenerProcesos = function () {
            return ProcesoService.ObtenerProcesosPorLinea($scope.Parametros.IndiceLinea)
                .then(function (response) {
                    var Estado = response.data.Estado;
                    if (!Estado) {
                        var Mensaje = response.data.Mensaje;
                        $log.info('Se produjo el siguiente error en el método ObtenerProcesos = ' + Mensaje);
                        $scope.MostrarDialogoError('Se produjo un error al intentar obtener la lista de Procesos');
                    }
                    else {
                        var ListaProcesos = response.data.ListaProcesos;
                        $scope.ListaProcesos = ListaProcesos;
                    }
                },
                    function (response) {
                        $log.info('Hubo un error: Estatus = ' + response.status + ', Error = ' + response.data);
                    })
                .catch(function (response) {
                    $scope.MostrarDialogoError('Se produjo una excepción al intentar obtener la lista de Procesos');
                    $log.info(response);
                    throw response;
                })
                .finally(function () {
                    $log.info('Método ObtenerProcesos() finalizado');
                });
        };
        $scope.ObtenerUltimoIndicadorTiempo = function () {
            return IndicadorTiempoService.ObtenerUltimoIndicadorTiempo($scope.Parametros.IndiceProceso)
                .then(function (response) {
                    $log.info(response);
                    var Estado = response.data.Estado;

                    if (!Estado) {
                        var Mensaje = response.data.Mensaje;
                        $log.info('Se produjo el siguiente error en el método ObtenerUltimoIndicadorTiempo() = ' + Mensaje);
                        $scope.MostrarDialogoError('Se produjo un error al intentar obtener el último indicador de tiempo');
                    }
                    else {

                        var Existe = response.data.Existe;
                        if (!Existe)
                            return;

                        var Fecha = new Date(response.data.Fecha);
                        ActualizarFecha(angular.copy(Fecha));

                        $scope.Tiempo.IndicadorTiempoAnterior = angular.copy(Fecha);

                        var FechaLimite = ValidarFechaFinSemana(Fecha);

                        if (!FechaLimite) {
                            $scope.Tiempo.FechaLimite = angular.copy(Fecha);
                            // Se busca el paro motivo "Fin de semana".
                            var indice = -1;
                            $scope.ListaParosMotivo.some(function (obj, i) {
                                return obj.Nombre === "Fin de semana" ? indice = i : false;
                            });

                            // Si el indice es mayor a -1, se deshabilita "Fin de semana".
                            if (indice > -1) {
                                $scope.ListaParosMotivo[indice].EstaDeshabiltiado = true;
                            }
                        }
                        else {
                            $scope.Tiempo.FechaLimite = angular.copy(FechaLimite);
                        }
                    }
                },
                    function (response) {
                        $log.info('Hubo un error: Estatus = ' + response.status + ', Error = ' + response.data);
                    })
                .catch(function (response) {
                    $scope.MostrarDialogoError('Se produjo una excepción al intentar obtener el último indicador de tiempo');
                    $log.info(response);
                    throw response;
                })
                .finally(function () {
                    $log.info('Método ObtenerUltimoIndicadorTiempo() finalizado');
                });
        };
        $scope.ActualizarIndicadorTiempo = function () {
            var Model = {
                'IndiceProceso': $scope.Parametros.IndiceProceso,
                'IndiceMotivo': $scope.Parametros.IndiceMotivo,
                'FechaActual': $scope.Tiempo.IndicadorTiempoAnterior.toISOString(),
                'FechaActualizada': $scope.Tiempo.IndicadorTiempoActual.toISOString()
            };
            $log.info(Model);
            $log.info($scope.Tiempo);

            ModalService.showWait();
            return IndicadorTiempoService.ActualizarIndicadorTiempo($scope.Parametros.IndiceProceso, Model)
                .then(function (response) {
                    var GuardadoExitoso = response.data.GuardadoExitoso;

                    if (!GuardadoExitoso) {
                        var Mensaje = response.data.Mensaje;
                        $log.info('Se produjo el siguiente error en el método ActualizarIndicadorTiempo() = ' + Mensaje);
                        $scope.MostrarDialogoError('Se produjo un error al intentar actualizar el indicador de tiempo');
                    }
                    else {
                        ModalService.hideWait();
                        $scope.InicializarFormulario();

                        $mdDialog.show(
                            $mdDialog.alert()
                                .parent(angular.element(document.querySelector('body')))
                                .clickOutsideToClose(false)
                                .title('¡Indicador de tiempo actualizado!')
                                .textContent('Se actualizó el indicador de tiempo del proceso')
                                .ariaLabel('Guardado')
                                .ok('Aceptar'));


                    }
                })
                .catch(function (response) {
                    ModalService.hideWait();
                    $log.error('Excepcion: ', response.data);
                    $log.error(response);
                })
                .finally(function () {
                    $log.info('Método ActualizarIndicadorTiempo() finalizado');
                });
        };
        // #endregion
        // #region Local Methods
        $scope.MostrarDialogoError = function (Mensaje) {
            $mdDialog.show(
                $mdDialog.alert()
                    .parent(angular.element(document.querySelector('body')))
                    .clickOutsideToClose(false)
                    .title('Ha ocurrido un problema')
                    .textContent(Mensaje)
                    .ariaLabel('Error')
                    .ok('Aceptar')
            );
        };
        $scope.ValidarHora = function (Hora) {
            if (!$scope.Tiempo.IndicadorTiempoAnterior)
                return;
            var FechaAnterior = angular.copy($scope.Tiempo.IndicadorTiempoAnterior);
            var FechaActualizada = angular.copy($scope.Tiempo.IndicadorTiempoActual);
            var FechaLimite = angular.copy($scope.Tiempo.FechaLimite);
            var HoraLimiteAnterior = FechaAnterior.getHours();
            var HoraLimiteFinal = FechaLimite.getHours();

            var FechaAnteriorSinHoras = new Date(FechaAnterior.getFullYear(), FechaAnterior.getMonth(), FechaAnterior.getDate());
            var FechaActualizadaSinHoras = new Date(FechaActualizada.getFullYear(), FechaActualizada.getMonth(), FechaActualizada.getDate());
            var FechaLimiteSinHoras = new Date(FechaLimite.getFullYear(), FechaLimite.getMonth(), FechaLimite.getDate());

            // Si la fecha actual es igual a la fecha límite
            if (FechaLimiteSinHoras.getTime() === FechaActualizadaSinHoras.getTime() && Hora > HoraLimiteFinal)
                return true;

            if (FechaAnteriorSinHoras.getTime() < FechaActualizadaSinHoras.getTime())
                return false;

            if (HoraLimiteAnterior > Hora)
                return true;
            return false;
        };
        $scope.ValidarMinuto = function (Minuto) {
            if (!$scope.Tiempo.IndicadorTiempoAnterior)
                return;
            var FechaAnterior = angular.copy($scope.Tiempo.IndicadorTiempoAnterior);
            var FechaActualizada = angular.copy($scope.Tiempo.IndicadorTiempoActual);
            var FechaLimite = angular.copy($scope.Tiempo.FechaLimite);

            var HoraLimiteAnterior = FechaAnterior.getHours();
            var HoraActual = FechaActualizada.getHours();

            var MinutoLimite = FechaAnterior.getMinutes();
            var MinutoLimiteFinal = FechaLimite.getHours();

            var FechaAnteriorSinHoras = new Date(FechaAnterior.getFullYear(), FechaAnterior.getMonth(), FechaAnterior.getDate());
            var FechaActualizadaSinHoras = new Date(FechaActualizada.getFullYear(), FechaActualizada.getMonth(), FechaActualizada.getDate());
            var FechaLimiteSinHoras = new Date(FechaLimite.getFullYear(), FechaLimite.getMonth(), FechaLimite.getDate());

            // Si la fecha actual es igual a la fecha límite
            if (FechaActualizadaSinHoras.getTime() === FechaLimiteSinHoras.getTime()
                && Minuto > MinutoLimiteFinal) {
                //$log.info('Caso #1');
                return true;
            }

            // Si la fecha actual es igual a la fecha mínima
            if (FechaActualizadaSinHoras.getTime() === FechaAnteriorSinHoras.getTime()
                && HoraActual === HoraLimiteAnterior
                && Minuto < MinutoLimite) {
                //$log.info('Caso #2');
                return true;
            }

            if (FechaActualizadaSinHoras.getTime() === FechaAnteriorSinHoras.getTime()
                && HoraActual > HoraLimiteAnterior) {
                //$log.info('Caso #3');
                return false;
            }

            // Si la fecha nueva es mayor que la fecha minima, todos los minutos se habilitan
            if (FechaActualizadaSinHoras.getTime() > FechaAnteriorSinHoras.getTime()) {
                //$log.info('Caso #4');
                return false;
            }

            // Si el minuto actual es mayor que el minuto minimo, y sus horas son iguales
            //    45              55             20             20
            if (MinutoLimiteFinal > Minuto & HoraLimiteAnterior === HoraActual) {
                //$log.info('Caso #5');
                return true;
            }

            //$log.info('Caso #6');
            return false;
        };
        $scope.ActualizarTiempo = function () {
            ActualizarHoras();
            ActualizarMinutos();
        };
        $scope.InicializarFormulario = function () {
            $scope.Parametros.IndiceCentro = null;
            $scope.Parametros.IndiceDepartamento = null;
            $scope.Parametros.IndiceLinea = null;
            $scope.Parametros.IndiceProceso = null;
            $scope.Parametros.IndiceMotivo = null;

            $scope.Tiempo.IndicadorTiempoAnterior = null;
            $scope.Tiempo.IndicadorTiempoActual = null;
            $scope.Tiempo.FechaLimite = null;
            $scope.Tiempo.Hora = null;
            $scope.Tiempo.Minuto = null;

            var indice = -1;
            $scope.ListaParosMotivo.some(function (obj, i) {
                return obj.Nombre === "Fin de semana" ? indice = i : false;
            });

            // Si el indice es mayor a -1, se deshabilita "Fin de semana".
            if (indice > -1) {
                $scope.ListaParosMotivo[indice].EstaDeshabiltiado = false;
            }
        };
        function ActualizarMinutos(Hora) {
            var FechaAnterior = angular.copy($scope.Tiempo.IndicadorTiempoAnterior);
            var FechaActualizada = angular.copy($scope.Tiempo.IndicadorTiempoActual);
            var FechaAnteriorSinHoras = FechaAnterior ? new Date(FechaAnterior.getFullYear(), FechaAnterior.getMonth(), FechaAnterior.getDate()) : null;
            var FechaActualizadaSinHoras = FechaActualizada ? new Date(FechaActualizada.getFullYear(), FechaActualizada.getMonth(), FechaActualizada.getDate()) : null;

            var HoraLimite = FechaAnterior ? FechaAnterior.getHours() : null;
            //var HoraActual = FechaActualizada.getHours();

            var MinutoLimite = FechaAnterior ? FechaAnterior.getMinutes() : null;
            //var MinutoActual = FechaActualizada.getMinutes();

            if (FechaAnteriorSinHoras && FechaActualizadaSinHoras && FechaAnteriorSinHoras.getTime() === FechaActualizadaSinHoras.getTime() && Hora === HoraLimite) {
                $scope.Tiempo.Minuto = MinutoLimite;
                $scope.Tiempo.IndicadorTiempoActual.setMinutes(MinutoLimite);
            }
            else {
                $scope.Tiempo.Minuto = 0;
                $scope.Tiempo.IndicadorTiempoActual.setMinutes(0);
            }
        }
        function ActualizarHoras() {
            var FechaAnterior = angular.copy($scope.Tiempo.IndicadorTiempoAnterior);

            var FechaActualizada = angular.copy($scope.Tiempo.IndicadorTiempoActual);
            var FechaAnteriorSinHoras = FechaAnterior ? new Date(FechaAnterior.getFullYear(), FechaAnterior.getMonth(), FechaAnterior.getDate()) : null;
            var FechaActualizadaSinHoras = FechaActualizada ? new Date(FechaActualizada.getFullYear(), FechaActualizada.getMonth(), FechaActualizada.getDate()) : null;

            var HoraLimite = FechaAnterior ? FechaAnterior.getHours() : null;
            var HoraActual = FechaActualizada ? FechaActualizada.getHours() : null;

            if (FechaAnteriorSinHoras && FechaActualizadaSinHoras && FechaAnteriorSinHoras.getTime() === FechaActualizadaSinHoras.getTime()) {
                $scope.Tiempo.Hora = HoraLimite;
                $scope.Tiempo.IndicadorTiempoActual.setHours(HoraLimite);
            }
            else {
                $scope.Tiempo.Hora = 0;
                $scope.Tiempo.IndicadorTiempoActual.setHours(0);
            }
        }
        function InicializarParametroFechas() {
            $scope.Tiempo.IndicadorTiempoAnterior = null;
            $scope.Tiempo.IndicadorTiempoActual = null;
            $scope.Tiempo.FechaLimite = null;
            $scope.Tiempo.Hora = null;
            $scope.Tiempo.Minuto = null;
        }
        /**
         * @desc Actualiza la fecha límite ($scope.Tiempo.FechaLimite) de acuerdo al tipo de motivo escogido.
         * @param {string} IndiceMotivo El nombre del paro "motivo" escogido.
         */
        function ValidarMotivo(IndiceMotivo) {
            var FechaLimiteInferior = angular.copy($scope.Tiempo.IndicadorTiempoAnterior);
            if (!FechaLimiteInferior)
                return;

            $scope.Tiempo.FechaLimite = null;
            
            ActualizarFecha(angular.copy(FechaLimiteInferior));

            switch (IndiceMotivo) {
                case 'Fin de semana':
                    // Ya está definido en el método ValidarFechaFinSemana()
                    FechaLimiteInferior = ValidarFechaFinSemana(FechaLimiteInferior);
                    break;
                case 'Día Festivo':
                    FechaLimiteInferior.setDate(FechaLimiteInferior.getDate() + 1);
                    break;
                default:
                    FechaLimiteInferior.setDate(FechaLimiteInferior.getDate() + 7);
                    break;
            }

            $scope.Tiempo.FechaLimite = FechaLimiteInferior;
        }
        /**
         * @desc Valida si la fecha es viernes, sábado o domingo.
         * @param {Date} Fecha La fecha a validar.
         * @returns {Date} La fecha máxima de acuerdo al día que se validó
         */
        function ValidarFechaFinSemana(Fecha) {
            var FechaLimite = null;
            //$log.error('Entró = ' + $scope.Tiempo.FechaLimite);
            $log.error('Entró = ' + Fecha);
            var FechaActual = angular.copy(Fecha);
            var FechaDiaSiguiente = angular.copy(Fecha);
            FechaDiaSiguiente.setDate(FechaDiaSiguiente.getDate() + 1);

            var DiaActual = FechaActual.getDay();
            var DiaSiguiente = FechaDiaSiguiente.getDay();

            if (DiaActual === 5 && DiaSiguiente === 6) { // Si el día actual es viernes
                FechaLimite = new Date(FechaActual.getFullYear(), FechaActual.getMonth(), FechaActual.getDate(), '00', '00', '00');
                FechaLimite.setDate(FechaLimite.getDate() + 3);
                //$scope.Tiempo.FechaLimite = FechaLimite;
            }
            else if (DiaActual === 6 && DiaSiguiente === 0) { // Si el día actual es sábado
                FechaLimite = new Date(FechaActual.getFullYear(), FechaActual.getMonth(), FechaActual.getDate(), '00', '00', '00');
                FechaLimite.setDate(FechaLimite.getDate() + 2);
                //$scope.Tiempo.FechaLimite = FechaLimite;
            }
            else if (DiaActual === 0 && DiaSiguiente === 1) { // Si el día actual es domingo
                FechaLimite = new Date(FechaActual.getFullYear(), FechaActual.getMonth(), FechaActual.getDate(), '00', '00', '00');
                FechaLimite.setDate(FechaLimite.getDate() + 1);
                //$scope.Tiempo.FechaLimite = FechaLimite;
            }

            //$log.error('Salió = ' + $scope.Tiempo.FechaLimite);
            return FechaLimite;
        }
        function ActualizarFecha(Fecha) {
            $scope.Tiempo.IndicadorTiempoActual = angular.copy(Fecha);
            $scope.Tiempo.Hora = angular.copy(Fecha.getHours());
            $scope.Tiempo.Minuto = angular.copy(Fecha.getMinutes());
        }
        // #endregion
        // #region Watchs
        $scope.$watch('Parametros.IndiceCentro', function (newValue, oldValue) {
            if (newValue) {
                $scope.Parametros.IndiceDepartamento = null;
                $scope.Parametros.IndiceLinea = null;
                $scope.Parametros.IndiceProceso = null;
                $scope.Parametros.IndiceMotivo = null;
                InicializarParametroFechas();

                $scope.ListaDepartamentos = null;
            }
        });
        $scope.$watch('Parametros.IndiceDepartamento', function (newValue, oldValue) {
            if (newValue) {
                $scope.Parametros.IndiceLinea = null;
                $scope.Parametros.IndiceProceso = null;
                $scope.Parametros.IndiceMotivo = null;
                InicializarParametroFechas();

                $scope.ListaLineas = null;
            }
        });
        $scope.$watch('Parametros.IndiceLinea', function (newValue, oldValue) {
            if (newValue) {
                $scope.Parametros.IndiceProceso = null;
                $scope.Parametros.IndiceMotivo = null;
                InicializarParametroFechas();

                $scope.ListaProcesos = null;
            }
        });
        $scope.$watch('Parametros.IndiceProceso', function (newValue, oldValue) {
            if (newValue) {
                $scope.Parametros.IndiceMotivo = null;
                InicializarParametroFechas();
                //$("#motivoContenedor").fadeIn(2000, function () {
                //    // Animation complete.
                //});

                //await ObtenerUltimoIndicadorTiempo();

                $("#tiempoContenedor").fadeIn(1000, function () {
                    // Animation complete.
                });
            }
        });
        $scope.$watch('Parametros.IndiceMotivo', function (newValue, oldValue) {
            if (newValue) {
                //$scope.Tiempo.IndicadorTiempoActual = angular.copy($scope.Tiempo.IndicadorTiempoAnterior);

                //if (newValue === 'Fin de semana') {
                //    $scope.Tiempo.Hora = 23;
                //    $scope.Tiempo.Minuto = 59;
                //}
                //else
                //{
                //    var FechaAnterior = angular.copy($scope.Tiempo.IndicadorTiempoAnterior);
                //    var FechaActualizada = angular.copy($scope.Tiempo.IndicadorTiempoActual);
                //    var FechaAnteriorSinHoras = new Date(FechaAnterior.getFullYear(), FechaAnterior.getMonth(), FechaAnterior.getDate());
                //    var FechaActualizadaSinHoras = new Date(FechaActualizada.getFullYear(), FechaActualizada.getMonth(), FechaActualizada.getDate());

                //    if (FechaAnteriorSinHoras.getTime() === FechaActualizadaSinHoras.getTime()) {
                //        $scope.Tiempo.Hora = angular.copy($scope.Tiempo.IndicadorTiempoAnterior.getHours());
                //        $scope.Tiempo.Minuto = angular.copy($scope.Tiempo.IndicadorTiempoAnterior.getMinutes());
                //    }
                //    else {
                //        $scope.Tiempo.Hora = 0;
                //        $scope.Tiempo.Minuto = 0;
                //    }
                //}

                ValidarMotivo(newValue);
            }
        });
        $scope.$watch('Tiempo.IndicadorTiempoActual', function (newValue, oldValue) {
            if (newValue) {
                //var FechaAnterior = angular.copy($scope.Tiempo.IndicadorTiempoAnterior);
                //var FechaActualizada = angular.copy(newValue);
                //var FechaAnteriorSinHoras = new Date(FechaAnterior.getFullYear(), FechaAnterior.getMonth(), FechaAnterior.getDate());
                //var FechaActualizadaSinHoras = new Date(FechaActualizada.getFullYear(), FechaActualizada.getMonth(), FechaActualizada.getDate());

                //if (FechaAnteriorSinHoras.getTime() === FechaActualizadaSinHoras.getTime()) {
                //    $scope.Tiempo.Hora = angular.copy(FechaAnterior.getHours());
                //    $scope.Tiempo.Minuto = angular.copy(FechaAnterior.getMinutes());
                //}
                //else {
                //    $scope.Tiempo.Hora = 0;
                //    $scope.Tiempo.Minuto = 0;
                //}
                ////if ($scope.Parametros.IndiceMotivo === 'Fin de semana') {
                ////    $scope.Tiempo.Hora = 23;
                ////    $scope.Tiempo.Minuto = 59;
                ////}
            }
        });
        $scope.$watch('Tiempo.Hora', function (newValue, oldValue) {
            if (newValue) {
                $scope.Tiempo.IndicadorTiempoActual.setHours(newValue);
                ActualizarMinutos(newValue);
            }
        });
        $scope.$watch('Tiempo.Minuto', function (newValue, oldValue) {
            if (newValue) {
                $log.info('Tiempo.Minuto: ' + $scope.Tiempo.IndicadorTiempoActual);
                $scope.Tiempo.IndicadorTiempoActual.setMinutes(newValue);
            }
        });
        $scope.$watch('ListaCentros', function (newValue, oldValue) {
            if (newValue) {
                if (!newValue)
                    return;

                var ListaCentros = newValue;

                $scope.Parametros.IndiceCentro =
                    ListaCentros.length === 1 ? ListaCentros[0].Indice : null;

                if (ListaCentros.length === 1) {
                    $scope.ObtenerDepartamentos();
                    //var PromiseDepartamento = DepartamentoService.ObtenerDepartamentosPorCentro($scope.Parametros.IndiceCentro);
                    //Promise.all([PromiseDepartamento]);
                }

            }
        });
        $scope.$watch('ListaDepartamentos', function (newValue, oldValue) {
            if (newValue) {
                if (!newValue)
                    return;

                var ListaDepartamentos = newValue;

                $scope.Parametros.IndiceDepartamento =
                    ListaDepartamentos.length === 1 ? ListaDepartamentos[0].Indice : null;

                if (ListaDepartamentos.length === 1) {
                    $scope.ObtenerLineas();
                    //var PromiseLineas = LineaService.ObtenerLineasPorDepartamento($scope.Parametros.IndiceDepartamento);
                    //Promise.all([PromiseLineas]);
                }

            }
        });
        $scope.$watch('ListaLineas', function (newValue, oldValue) {
            if (newValue) {
                if (!newValue)
                    return;

                var ListaLineas = newValue;

                $scope.Parametros.IndiceLinea =
                    ListaLineas.length === 1 ? ListaLineas[0].Indice : null;

                if (ListaLineas.length === 1) {
                    $scope.ObtenerProcesos();
                    //var PromiseProcesos = ProcesoService.ObtenerProcesosPorLinea($scope.Parametros.IndiceLinea);
                    //Promise.all([PromiseProcesos]);
                }
            }
        });
        $scope.$watch('ListaProcesos', function (newValue, oldValue) {
            if (newValue) {
                if (!newValue)
                    return;

                var ListaProcesos = newValue;

                $scope.Parametros.IndiceProceso =
                    ListaProcesos.length === 1 ? ListaProcesos[0].Indice : null;

                if (ListaProcesos.length === 1) {
                    $scope.ObtenerUltimoIndicadorTiempo();
                    //var PromiseProcesos = IndicadorTiempoService.ObtenerUltimoIndicadorTiempo($scope.Parametros.IndiceProceso);
                    //Promise.all([PromiseProcesos]);
                }
            }
        });
        // #endregion
    }
})();