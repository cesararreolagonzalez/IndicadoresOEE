namespace IndicadoresOEE.Domain.Business
{
    using System;

    public class BitacoraBusiness
    {
        private readonly PrimaryConnection db;

        public BitacoraBusiness()
        {
            db = new PrimaryConnection();
        }

        /// <summary>
        /// Agrega nueva entrada en la bitácora
        /// </summary>
        /// <param name="IndiceUsuario">Identificador del usuario con la sesión actual</param>
        /// <param name="Excepcion">Detalles de la excepción lanzada</param>
        /// <param name="Localizacion">Localización donde ocurrió la excepción</param>
        public void AgregarBitacora(int IndiceUsuario, string Excepcion, string Localizacion)
        {
            Bitacora bitacora = new Bitacora()
            {
                error = Excepcion,
                idUsuario = IndiceUsuario,
                seccion = Localizacion,
                fecha = DateTime.Now
            };

            db.Bitacora.Add(bitacora);
        }
    }
}
