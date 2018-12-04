using System.Web;
using System.Web.Optimization;

namespace IndicadoresOEE.Web
{
    public class BundleConfig
    {
        // Para obtener más información sobre las uniones, visite https://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery")
                .Include("~/Scripts/jquery-{version}.js",
                "~/Scripts/jquery-{version}.intellisense.js"));

            bundles.Add(new ScriptBundle("~/bundles/moment")
                .Include("~/Scripts/moment-with-locales.js"));

            bundles.Add(new ScriptBundle("~/bundles/angularjs")
                .Include("~/Scripts/angular.js",
                "~/Scripts/angular-animate.js",
                "~/Scripts/angular-sanitize.js",
                "~/Scripts/angular-cookies.js",
                "~/Scripts/angular-messages.js",
                "~/Scripts/angular-aria.js",
                "~/Scripts/angular-mocks.js",
                "~/Scripts/angular-moment.js"));

            bundles.Add(new ScriptBundle("~/bundles/angularapp")
                .Include("~/Scripts/app/app.js")
                .IncludeDirectory("~/Scripts/app/values", "*.js")
                .IncludeDirectory("~/Scripts/app/constants", "*.js")
                .IncludeDirectory("~/Scripts/app/factories", "*.js")
                .IncludeDirectory("~/Scripts/app/services", "*.js")
                .IncludeDirectory("~/Scripts/app/directives", "*.js")
                .IncludeDirectory("~/Scripts/app/controllers", "*.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include("~/Scripts/jquery.validate*"));

            // Utilice la versión de desarrollo de Modernizr para desarrollar y obtener información. De este modo, estará
            // para la producción, use la herramienta de compilación disponible en https://modernizr.com para seleccionar solo las pruebas que necesite.
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include("~/Scripts/modernizr-*"));

            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include("~/Scripts/bootstrap.js"));

            bundles.Add(new StyleBundle("~/Content/css").Include("~/Content/Site.css"));

            bundles.Add(new StyleBundle("~/Content/bootstrap").Include("~/Content/bootstrap.css"));
        }
    }
}
