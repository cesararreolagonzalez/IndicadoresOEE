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
    
    public partial class Indicador_Capacidad
    {
        public int id_indicadorCapacidad { get; set; }
        public int id_almacen { get; set; }
        public int id_unidadMedida { get; set; }
        public int ocupacion { get; set; }
        public System.DateTime fechaCaptura { get; set; }
        public Nullable<int> capacidad { get; set; }
    
        public virtual Almacen Almacen { get; set; }
        public virtual UnidadMedida UnidadMedida { get; set; }
    }
}
