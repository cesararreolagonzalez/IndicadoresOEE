namespace IndicadoresOEE.Domain.Business
{
    using System.Collections.Generic;
    using System.Linq;
    using IndicadoresOEE.Common.Models;

    public class PerfilBusiness
    {
        private readonly PrimaryConnection db;

        public PerfilBusiness()
        {
            db = new PrimaryConnection();
        }

        /// <summary>
        /// Obtiene la lista de perfiles
        /// </summary>
        /// <returns>Regresa la lista de perfiles</returns>
        public List<PerfilModel> ObtenerPerfiles()
        {
            return db.Perfil
                .Select(c => new {
                    Indice = c.id_perfil,
                    Nombre = c.descripcion,
                    EstaEliminado = c.eliminado == 1 ? true : false,
                })
                .AsEnumerable()
                .Select(c => new PerfilModel
                {
                    Indice = c.Indice,
                    Nombre = c.Nombre
                })
                .ToList();
        }
    }
}
