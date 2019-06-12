namespace IndicadoresOEE.Common.Models
{
    using System.Runtime.Serialization;

    [DataContract]
    public class Response
    {
        [DataMember]
        public object Mensaje { get; set; }
        [DataMember]
        public bool Estado { get; set; }
    }
}
