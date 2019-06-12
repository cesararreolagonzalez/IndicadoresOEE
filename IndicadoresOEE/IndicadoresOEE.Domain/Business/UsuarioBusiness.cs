namespace IndicadoresOEE.Domain.Business
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using IndicadoresOEE.Common.Models;
    using Newtonsoft.Json;

    public class UsuarioBusiness
    {
        private readonly PrimaryConnection db;

        public UsuarioBusiness()
        {
            db = new PrimaryConnection();
        }

        /// <summary>
        /// Obtiene la lista de usuarios
        /// </summary>
        /// <returns>Regresa la lista de usuarios</returns>
        public List<UsuarioModel> ObtenerUsuarios()
        {
            return db.Usuario
                .Select(c => new {
                    Indice = c.id_usuario,
                    Usuario = c.usuario1,
                    Nombre = c.nombre,
                    Apellidos = c.apellidos,
                    EsDirectorioActivo = c.directorio_activo == 1 ? true : false,
                    EsSAP = false,
                    EsLocal = c.directorio_activo == 1 ? false : true,
                    EstaActivo = c.estado ?? false,
                    UltimoIngreso = c.ultimo_ingreso,
                    UltimaRenovacion = c.ultima_renovacion,
                    EstaEliminado = c.eliminado == 1 ? true : false,
                    Perfil = new PerfilModel() { Indice = c.id_perfil ?? 0, Nombre = db.Perfil.Where(d => d.id_perfil == c.id_perfil).Select(d => d.descripcion).FirstOrDefault() }
                })
                .AsEnumerable()
                .Select(c => new UsuarioModel
                {
                    Indice = c.Indice,
                    Usuario = c.Usuario,
                    Nombre = c.Nombre,
                    Apellidos = c.Apellidos,
                    NombreCompleto = c.Nombre + " " + c.Apellidos,
                    EsDirectorioActivo = c.EsDirectorioActivo,
                    EsSAP = c.EsSAP,
                    EsLocal = c.EsLocal,
                    EstaActivo = c.EstaActivo,
                    UltimoIngreso = c.UltimoIngreso,
                    UltimaRenovacion = c.UltimaRenovacion,
                    UltimoIngresoJSON = JsonConvert.SerializeObject(c.UltimoIngreso.GetValueOrDefault()).Replace("\"", ""),
                    UltimaRenovacionJSON = JsonConvert.SerializeObject(c.UltimaRenovacion.GetValueOrDefault()).Replace("\"", ""),
                    EstaEliminado = c.EstaEliminado,
                    Perfil = c.Perfil
                })
                .ToList();
        }

        public bool EliminarUsuario(long Indice)
        {
            var Usuario = db.Usuario.Find(Indice);

            if(Usuario != null)
            {
                Usuario.eliminado = 1;
                db.SaveChanges();

                return true;
            }

            return false;
        }
    }
}
