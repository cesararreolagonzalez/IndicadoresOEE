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
    
    public partial class Indicador_Paro
    {
        public long id_indicador { get; set; }
        public long id_paro { get; set; }
        public Nullable<long> cantidad { get; set; }
        public string Folio { get; set; }
    
        public virtual Indicador Indicador { get; set; }
        public virtual Paro Paro { get; set; }
    }
}
