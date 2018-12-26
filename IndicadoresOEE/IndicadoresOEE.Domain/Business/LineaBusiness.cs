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
        public List<LineaModel> ObtenerLineasPorDepartamento(long IndiceUsuario, long IndiceDepartamento)
        {
            List<LineaModel> ListaLineas = new List<LineaModel>();

            ListaLineas = db
                            .vw_usuarios_procesos
                            .Where(columna => columna.id_usuario == IndiceUsuario && columna.id_departamento == IndiceDepartamento)
                            .Select(columna => new { Indice = columna.id_linea, Nombre = columna.nombre_linea })
                            .Distinct()
                            .ToList()
                            .Select(columna => new LineaModel() { Indice = columna.Indice, Nombre = columna.Nombre, IndiceDepartamento = IndiceDepartamento })
                            .OrderBy(columna => columna.Nombre)
                            .ToList();

            return ListaLineas;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="IndiceUsuario"></param>
        /// <param name="IndiceDepartamento"></param>
        /// <returns></returns>
        public List<LineaModel> ObtenerLineasPorDepartamentos(long IndiceUsuario, long[] IndiceDepartamento)
        {
            List<LineaModel> ListaLineas = new List<LineaModel>();

            ListaLineas = db
                            .vw_usuarios_procesos
                            .Where(columna => columna.id_usuario == IndiceUsuario && IndiceDepartamento.Contains(columna.id_departamento))
                            .Select(columna => new {
                                IndiceLinea = columna.id_linea,
                                IndiceDepartamento = columna.id_departamento,
                                NombreLinea = columna.nombre_linea,
                                NombreCentro = db.Centro.Where(c => c.id_centro == columna.id_centro).Select(c => c.nombre).FirstOrDefault(),
                                NombreDepartamento = db.Departamento.Where(c => c.id_departamento == columna.id_departamento).Select(c => c.nombre).FirstOrDefault()
                            })
                            .Distinct()
                            .GroupBy(columna => columna.IndiceDepartamento)
                            .SelectMany(fila => fila)
                            //.Select(columna => new LineaModel() { Indice = columna.IndiceLinea, Nombre = "[" + columna.NombreCentro + "] - [" + columna.NombreDepartamento + "] - " + columna.NombreLinea.ToUpper(), IndiceDepartamento = columna.IndiceDepartamento })
                            .Select(columna => new LineaModel() { Indice = columna.IndiceLinea, Nombre = columna.NombreLinea.ToUpper(), IndiceDepartamento = columna.IndiceDepartamento, NombreCentro = columna.NombreCentro, NombreDepartamento = columna.NombreDepartamento  })
                            .OrderBy(columna => columna.Nombre)
                            .ToList();

            return ListaLineas;
        }
    }
}
