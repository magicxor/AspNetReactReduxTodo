using System.Diagnostics.CodeAnalysis;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using NLog.Web;

namespace ReactReduxTodo;

[SuppressMessage("Roslynator", "RCS1102:Make class static", Justification = "Entry point requires a non-static class for testability.")]
[SuppressMessage("Major Code Smell", "S1118:Utility classes should not have public constructors", Justification = "Entry point requires a non-static class for testability.")]
[SuppressMessage("ApiDesign", "RS0030:Do not use banned APIs", Justification = "Entry point requires this call")]
public sealed class Program
{
    public static void Main(string[] args)
    {
        CreateWebHostBuilder(args).Build().Run();
    }

    public static IHostBuilder CreateWebHostBuilder(string[] args) =>
        Host.CreateDefaultBuilder(args)
            .ConfigureWebHostDefaults(webBuilder => webBuilder.UseStartup<Startup>())
            .ConfigureLogging(logging =>
            {
                // remove other logging providers, such as remote loggers or unnecessary event logs
                logging.ClearProviders();
                logging.SetMinimumLevel(LogLevel.Trace);
            })
            .UseNLog();
}
