namespace IndicadoresOEE.Domain.Business
{
    using System;
    using System.Data.Entity;
    using System.Linq;

    public class IndicadorTiempoBusiness
    {
        private readonly PrimaryConnection db;

        public IndicadorTiempoBusiness()
        {
            db = new PrimaryConnection();
        }
        
        /// <summary>
        /// 
        /// </summary>
        /// <param name="IndiceProceso"></param>
        /// <returns></returns>
        public DateTime? ObtenerIndicadorTiempo(long IndiceProceso)
        {
            DateTime? Fecha = null;

            var IndicadorTiempoV2BD = db.IndicadorTiempo_V2
                .Where(columna => columna.IndiceProceso == IndiceProceso)
                .OrderByDescending(columna => columna.Fecha)
                .FirstOrDefault();

            if (IndicadorTiempoV2BD == null)
            {
                Indicador_Tiempo IndicadorTiempoV1BD = db.Indicador_Tiempo
                    .Where(columna => columna.id_proceso == IndiceProceso)
                    .OrderByDescending(columna => columna.fecha_hora)
                    .FirstOrDefault();
                
                if (IndicadorTiempoV1BD != null)
                {
                    Fecha = IndicadorTiempoV1BD.fecha_hora ?? null;
                }
            }
            else
            {
                Fecha = IndicadorTiempoV2BD.Fecha ?? null;
            }

            return Fecha;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="IndiceProceso"></param>
        /// <param name="DatosIndicadorTiempo"></param>
        /// <returns></returns>
        public bool InsertarIndicadorTiempo(long IndiceProceso, DateTime Fecha)
        {
            try
            {
                IndicadorTiempo_V2 IndicadorTiempo = new IndicadorTiempo_V2()
                {
                    IndiceProceso = IndiceProceso,
                    Fecha = Fecha
                };

                db.IndicadorTiempo_V2.Add(IndicadorTiempo);
                db.SaveChanges();
            }
            catch (Exception)
            {
                return false;
            }

            return true;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="IndiceProceso"></param>
        /// <param name="DatosIndicadorTiempo"></param>
        /// <returns></returns>
        public bool EditarIndicadorTiempo(long IndiceProceso, DateTime Fecha)
        {
            try
            {
                IndicadorTiempo_V2 IndicadorTiempo = db.IndicadorTiempo_V2
                    .Where(columna => columna.IndiceProceso == IndiceProceso)
                    .FirstOrDefault();

                if (IndicadorTiempo != null)
                    return false;

                if (Fecha < IndicadorTiempo.Fecha)
                    return false;

                IndicadorTiempo.Fecha = Fecha;

                db.Entry(IndicadorTiempo).State = EntityState.Modified;
            }
            catch (Exception)
            {
                return false;
            }

            return true;
        }

        public bool ActualizarIndicadorTiempo(long IndiceProceso, DateTime Fecha)
        {
            bool Estado = false;

            var IndicadorTiempo = ObtenerIndicadorTiempo(IndiceProceso);
            if (IndicadorTiempo != null)
            {
                Estado = EditarIndicadorTiempo(IndiceProceso, Fecha);
            }
            else
            {
                Estado = InsertarIndicadorTiempo(IndiceProceso, Fecha);
            }

            return Estado;
        }
    }
}
