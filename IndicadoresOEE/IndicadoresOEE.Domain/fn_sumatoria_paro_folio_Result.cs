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
    
    public partial class fn_sumatoria_paro_folio_Result
    {
        public Nullable<long> id_paro { get; set; }
        public Nullable<int> nivel { get; set; }
        public Nullable<long> paro_padre { get; set; }
        public string descripcion { get; set; }
        public Nullable<long> cantidad { get; set; }
        public Nullable<long> id_proceso { get; set; }
        public Nullable<long> id_departamento { get; set; }
        public Nullable<long> id_linea { get; set; }
        public string id_folio { get; set; }
    }
}
