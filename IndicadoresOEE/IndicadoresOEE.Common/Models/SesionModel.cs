namespace IndicadoresOEE.Common.Models
{
    using System.Runtime.Serialization;

    [DataContract]
    public class SesionModel
    {
        [DataMember]
        public string Usuario { get; set; }

        [DataMember]
        public string Contraseña { get; set; }
    }
}
