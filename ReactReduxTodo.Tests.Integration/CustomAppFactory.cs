using System.Data.Common;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.DataProtection.KeyManagement;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using NLog;
using NLog.Config;
using NLog.Web;
using ReactReduxTodo.Data;
using ReactReduxTodo.Extensions;
using ReactReduxTodo.Tests.Integration.Utils;
using LogLevel = Microsoft.Extensions.Logging.LogLevel;

namespace ReactReduxTodo.Tests.Integration;

internal sealed class CustomAppFactory
    : WebApplicationFactory<Program>
{
    private readonly string _connectionString;

    public CustomAppFactory(string connectionString)
    {
        LogManager.Configuration = new XmlLoggingConfiguration("nlog.config");
        _connectionString = connectionString;
    }

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder
            .ConfigureServices(services =>
            {
                // we will use in-memory cache for tests
                services.RemoveAll<IDistributedCache>();
                services.RemoveAll<IDataProtectionProvider>();

                // we will override these options
                services.RemoveAll<MemoryDistributedCacheOptions>();
                services.RemoveAll<IdentityOptions>();
                services.RemoveAll<KeyManagementOptions>();

                // we will use TestContainers + Respawner for DB, Redis, RabbitMQ
                services.RemoveAll<DbContextOptions<ApplicationDbContext>>();
                services.RemoveAll<DbConnection>();
                services.RemoveAll<ApplicationDbContext>();
                services.RemoveAll<TimeProvider>();

                services
                    .Configure<MemoryDistributedCacheOptions>(_ => { });

                // fake Redis
                services.AddDistributedMemoryCache();

                services.AddDbContext<ApplicationDbContext>((provider, options) =>
                {
                    var webHostEnvironment = provider.GetRequiredService<IWebHostEnvironment>();
                    if (webHostEnvironment.IsDevelopment() || webHostEnvironment.IsEnvironment("IntegrationTesting"))
                    {
                        options.EnableSensitiveDataLogging();
                    }

                    options.UseSqlServer(_connectionString, ContextConfiguration.SqlServerOptionsAction);

                    var isQueryLoggingEnabled = bool.Parse("false");
                    if (isQueryLoggingEnabled)
                    {
                        options.LogTo((eventId, logLevel) => logLevel >= LogLevel.Trace,
                            eventData =>
                            {
                                TestLogUtils.WriteProgressMessage(eventData.ToString());
                                TestLogUtils.WriteConsoleMessage(eventData.ToString());
                            });
                    }
                });

                services.AddDataProtection(options => options
                        .ApplicationDiscriminator = "e97ee47d-cdc7-4cd6-966f-14b106ebb388")
                    .SetApplicationName("ReactReduxTodo-Integration-Test");

                services.AddSingleton<TimeProvider>(x => FakeTimeProviderFactory.Create());
            })
            .ConfigureLogging(logging =>
            {
                // remove other logging providers, such as remote loggers or unnecessary event logs
                logging.ClearProviders();
                logging.SetMinimumLevel(LogLevel.Trace);
            })
            .UseNLog()
            .UseEnvironment("IntegrationTesting");
    }
}
