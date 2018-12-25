namespace IndicadoresOEE.Domain.Business
{
    using IndicadoresOEE.Common.Models;
    using System;
    using System.Collections.Generic;
    using System.Data.Entity;
    using System.Linq;
    using System.Linq.Expressions;
    using Util;

    public class IndicadorBusiness
    {
        private readonly PrimaryConnection db;
        private readonly IndicadorTiempoBusiness IndicadorTiempoBusiness;
        private readonly ProcesoBusiness ProcesoBusiness;
        private readonly ParoBusiness ParoBusiness;
        private readonly RechazoBusiness RechazoBusiness;

        public IndicadorBusiness()
        {
            db = new PrimaryConnection();
            IndicadorTiempoBusiness = new IndicadorTiempoBusiness();
            ProcesoBusiness = new ProcesoBusiness();
            ParoBusiness = new ParoBusiness();
            RechazoBusiness = new RechazoBusiness();
        }

        public long CrearIndicador(IndicadorModel modelo)
        {
            long IndiceIndicador = 0;

            var FechaInicial = modelo.Fecha;
            var FechaFinal = FechaInicial.AddMinutes(modelo.Ciclo);

            bool ExisteIndicadorPeriodoTiempo = BusquedaIndicadoresPeriodo(modelo.IndiceProceso, FechaInicial, FechaFinal);

            if (ExisteIndicadorPeriodoTiempo)
            {
                IndiceIndicador = -1;
            }
            else
            {
                Indicador_V2 Indicador = new Indicador_V2
                {
                    IndiceVelocidad = modelo.IndiceVelocidad,
                    IndiceProceso = modelo.IndiceProceso,
                    Orden = modelo.Orden,
                    Lote = modelo.Lote,
                    Maquina = "" + modelo.Piezas,
                    Material = modelo.Material,
                    Descripcion = modelo.DescripcionMaterial,
                    Reales = modelo.Reales,
                    Fecha = modelo.Fecha,
                    Turno = modelo.Turno,
                    Ciclo = "" + modelo.Ciclo
                };

                db.Indicador_V2.Add(Indicador);
                db.SaveChanges();

                IndiceIndicador = Indicador.Indice;
            }

            return IndiceIndicador;
        }

        public void AgregarEntradaMovimientoIndicador(long IndiceUsuario, long IndiceIndicador, int IndiceMovimiento)
        {
            BitacoraIndicador bitacoraIndicador = new BitacoraIndicador()
            {
                IndiceUsuario = IndiceUsuario,
                IndiceIndicador = IndiceIndicador,
                IndiceMovimiento = IndiceMovimiento,
                Fecha = DateTime.Now
            };

            db.BitacoraIndicador.Add(bitacoraIndicador);
            db.SaveChanges();
        }

        public void ActualizarIndicadorTiempo(long IndiceProceso, DateTime Fecha, int Ciclo)
        {
            DateTime FechaActualizada = Fecha.AddMinutes(Ciclo);

            IndicadorTiempo_V2 IndicadorTiempo = db.IndicadorTiempo_V2
                .Where(c => c.IndiceProceso == IndiceProceso)
                .FirstOrDefault();

            if (IndicadorTiempo == null)
            {
                Indicador_Tiempo IndicadorTiempoV1 = db.Indicador_Tiempo.Where(c => c.id_proceso == IndiceProceso).FirstOrDefault();

                if (IndicadorTiempoV1 != null)
                {
                    // Si el indicador sólo existe en V1, se convierte a objeto V2
                    DateTime? FechaActualIndicadorTiempo = IndicadorTiempoV1.fecha_hora;
                    if (FechaActualIndicadorTiempo == null)
                        FechaActualIndicadorTiempo = FechaActualizada;
                    else if (FechaActualIndicadorTiempo.GetValueOrDefault() < FechaActualizada)
                        FechaActualIndicadorTiempo = FechaActualizada;

                    IndicadorTiempo = new IndicadorTiempo_V2()
                    {
                        IndiceProceso = IndiceProceso,
                        Fecha = FechaActualIndicadorTiempo.GetValueOrDefault()
                    };

                    db.IndicadorTiempo_V2.Add(IndicadorTiempo);
                    db.SaveChanges();
                }
                else
                {
                    // No existe ni en V1 y V2 un indicador de tiempo, por lo que se crea
                    IndicadorTiempo = new IndicadorTiempo_V2()
                    {
                        IndiceProceso = IndiceProceso,
                        Fecha = FechaActualizada
                    };

                    db.IndicadorTiempo_V2.Add(IndicadorTiempo);
                    db.SaveChanges();
                }
            }
            else
            {
                if (IndicadorTiempo.Fecha.GetValueOrDefault() < FechaActualizada)
                {
                    IndicadorTiempo.Fecha = FechaActualizada;
                    db.SaveChanges();
                }
            }
        }

        public bool BusquedaIndicadoresPeriodo(long IndiceProceso, DateTime FechaInicial, DateTime FechaFinal)
        {
            bool Existe = db.Indicador_V2.Any(c => c.IndiceProceso == IndiceProceso && c.Fecha >= FechaInicial && c.Fecha <= FechaFinal);
            if(!Existe)
                Existe = db.Indicador.Any(c => c.id_proceso == IndiceProceso && c.fecha_hora >= FechaInicial && c.fecha_hora <= FechaFinal);
            return Existe;
        }
        

        public IndicadorModel ValidarOrden(string Orden)
        {
            IndicadorModel indicador = null;

            return indicador;
        }
        
        public IndicadorModel ObtenerIndicadorPorProceso(long IndiceProceso)
        {
            IndicadorModel indicador = null;

            Indicador_V2 IndicadorV2 = null;
            Indicador IndicadorV1 = null;

            IndicadorV2 = db.Indicador_V2
                .Where(columna => columna.IndiceProceso == IndiceProceso)
                .OrderByDescending(columna => columna.Fecha)
                .FirstOrDefault();

            if (IndicadorV2 == null)
            {
                IndicadorV1 = db.Indicador
                .Where(columna => columna.id_proceso == IndiceProceso)
                .OrderByDescending(columna => columna.fecha_hora)
                .FirstOrDefault();

                if (IndicadorV1 != null)
                {
                    indicador = new IndicadorModel()
                    {
                        Indice = IndicadorV1.id_indicador,
                        Orden = IndicadorV1.orden,
                        Lote = IndicadorV1.lote,
                        Material = IndicadorV1.material,
                        DescripcionMaterial = IndicadorV1.descripcion,
                        IndiceVelocidad = 0,
                        Velocidad = string.Empty,
                        Dia = IndicadorV1.fecha_hora.GetValueOrDefault().Day,
                        Mes = IndicadorV1.fecha_hora.GetValueOrDefault().Month,
                        Año = IndicadorV1.fecha_hora.GetValueOrDefault().Year,
                        Hora = IndicadorV1.fecha_hora.GetValueOrDefault().Hour,
                        Minuto = IndicadorV1.fecha_hora.GetValueOrDefault().Minute,
                        Turno = IndicadorV1.turno,
                        Ciclo = Convert.ToInt32(IndicadorV1.ciclo)
                    };
                }
                else
                {
                    DateTime Fecha = DateTime.Now;
                    indicador = new IndicadorModel()
                    {
                        Indice = 0,
                        Orden = string.Empty,
                        Lote = string.Empty,
                        Material = string.Empty,
                        DescripcionMaterial = string.Empty,
                        IndiceVelocidad = 0,
                        Velocidad = string.Empty,
                        Dia = Fecha.Day,
                        Mes = Fecha.Month,
                        Año = Fecha.Year,
                        Hora = 0,
                        Minuto = 0,
                        Turno = string.Empty,
                        Ciclo = 0
                    };
                }
            }
            else
            {
                indicador = new IndicadorModel()
                {
                    Indice = IndicadorV2.Indice,
                    Orden = IndicadorV2.Orden,
                    Lote = IndicadorV2.Lote,
                    Material = IndicadorV2.Material,
                    DescripcionMaterial = IndicadorV2.Descripcion,
                    IndiceVelocidad = IndicadorV2.IndiceVelocidad.GetValueOrDefault(),
                    Velocidad = string.Empty,
                    Dia = IndicadorV2.Fecha.GetValueOrDefault().Day,
                    Mes = IndicadorV2.Fecha.GetValueOrDefault().Month,
                    Año = IndicadorV2.Fecha.GetValueOrDefault().Year,
                    Hora = IndicadorV2.Fecha.GetValueOrDefault().Hour,
                    Minuto = IndicadorV2.Fecha.GetValueOrDefault().Minute,
                    Turno = IndicadorV2.Turno,
                    Ciclo = Convert.ToInt32(IndicadorV2.Ciclo)
                };
            }

            return indicador;
        }
        
        /// <summary>
        /// 
        /// </summary>
        /// <param name="Indice"></param>
        /// <returns></returns>
        public IndicadorModel ObtenerIndicador(long Indice, bool EsHistorico)
        {
            IndicadorModel DatosIndicador = null;

            if (EsHistorico)
            {
                Indicador IndicadorV1 = db.Indicador.Find(Indice);

                if (IndicadorV1 != null)
                    DatosIndicador = Util.ConvertirObjetoIndicadorAModeloHistorico(IndicadorV1, 0, 0, 0, 0);
                else
                    return null;
            }
            else
            {
                Indicador_V2 IndicadorV2 = db.Indicador_V2.Find(Indice);

                if (IndicadorV2 != null)
                    DatosIndicador = Util.ConvertirObjetoIndicadorAModelo(IndicadorV2, 0, 0, 0, 0);
                else
                    return null;
            }

            return DatosIndicador;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="IndiceUsuario"></param>
        /// <param name="IndiceCentro"></param>
        /// <param name="IndiceDepartamento"></param>
        /// <param name="IndiceLinea"></param>
        /// <param name="IndiceProceso"></param>
        /// <param name="IndiceVelocidad"></param>
        /// <param name="Desde"></param>
        /// <param name="Hasta"></param>
        /// <returns></returns>
        public List<IndicadorModel> ObtenerIndicadores(long IndiceUsuario, long IndiceCentro, long IndiceDepartamento, long IndiceLinea, long IndiceProceso, long IndiceVelocidad, string Desde, string Hasta)
        {
            List<IndicadorModel> ListaIndicadores = null;

            // Validación de fechas

            DateTime FechaInicial = new DateTime();
            DateTime FechaFinal = new DateTime();

            bool EsFechaInicialValida = DateTime.TryParse(Desde, out FechaInicial);
            bool EsFechaFinalValida = DateTime.TryParse(Desde, out FechaFinal);

            if (!EsFechaInicialValida || !EsFechaFinalValida)
                return null;

            FechaFinal = FechaFinal.AddHours(23).AddMinutes(59).AddSeconds(59);

            // Construcción de la consulta
            Expression<Func<Indicador_V2, bool>> Predicado1 = columna => columna.Fecha >= FechaInicial;
            Expression<Func<Indicador_V2, bool>> Predicado2 = columna => columna.Fecha <= FechaFinal;
            Expression<Func<Indicador_V2, bool>> Predicado3 = null;
            Expression<Func<Indicador_V2, bool>> Predicado4 = null;


            if (IndiceVelocidad > 0)
                Predicado3 = columna => columna.IndiceVelocidad == IndiceVelocidad;
            else
            {
                List<long> ListaProcesos = ProcesoBusiness.ObtenerProcesosPorUsuario(IndiceUsuario, IndiceProceso, IndiceLinea, IndiceDepartamento, IndiceCentro);
                Predicado4 = columna => ListaProcesos.Contains(columna.IndiceProceso ?? 0);
            }

            IQueryable<Indicador_V2> query = db.Indicador_V2.Where(Predicado1).Where(Predicado2);

            if (Predicado3 != null)
                query = db.Indicador_V2.Where(Predicado3);
            else if (Predicado4 != null)
                query = db.Indicador_V2.Where(Predicado4);

            List<Indicador_V2> ListaResultadosSinProcesar = query.ToList();
            ListaIndicadores = Util.ConvertirObjetoIndicadorAListaModelo(ListaResultadosSinProcesar, IndiceCentro, IndiceDepartamento, IndiceLinea, IndiceProceso);

            return ListaIndicadores;
        }

        ///// <summary>
        ///// 
        ///// </summary>
        ///// <param name="DatosIndicador"></param>
        ///// <returns></returns>
        //public bool InsertarIndicador(IndicadorModel DatosIndicador)
        //{
        //    bool Estado = false;

        //    try
        //    {
        //        Indicador_V2 IndicadorBD = new Indicador_V2()
        //        {
        //            Fecha = DatosIndicador.Fecha,
        //            Orden = DatosIndicador.Orden,
        //            Lote = DatosIndicador.Lote,
        //            Maquina = DatosIndicador.Piezas.ToString(),
        //            Reales = DatosIndicador.Reales,
        //            Ciclo = DatosIndicador.Ciclo.ToString(),
        //            Turno = string.IsNullOrEmpty(DatosIndicador.Turno) ? null : DatosIndicador.Turno,
        //            Material = string.IsNullOrEmpty(DatosIndicador.Material) ? null : DatosIndicador.Material,
        //            Descripcion = string.IsNullOrEmpty(DatosIndicador.DescripcionMaterial) ? null : DatosIndicador.DescripcionMaterial,
        //            IndiceVelocidad = DatosIndicador.IndiceVelocidad > 0 ? (long?)null : DatosIndicador.IndiceVelocidad,
        //            IndiceProceso = DatosIndicador.IndiceProceso
        //        };

        //        foreach (RechazoModel Rechazo in DatosIndicador.Rechazos)
        //        {
        //            IndicadorRechazo_V2 IndicadorRechazo = new IndicadorRechazo_V2()
        //            {
        //                IndiceRechazo = Rechazo.Indice,
        //                Cantidad = Rechazo.Cantidad
        //            };

        //            IndicadorBD.IndicadorRechazo_V2.Add(IndicadorRechazo);
        //        }

        //        foreach (ParoModel Paro in DatosIndicador.Paros)
        //        {
        //            IndicadorParo_V2 IndicadorParo = new IndicadorParo_V2()
        //            {
        //                IndiceParo = Paro.Indice,
        //                Cantidad = Paro.Cantidad,
        //                Folio = Paro.Folio,
        //                EsParoPlanificado = Paro.EsParoPlanificado
        //            };

        //            IndicadorBD.IndicadorParo_V2.Add(IndicadorParo);
        //        }

        //        db.Indicador_V2.Add(IndicadorBD);
        //        db.SaveChanges();

        //        Estado = true;

        //        bool EstadoIndicadorTiempo = IndicadorTiempoBusiness.ActualizarIndicadorTiempo(DatosIndicador.IndiceProceso, DatosIndicador.Fecha);
        //    }
        //    catch (Exception)
        //    {

        //    }

        //    return Estado;
        //}

        /// <summary>
        /// 
        /// </summary>
        /// <param name="Indice"></param>
        /// <param name="DatosIndicador"></param>
        /// <returns></returns>
        public bool EditarIndicador(long Indice, IndicadorModel DatosIndicador)
        {
            Indicador_V2 indicadorBD = db.Indicador_V2.Find(Indice);

            if (indicadorBD == null)
                return false;

            indicadorBD.Fecha = DatosIndicador.Fecha;
            indicadorBD.Orden = DatosIndicador.Orden;
            indicadorBD.Lote = DatosIndicador.Lote;
            indicadorBD.Maquina = DatosIndicador.Piezas.ToString();
            indicadorBD.Reales = DatosIndicador.Reales;
            indicadorBD.Ciclo = DatosIndicador.Ciclo.ToString();
            indicadorBD.Turno = string.IsNullOrEmpty(DatosIndicador.Turno) ? null : DatosIndicador.Turno;
            indicadorBD.Material = string.IsNullOrEmpty(DatosIndicador.Material) ? null : DatosIndicador.Material;
            indicadorBD.Descripcion = string.IsNullOrEmpty(DatosIndicador.DescripcionMaterial) ? null : DatosIndicador.DescripcionMaterial;
            indicadorBD.IndiceVelocidad = DatosIndicador.IndiceVelocidad > 0 ? (long?)null : DatosIndicador.IndiceVelocidad;
            indicadorBD.IndiceProceso = DatosIndicador.IndiceProceso;

            db.Entry(indicadorBD).State = EntityState.Modified;
            db.SaveChanges();

            return true;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="Indice"></param>
        /// <returns></returns>
        public bool EliminarIndicador(long Indice, bool EsHistorico)
        {
            if (EsHistorico)
            {
                Indicador indicadorBD = db.Indicador.Find(Indice);

                if (indicadorBD == null)
                    return false;

                db.Indicador.Remove(indicadorBD);
                db.SaveChanges();
            }
            else
            {
                Indicador_V2 indicadorBD = db.Indicador_V2.Find(Indice);

                if (indicadorBD == null)
                    return false;

                db.Indicador_V2.Remove(indicadorBD);
                db.SaveChanges();
            }

            return true;
        }
    }
}
