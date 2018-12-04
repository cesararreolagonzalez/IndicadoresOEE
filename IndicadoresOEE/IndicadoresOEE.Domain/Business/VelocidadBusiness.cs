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

        public VelocidadModel ObtenerVelocidad(long IndiceProceso, long Material)
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
    }
}
