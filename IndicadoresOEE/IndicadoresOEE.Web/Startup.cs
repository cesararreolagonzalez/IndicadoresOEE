using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(IndicadoresOEE.Web.Startup))]
namespace IndicadoresOEE.Web
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
