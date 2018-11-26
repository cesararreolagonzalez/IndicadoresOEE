namespace IndicadoresOEE.Common.Models
{
    using System.Runtime.Serialization;

    [DataContract]
    public class UsuarioModel
    {
        [DataMember]
        public int Indice { get; set; }
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
}
