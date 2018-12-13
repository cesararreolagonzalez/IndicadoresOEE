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
                .Where(columna => columna.nivel == 1 && columna.id_proceso == IndiceProceso && columna.eliminado == 0)
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

        /// <summary>
        /// 
        /// </summary>
        /// <param name="IndiceUsuario"></param>
        /// <param name="IndiceDepartamento"></param>
        /// <returns></returns>
        public List<ParoModel> ObtenerParosPorGerarquia(long IndiceParo, long IndiceProceso)
        {
            List<ParoModel> ListaParos = new List<ParoModel>();
            
            ListaParos = db.Paro
                .Where(columna => columna.paro_padre == IndiceParo && columna.id_proceso ==  IndiceProceso && columna.eliminado == 0)
                .Select(columna => new { Indice = columna.id_paro, Nombre = columna.descripcion })
                .ToList()
                .Select(columna => new ParoModel() {
                    Indice = columna.Indice,
                    Nombre = columna.Nombre
                })
                //.Distinct()
                .OrderBy(columna => columna.Nombre)
                .ToList();

            return ListaParos;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="IndiceUsuario"></param>
        /// <param name="IndiceDepartamento"></param>
        /// <returns></returns>
        public List<ParoModel> ObtenerParosPorGerarquia1(long IndiceParo, long IndiceProceso)
        {
            List<ParoModel> ListaParos = new List<ParoModel>();
            
            if(IndiceParo == 0)
            {
                ListaParos = db.Paro
                    .Where(columna => columna.nivel == 1 && columna.id_proceso == IndiceProceso && columna.eliminado == 0)
                    .Select(columna => new { Indice = columna.id_paro, Nombre = columna.descripcion })
                    .ToList()
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
