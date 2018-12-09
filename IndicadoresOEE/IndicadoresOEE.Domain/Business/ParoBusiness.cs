namespace IndicadoresOEE.Domain.Business
{
    using IndicadoresOEE.Common.Models;
    using System.Collections.Generic;
    using System.Linq;

    public class ParoBusiness
    {
        private readonly PrimaryConnection db;

        public ParoBusiness()
        {
            db = new PrimaryConnection();
        }
        

        /// <summary>
        /// 
        /// </summary>
        /// <param name="IndiceUsuario"></param>
        /// <param name="IndiceDepartamento"></param>
        /// <returns></returns>
        public List<ParoModel> ObtenerParosPorProceso(long IndiceProceso)
        {
            List<ParoModel> ListaParos = new List<ParoModel>();

            ListaParos = db.Paro
                .Where(columna => columna.nivel == 1 && columna.id_proceso ==  IndiceProceso)
                .Select(columna => new { Indice = columna.id_paro, Nombre = columna.descripcion })
                .ToList()
                .Select(columna => new ParoModel() {
                    Indice = columna.Indice,
                    Nombre = columna.Nombre
                })
                .OrderBy(columna => columna.Nombre)
                .ToList();

            return ListaParos;
        }
    }
}
