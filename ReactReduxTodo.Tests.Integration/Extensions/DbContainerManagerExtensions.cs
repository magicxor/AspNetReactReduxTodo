using ReactReduxTodo.Tests.Integration.Services;

namespace ReactReduxTodo.Tests.Integration.Extensions;

internal static class DbContainerManagerExtensions
{
    public static async Task StopIfNotNullAsync(this DbContainerManager? containerManager)
    {
        if (containerManager != null)
        {
            await containerManager.StopAsync();
        }
    }
}
