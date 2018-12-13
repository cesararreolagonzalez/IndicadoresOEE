namespace IndicadoresOEE.Common.Util
{
    using System.Collections.Generic;

    public static class Util
    {
        public static List<string> ListaParosPlanificados  
            = new List<string>() {
                "Mantenimiento Planeado",
                "Validaciones",
                "Fin de semana",
                "Fin de programa",
                "Día festivo", "RTN",
                "Transferencias",
                "Envases simulados",
                "Habilitación",
                "Espera de resultados de envase simulado",
                "Otros",
                "Sin causa asignada"
            };
}
}
