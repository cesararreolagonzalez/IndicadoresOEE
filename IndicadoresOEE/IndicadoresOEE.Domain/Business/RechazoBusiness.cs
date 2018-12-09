namespace IndicadoresOEE.Domain.Business
{
    using IndicadoresOEE.Common.Models;
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
    }
}
