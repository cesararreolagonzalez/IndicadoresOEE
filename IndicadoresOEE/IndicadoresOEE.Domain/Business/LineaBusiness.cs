namespace IndicadoresOEE.Domain.Business
{
    using IndicadoresOEE.Common.Models;
    using System.Collections.Generic;
    using System.Linq;

    public class LineaBusiness
    {
        private readonly PrimaryConnection db;

        public LineaBusiness()
        {
            db = new PrimaryConnection();
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="IndiceUsuario"></param>
        /// <param name="IndiceDepartamento"></param>
        /// <returns></returns>
        public List<LineaModel> ObtenerLineas(long IndiceUsuario, long IndiceDepartamento)
        {
            List<LineaModel> ListaDepartamentos = new List<LineaModel>();

            ListaDepartamentos = db
                            .vw_usuarios_procesos
                            .Where(columna => columna.id_usuario == IndiceUsuario && columna.id_departamento == IndiceDepartamento)
                            .Select(columna => new { Indice = columna.id_linea, Nombre = columna.nombre_linea })
                            .Distinct()
                            .ToList()
                            .Select(columna => new LineaModel() { Indice = columna.Indice, Nombre = columna.Nombre, IndiceDepartamento = IndiceDepartamento })
                            .OrderBy(columna => columna.Nombre)
                            .ToList();

            return ListaDepartamentos;
        }
    }
}
