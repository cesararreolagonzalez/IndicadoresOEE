//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace IndicadoresOEE.Domain
{
    using System;
    using System.Collections.Generic;
    
    public partial class Indicador_Laboratorio
    {
        public int id_indicadorLaboratorio { get; set; }
        public int id_laboratorio { get; set; }
        public int id_equipo { get; set; }
        public string muestra { get; set; }
        public System.DateTime fecha_inicio { get; set; }
        public Nullable<System.DateTime> fecha_fin { get; set; }
        public int repeticion { get; set; }
        public string hora_inicio { get; set; }
        public string hora_fin { get; set; }
        public Nullable<int> numero_lotes { get; set; }
        public System.DateTime fecha_carga { get; set; }
        public int duracion { get; set; }
    
        public virtual Equipo Equipo { get; set; }
        public virtual Laboratorio Laboratorio { get; set; }
    }
}
