using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IndicadoresOEE.Domain.Business
{
    public class LineaBusiness
    {
        private readonly PrimaryConnection db;

        public LineaBusiness()
        {
            db = new PrimaryConnection();
        }
    }
}
