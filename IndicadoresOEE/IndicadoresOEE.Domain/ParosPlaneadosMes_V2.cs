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
    
    public partial class ParosPlaneadosMes_V2
    {
        public long Indice { get; set; }
        public int Cantidad { get; set; }
        public System.DateTime Fecha { get; set; }
        public Nullable<int> IndiceCentro { get; set; }
        public Nullable<long> IndiceDepartamento { get; set; }
        public Nullable<long> IndiceLinea { get; set; }
        public Nullable<long> IndiceProceso { get; set; }
        public Nullable<long> IndiceParo { get; set; }
    
        public virtual Centro Centro { get; set; }
        public virtual Departamento Departamento { get; set; }
        public virtual Linea Linea { get; set; }
        public virtual Paro Paro { get; set; }
        public virtual Proceso Proceso { get; set; }
    }
}
