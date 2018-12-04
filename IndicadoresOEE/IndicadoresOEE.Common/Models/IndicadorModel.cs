namespace IndicadoresOEE.Common.Models
{
    using System;
    using System.Collections.Generic;
    using System.Runtime.Serialization;

    [DataContract]
    public class IndicadorModel
    {
        [DataMember]
        public long Indice { get; set; }
        [DataMember]
        public long IndiceCentro { get; set; }
        [DataMember]
        public long IndiceDepartamento { get; set; }
        [DataMember]
        public long IndiceLinea { get; set; }
        [DataMember]
        public long IndiceProceso { get; set; }
        [DataMember]
        public string Orden { get; set; }
        [DataMember]
        public string Lote { get; set; }
        [DataMember]
        public string Material { get; set; }
        [DataMember]
        public string Reales { get; set; }
        [DataMember]
        public string DescripcionMaterial { get; set; }
        [DataMember]
        public long IndiceVelocidad { get; set; }
        [DataMember]
        public string Velocidad { get; set; }

        [DataMember]
        public int Piezas { get; set; }
        [DataMember]
        public DateTime Fecha { get; set; }
        [DataMember]
        public int Dia { get; set; }
        [DataMember]
        public int Mes { get; set; }
        [DataMember]
        public int Año { get; set; }
        [DataMember]
        public int Hora { get; set; }
        [DataMember]
        public int Minuto { get; set; }
        [DataMember]
        public string Turno { get; set; }
        [DataMember]
        public int Ciclo { get; set; }

        [DataMember]
        public List<ParoModel> Paros { get; set; }
        [DataMember]
        public List<RechazoModel> Rechazos { get; set; }

        [DataMember]
        public bool EsHistorico { get; set; }

        public IndicadorModel()
        {
            Paros = new List<ParoModel>();
            Rechazos = new List<RechazoModel>();
        }
    }
}
