namespace IndicadoresOEE.Domain.Business
{
    public class CentroBusiness
    {
        private readonly PrimaryConnection db;

        public CentroBusiness()
        {
            db = new PrimaryConnection();
        }
    }
}
