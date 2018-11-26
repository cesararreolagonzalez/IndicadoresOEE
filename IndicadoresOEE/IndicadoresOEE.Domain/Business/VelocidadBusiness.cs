using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IndicadoresOEE.Domain.Business
{
    public class VelocidadBusiness
    {
        private readonly PrimaryConnection db;

        public VelocidadBusiness()
        {
            db = new PrimaryConnection();
        }
    }
}
