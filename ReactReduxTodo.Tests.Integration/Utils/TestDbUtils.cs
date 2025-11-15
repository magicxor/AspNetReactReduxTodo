using Microsoft.EntityFrameworkCore;
using ReactReduxTodo.Data;
using ReactReduxTodo.Extensions;
using ReactReduxTodo.Tests.Integration.Constants;
using ReactReduxTodo.Tests.Integration.Services;

namespace ReactReduxTodo.Tests.Integration.Utils;

internal static class TestDbUtils
{
    public static string GetExactConnectionString(string host, ushort port, string db, string password)
    {
        return $"Server=tcp:{host},{port};Encrypt=False;Database={db};MultipleActiveResultSets=true;User ID=SA;Password={password};Persist Security Info=False;TrustServerCertificate=True;MultiSubnetFailover=True";
    }

    private static string GetRandomizedConnectionString(string host, ushort port, string db, string password = TestDefaults.DbPassword)
    {
        return GetExactConnectionString(host, port, db + Guid.NewGuid().ToString("D"), password);
    }

    private static ApplicationDbContext CreateApplicationDbContext(string connectionString)
    {
        var dbContextOptions = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseSqlServer(connectionString, ContextConfiguration.SqlServerOptionsAction)
            .Options;
        return new ApplicationDbContext(dbContextOptions);
    }

    private static string CreateNewRandomConnectionString()
    {
        return GetRandomizedConnectionString(GlobalSetUp.DbHost, GlobalSetUp.DbPort, TestDefaults.DbName);
    }

    /// <summary>
    /// Creates an empty <see cref="ApplicationDbContext"/> database with a random name.
    /// </summary>
    public static async Task<RespawnableContextManager<ApplicationDbContext>> CreateNewRandomDbContextManagerAsync()
    {
        var connectionString = CreateNewRandomConnectionString();
        var respawnableContextMgr = new RespawnableContextManager<ApplicationDbContext>(connectionString, CreateApplicationDbContext);
        return respawnableContextMgr;
    }
}
