namespace IndicadoresOEE.Domain.Business
{
    using IndicadoresOEE.Common.Models;
    using System.Collections.Generic;
    using System.Linq;

    public class CentroBusiness
    {
        private readonly PrimaryConnection db;

        public CentroBusiness()
        {
            db = new PrimaryConnection();
        }

        public List<CentroModel> ObtenerCentros(long IndiceUsuario)
        {
            List<CentroModel> ListaCentros = new List<CentroModel>();

            ListaCentros = db
                            .vw_usuarios_procesos
                            .Where(columna => columna.id_usuario == IndiceUsuario)
                            .Select(columna => new { Indice = columna.id_centro, Nombre = columna.nombre_centro })
                            .Distinct()
                            .ToList()
                            .Select(columna => new CentroModel() { Indice = columna.Indice, Nombre = columna.Nombre })
                            .OrderBy(columna => columna.Nombre)
                            .ToList();

            return ListaCentros;
        }
    }
}
