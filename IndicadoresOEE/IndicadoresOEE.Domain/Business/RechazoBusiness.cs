namespace IndicadoresOEE.Domain.Business
{
    using IndicadoresOEE.Common.Models;
    using System;
    using System.Collections.Generic;
    using System.Linq;

    public class RechazoBusiness
    {
        private readonly PrimaryConnection db;

        public RechazoBusiness()
        {
            db = new PrimaryConnection();
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="IndiceProceso"></param>
        /// <returns></returns>
        public List<RechazoModel> ObtenerRechazosPorProceso(long IndiceProceso)
        {
            List<RechazoModel> ListaRechazos =
                db.Rechazo
                .Where(columna => columna.Proceso.Any(c => c.id_proceso == IndiceProceso))
                .Select(columna => new { Indice = columna.id_rechazo, Nombre = columna.nombre })
                .ToList()
                .Select(columna => new RechazoModel() { Indice = columna.Indice, Nombre = columna.Nombre })
                .OrderBy(columna => columna.Nombre)
                .ToList();

            return ListaRechazos;
        }

        public bool AgregarRechazo(long IndiceIndicador, long IndiceRechazo, int Cantidad)
        {
            bool Estado = false;

            if (Cantidad > 0)
            {
                Rechazo rechazo = db.Rechazo.Where(columna => columna.id_rechazo == IndiceRechazo).FirstOrDefault();

                if (rechazo != null)
                {
                    IndicadorRechazo_V2 IndicadorRechazo = new IndicadorRechazo_V2
                    {
                        IndiceIndicador = IndiceIndicador,
                        IndiceRechazo = IndiceRechazo,
                        Cantidad = Cantidad
                    };

                    try
                    {
                        db.IndicadorRechazo_V2.Add(IndicadorRechazo);
                        Estado = true;
                    }
                    catch (Exception)
                    {

                    }
                }
            }

            return Estado;
        }
    }
}
