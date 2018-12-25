namespace IndicadoresOEE.Domain.Util
{
    using IndicadoresOEE.Common.Models;
    using IndicadoresOEE.Domain;
    using System.Collections.Generic;
    using System.Linq;

    public static class Util
    {
        /// <summary>
        /// 
        /// </summary>
        /// <param name="indicadorBD"></param>
        /// <param name="IndiceCentro"></param>
        /// <param name="IndiceDepartamento"></param>
        /// <param name="IndiceLinea"></param>
        /// <param name="IndiceProceso"></param>
        /// <returns></returns>
        public static IndicadorModel ConvertirObjetoIndicadorAModeloHistorico(Indicador indicadorBD, long IndiceCentro, long IndiceDepartamento, long IndiceLinea, long IndiceProceso)
        {
            IndicadorModel Indicador = new IndicadorModel()
            {
                Indice = indicadorBD.id_indicador,
                IndiceCentro = IndiceCentro,
                IndiceDepartamento = IndiceDepartamento,
                IndiceLinea = IndiceLinea,
                IndiceProceso = indicadorBD.id_proceso.GetValueOrDefault(),
                Orden = indicadorBD.orden,
                Lote = indicadorBD.lote,
                Material = indicadorBD.material,
                DescripcionMaterial = indicadorBD.descripcion,
                IndiceVelocidad = 0,
                Reales = indicadorBD.reales,
                Piezas = int.Parse(string.IsNullOrEmpty(indicadorBD.maquina) ? "0" : indicadorBD.maquina),
                Fecha = indicadorBD.fecha_hora.GetValueOrDefault(),
                Hora = indicadorBD.fecha_hora.GetValueOrDefault().Hour,
                Minuto = indicadorBD.fecha_hora.GetValueOrDefault().Minute,
                Turno = indicadorBD.turno,
                Ciclo = int.Parse(string.IsNullOrEmpty(indicadorBD.ciclo) ? "0" : indicadorBD.ciclo),
                ListaParos = indicadorBD.Indicador_Paro.ToList().Select(c => new ParoModel { Indice = c.id_paro, Cantidad = int.Parse(c.cantidad.GetValueOrDefault().ToString()), Folio = c.Folio }).ToList(),
                ListaRechazos = indicadorBD.Indicador_Rechazo.ToList().Select(c => new RechazoModel { Indice = c.id_rechazo, Cantidad = int.Parse(c.cantidad.GetValueOrDefault().ToString()) }).ToList()
            };

            return Indicador;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="indicadorBD"></param>
        /// <param name="IndiceCentro"></param>
        /// <param name="IndiceDepartamento"></param>
        /// <param name="IndiceLinea"></param>
        /// <param name="IndiceProceso"></param>
        /// <returns></returns>
        public static IndicadorModel ConvertirObjetoIndicadorAModelo(Indicador_V2 indicadorBD, long IndiceCentro, long IndiceDepartamento, long IndiceLinea, long IndiceProceso)
        {
            IndicadorModel Indicador = new IndicadorModel()
            {
                Indice = indicadorBD.Indice,
                IndiceCentro = IndiceCentro,
                IndiceDepartamento = IndiceDepartamento,
                IndiceLinea = IndiceLinea,
                IndiceProceso = indicadorBD.IndiceProceso.GetValueOrDefault(),
                Orden = indicadorBD.Orden,
                Lote = indicadorBD.Lote,
                Material = indicadorBD.Material,
                DescripcionMaterial = indicadorBD.Descripcion,
                IndiceVelocidad = indicadorBD.IndiceVelocidad.GetValueOrDefault(),
                Reales = indicadorBD.Reales,
                Piezas = int.Parse(string.IsNullOrEmpty(indicadorBD.Maquina) ? "0" : indicadorBD.Maquina),
                Fecha = indicadorBD.Fecha.GetValueOrDefault(),
                Hora = indicadorBD.Fecha.GetValueOrDefault().Hour,
                Minuto = indicadorBD.Fecha.GetValueOrDefault().Minute,
                Turno = indicadorBD.Turno,
                Ciclo = int.Parse(string.IsNullOrEmpty(indicadorBD.Ciclo) ? "0" : indicadorBD.Ciclo),
                ListaParos = indicadorBD.IndicadorParo_V2.ToList().Select(c => new ParoModel { Indice = c.IndiceParo, Cantidad = c.Cantidad, Folio = c.Folio, EsParoPlanificado = c.EsParoPlanificado }).ToList(),
                ListaRechazos = indicadorBD.IndicadorRechazo_V2.ToList().Select(c => new RechazoModel { Indice = c.IndiceRechazo, Cantidad = c.Cantidad }).ToList(),
            };

            return Indicador;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="indicadorBD"></param>
        /// <param name="IndiceCentro"></param>
        /// <param name="IndiceDepartamento"></param>
        /// <param name="IndiceLinea"></param>
        /// <param name="IndiceProceso"></param>
        /// <returns></returns>
        public static List<IndicadorModel> ConvertirObjetoIndicadorAListaModelo(List<Indicador_V2> indicadorBD, long IndiceCentro, long IndiceDepartamento, long IndiceLinea, long IndiceProceso)
        {
            List<IndicadorModel> Lista = indicadorBD.Select(columna => new {
                Indice = columna.Indice,
                IndiceCentro = IndiceCentro,
                IndiceDepartamento = IndiceDepartamento,
                IndiceLinea = IndiceLinea,
                IndiceProceso = columna.IndiceProceso.GetValueOrDefault(),
                Orden = columna.Orden,
                Lote = columna.Lote,
                Material = columna.Material,
                DescripcionMaterial = columna.Descripcion,
                IndiceVelocidad = columna.IndiceVelocidad.GetValueOrDefault(),
                Reales = columna.Reales,
                Piezas = int.Parse(string.IsNullOrEmpty(columna.Maquina) ? "0" : columna.Maquina),
                Fecha = columna.Fecha.GetValueOrDefault(),
                Hora = columna.Fecha.GetValueOrDefault().Hour,
                Minuto = columna.Fecha.GetValueOrDefault().Minute,
                Turno = columna.Turno,
                Ciclo = int.Parse(string.IsNullOrEmpty(columna.Ciclo) ? "0" : columna.Ciclo),
                Paros = columna.IndicadorParo_V2.ToList().Select(c => new ParoModel { Indice = c.IndiceParo, Cantidad = c.Cantidad, Folio = c.Folio, EsParoPlanificado = c.EsParoPlanificado }).ToList(),
                Rechazos = columna.IndicadorRechazo_V2.ToList().Select(c => new RechazoModel { Indice = c.IndiceRechazo, Cantidad = c.Cantidad }).ToList()
            })
            .ToList()
            .Select(columna => new IndicadorModel()
            {
                Indice = columna.Indice,
                IndiceCentro = columna.IndiceCentro,
                IndiceDepartamento = columna.IndiceDepartamento,
                IndiceLinea = columna.IndiceLinea,
                IndiceProceso = columna.IndiceProceso,
                Orden = columna.Orden,
                Lote = columna.Lote,
                Material = columna.Material,
                DescripcionMaterial = columna.DescripcionMaterial,
                IndiceVelocidad = columna.IndiceVelocidad,
                Reales = columna.Reales,
                Piezas = columna.Piezas,
                Fecha = columna.Fecha,
                Hora = columna.Fecha.Hour,
                Minuto = columna.Fecha.Minute,
                Turno = columna.Turno,
                Ciclo = columna.Ciclo,
                ListaParos = columna.Paros,
                ListaRechazos = columna.Rechazos
            })
            .ToList();

            return Lista;
        }
    }
}
