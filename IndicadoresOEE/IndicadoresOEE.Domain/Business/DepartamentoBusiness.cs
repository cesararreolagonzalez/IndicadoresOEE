namespace IndicadoresOEE.Domain.Business
{
    using System.Collections.Generic;
    using System.Linq;
    using IndicadoresOEE.Common.Models;

    public class DepartamentoBusiness
    {
        private readonly PrimaryConnection db;

        public DepartamentoBusiness()
        {
            db = new PrimaryConnection();
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="IndiceUsuario"></param>
        /// <param name="IndiceCentro"></param>
        /// <returns></returns>
        public List<DepartamentoModel> ObtenerDepartamentosPorCentro(long IndiceUsuario, long IndiceCentro)
        {
            List<DepartamentoModel> ListaDepartamentos =
                   db.Proceso.Where(c => c.Usuario.Any(d => d.id_usuario == IndiceUsuario))
                   .Select(c => new
                   {
                       IndiceLinea = c.id_linea ?? 0
                   })
                   .Join(db.Linea, p => p.IndiceLinea, l => l.id_linea, (p, l) => new {
                       IndiceLinea = l.id_linea,
                       IndiceDepartamento = l.id_departamento ?? 0
                   })
                   .Join(db.Departamento, p => p.IndiceDepartamento, d => d.id_departamento, (p, d) => new {
                       IndiceDepartamento = d.id_departamento,
                       Nombre = d.nombre,
                       IndiceCentro = d.id_centro ?? 0
                   })
                   .Where(c => c.IndiceCentro == IndiceCentro)
                   .GroupBy(c => c.IndiceDepartamento)
                   .ToList()
                   .Select(c => new DepartamentoModel { Indice = c.Key, Nombre = c.Max(d => d.Nombre) })
                   .OrderBy(c => c.Nombre)
                   .ToList();

            return ListaDepartamentos;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="IndiceUsuario"></param>
        /// <param name="IndiceCentro"></param>
        /// <returns></returns>
        public List<DepartamentoModel> ObtenerDepartamentosPorCentros(long IndiceUsuario, long[] ListaIndicesCentros)
        {
            List<DepartamentoModel> ListaDepartamentos = new List<DepartamentoModel>();
            
            ListaDepartamentos = db
                            .vw_usuarios_procesos
                            .Where(columna => columna.id_usuario == IndiceUsuario && ListaIndicesCentros.Contains(columna.id_centro))
                            .Select(columna => new { Indice = columna.id_departamento, Nombre = columna.nombre_depto, IndiceCentro = columna.id_centro, NombreCentro = db.Centro.Where(c => c.id_centro == columna.id_centro).Select(c => c.nombre).FirstOrDefault() })
                            .Distinct()
                            .GroupBy(columna => columna.IndiceCentro)
                            .SelectMany(fila => fila)
                            .Select(columna => new DepartamentoModel() { Indice = columna.Indice, Nombre = columna.Nombre, IndiceCentro = columna.IndiceCentro, NombreCentro = columna.NombreCentro })
                            //.Select(columna => new DepartamentoModel() { Indice = columna.Indice, Nombre = "[" + columna.NombreCentro + "] - " + columna.Nombre, IndiceCentro = columna.IndiceCentro })
                            .OrderBy(columna => columna.Nombre)
                            .ToList();

            return ListaDepartamentos;
        }
    }
}
