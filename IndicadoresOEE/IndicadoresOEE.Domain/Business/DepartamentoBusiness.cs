using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IndicadoresOEE.Domain.Business
{
    public class DepartamentoBusiness
    {
        private readonly PrimaryConnection db;

        public DepartamentoBusiness()
        {
            db = new PrimaryConnection();
        }
    }
}
