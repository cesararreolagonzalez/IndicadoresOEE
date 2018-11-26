//------------------------------------------------------------------------------
// <auto-generated>
//     Este código se generó a partir de una plantilla.
//
//     Los cambios manuales en este archivo pueden causar un comportamiento inesperado de la aplicación.
//     Los cambios manuales en este archivo se sobrescribirán si se regenera el código.
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