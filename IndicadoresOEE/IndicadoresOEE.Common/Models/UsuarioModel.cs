namespace IndicadoresOEE.Common.Models
{
    using System;
    using System.Runtime.Serialization;

    [DataContract]
    public class UsuarioCreacionModel
    {
        [DataMember]
        public long Indice { get; set; }
        [DataMember]
        public string Usuario { get; set; }
        [DataMember]
        public string Contraseña { get; set; }
        [DataMember]
        public string ConfirmarContraseña { get; set; }
        [DataMember]
        public string Nombre { get; set; }
        [DataMember]
        public string ApellidoPaterno { get; set; }
        [DataMember]
        public string ApellidoMaterno { get; set; }
        [DataMember]
        public long IndicePerfil { get; set; }
    }

    [DataContract]
    public class UsuarioModel
    {
        [DataMember]
        public long Indice { get; set; }
        [DataMember]
        public string Usuario { get; set; }
        [DataMember]
        public string Contraseña { get; set; }
        [DataMember]
        public string ConfirmarContraseña { get; set; }
        [DataMember]
        public string Nombre { get; set; }
        [DataMember]
        public string NombreCompleto { get; set; }
        [DataMember]
        public string Apellidos { get; set; }
        [DataMember]
        public bool EsDirectorioActivo { get; set; }
        [DataMember]
        public bool EsSAP { get; set; }
        [DataMember]
        public bool IndicePerfil { get; set; }
        [DataMember]
        public bool EsLocal { get; set; }
        [DataMember]
        public bool EstaActivo { get; set; }
        [DataMember]
        public bool EstaEliminado { get; set; }
        [DataMember]
        public DateTime? UltimoIngreso { get; set; }
        [DataMember]
        public DateTime? UltimaRenovacion { get; set; }
        [DataMember]
        public string UltimoIngresoJSON { get; set; }
        [DataMember]
        public string UltimaRenovacionJSON { get; set; }
        [DataMember]
        public PerfilModel Perfil { get; set; }
    }
}
