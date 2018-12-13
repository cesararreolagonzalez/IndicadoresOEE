namespace IndicadoresOEE.Domain.Business
{
    using IndicadoresOEE.Common.Models;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using Common.Util;

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
        public List<ParoModel> ObtenerParosPorGerarquia(long IndiceParo, long IndiceProceso)
        {
            List<ParoModel> ListaParos = new List<ParoModel>();
            
            if(IndiceParo == 0)
            {
                ListaParos = db.Paro
                    .Where(columna => columna.nivel == 1 && columna.id_proceso == IndiceProceso && columna.eliminado == 0)
                    .Select(columna => new { Indice = columna.id_paro, Nombre = columna.descripcion })
                    .ToList()
                    .Where(columna => !Util.ListaParosPlanificados.Contains(columna.Nombre, StringComparer.InvariantCultureIgnoreCase))
                    .Select(columna => new ParoModel()
                    {
                        Indice = columna.Indice,
                        Nombre = columna.Nombre
                    })
                    .OrderBy(columna => columna.Nombre)
                    .ToList();
            }
            else
            {
                ListaParos = db.Paro
                    .Where(columna => columna.paro_padre == IndiceParo && columna.id_proceso == IndiceProceso && columna.eliminado == 0)
                    .Select(columna => new { Indice = columna.id_paro, Nombre = columna.descripcion })
                    .ToList()
                    .Select(columna => new ParoModel()
                    {
                        Indice = columna.Indice,
                        Nombre = columna.Nombre
                    })
                    //.Distinct()
                    .OrderBy(columna => columna.Nombre)
                    .ToList();
            }

            return ListaParos;
        }
    }
}
