using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using IndicadoresOEE.Common.Models;

namespace IndicadoresOEE.Domain.Business
{
    public class VelocidadBusiness
    {
        private readonly PrimaryConnection db;

        public VelocidadBusiness()
        {
            db = new PrimaryConnection();
        }

        public VelocidadModel ObtenerVelocidadPorMaterial(long IndiceProceso, long Material)
        {
            VelocidadModel velocidadModel = null;

            IndicadorVelocidad_V2 Velocidad = db.IndicadorVelocidad_V2
                .Where(c => c.IndiceProceso == IndiceProceso && c.Material == Material && c.Activo)
                .FirstOrDefault();

            if (Velocidad != null)
            {
                velocidadModel = new VelocidadModel() {
                    Velocidad = Velocidad.Velocidad,
                    Material = Velocidad.Material,
                    Indice = Velocidad.Indice
                };
            }

            return velocidadModel;
        }

        public List<VelocidadModel> ObtenerVelocidadesPorProcesos(long[] IndiceProceso)
        {
            List<VelocidadModel> ListaVelocidades = null;
            
            ListaVelocidades = 
                            db.IndicadorVelocidad_V2
                            .Where(columna => IndiceProceso.Contains(columna.IndiceProceso) && columna.Activo)
                            .Select(columna => new {
                                IndiceVelocidad = columna.Indice,
                                columna.Velocidad,
                                columna.Material,
                                columna.IndiceProceso,
                                NombreCentro = db.Centro.Where(c => c.id_centro == columna.IndiceCentro).Select(c => c.nombre).FirstOrDefault(),
                                NombreDepartamento = db.Departamento.Where(c => c.id_departamento == columna.IndiceDepartamento).Select(c => c.nombre).FirstOrDefault(),
                                NombreLinea = db.Linea.Where(c => c.id_linea == columna.IndiceLinea).Select(c => c.nombre).FirstOrDefault(),
                                NombreProceso = db.vw_usuarios_procesos.Where(c => c.id_proceso == columna.IndiceProceso).Select(c => c.nombre_proceso).FirstOrDefault()
                            })
                            .Distinct()
                            .GroupBy(columna => columna.IndiceProceso)
                            .SelectMany(fila => fila)
                            .Select(columna => new VelocidadModel() { Indice = columna.IndiceProceso, Velocidad = columna.Velocidad, Material = columna.Material, IndiceProceso = columna.IndiceProceso, NombreProceso = columna.NombreProceso })
                            //.Select(columna => new VelocidadModel() { Indice = columna.IndiceProceso, Nombre = "[" + columna.NombreCentro + "] - [" + columna.NombreDepartamento + "] - [" + columna.NombreLinea + "] -  [" + columna.NombreProceso + "] - " + columna.Material + " - " + columna.Velocidad, Velocidad = columna.Velocidad, Material = columna.Material, IndiceProceso = columna.IndiceProceso })
                            .OrderBy(columna => columna.Velocidad)
                            .ToList();
            
            return ListaVelocidades;
        }
    }
}
