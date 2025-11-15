using Microsoft.EntityFrameworkCore;
using ReactReduxTodo.Tests.Integration.Services;

namespace ReactReduxTodo.Tests.Integration.Extensions;

internal static class RespawnableContextManagerExtensions
{
    public static async Task StopIfNotNullAsync<T>(this RespawnableContextManager<T>? respawnableContextManager)
        where T : DbContext
    {
        if (respawnableContextManager != null)
        {
            await respawnableContextManager.DeinitializeAsync();
            respawnableContextManager.Dispose();
        }
    }
}
