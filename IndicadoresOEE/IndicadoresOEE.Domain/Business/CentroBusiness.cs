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
            List<CentroModel> ListaCentros = 
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
                    p.IndiceDepartamento,
                    IndiceCentro = d.id_centro ?? 0
                })
                .Join(db.Centro, p => p.IndiceCentro, c => c.id_centro, (p, c) => new {
                    IndiceCentro = c.id_centro,
                    Nombre = c.nombre
                })
                .GroupBy(c => c.IndiceCentro)
                .ToList()
                .Select(c => new CentroModel { Indice = c.Key, Nombre = c.Max(d => d.Nombre) })
                .OrderBy(c => c.Nombre)
                .ToList();

            return ListaCentros;
        }
    }
}
