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

        public IndicadorBusiness()
        {
            db = new PrimaryConnection();
            IndicadorTiempoBusiness = new IndicadorTiempoBusiness();
            ProcesoBusiness = new ProcesoBusiness();
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

        /// <summary>
        /// 
        /// </summary>
        /// <param name="DatosIndicador"></param>
        /// <returns></returns>
        public bool InsertarIndicador(IndicadorModel DatosIndicador)
        {
            bool Estado = false;

            try
            {
                Indicador_V2 IndicadorBD = new Indicador_V2()
                {
                    Fecha = DatosIndicador.Fecha,
                    Orden = DatosIndicador.Orden,
                    Lote = DatosIndicador.Lote,
                    Maquina = DatosIndicador.Piezas.ToString(),
                    Reales = DatosIndicador.Reales,
                    Ciclo = DatosIndicador.Ciclo.ToString(),
                    Turno = string.IsNullOrEmpty(DatosIndicador.Turno) ? null : DatosIndicador.Turno,
                    Material = string.IsNullOrEmpty(DatosIndicador.Material) ? null : DatosIndicador.Material,
                    Descripcion = string.IsNullOrEmpty(DatosIndicador.DescripcionMaterial) ? null : DatosIndicador.DescripcionMaterial,
                    IndiceVelocidad = DatosIndicador.IndiceVelocidad > 0 ? (long?)null : DatosIndicador.IndiceVelocidad,
                    IndiceProceso = DatosIndicador.IndiceProceso
                };

                foreach (RechazoModel Rechazo in DatosIndicador.Rechazos)
                {
                    IndicadorRechazo_V2 IndicadorRechazo = new IndicadorRechazo_V2()
                    {
                        IndiceRechazo = Rechazo.Indice,
                        Cantidad = Rechazo.Cantidad
                    };

                    IndicadorBD.IndicadorRechazo_V2.Add(IndicadorRechazo);
                }

                foreach (ParoModel Paro in DatosIndicador.Paros)
                {
                    IndicadorParo_V2 IndicadorParo = new IndicadorParo_V2()
                    {
                        IndiceParo = Paro.Indice,
                        Cantidad = Paro.Cantidad,
                        Folio = Paro.Folio,
                        EsParoPlanificado = Paro.EsParoPlanificado
                    };

                    IndicadorBD.IndicadorParo_V2.Add(IndicadorParo);
                }

                db.Indicador_V2.Add(IndicadorBD);
                db.SaveChanges();

                Estado = true;

                bool EstadoIndicadorTiempo = IndicadorTiempoBusiness.ActualizarIndicadorTiempo(DatosIndicador.IndiceProceso, DatosIndicador.Fecha);
            }
            catch (Exception)
            {

            }

            return Estado;
        }

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
