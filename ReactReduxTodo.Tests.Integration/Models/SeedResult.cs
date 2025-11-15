using Microsoft.Extensions.DependencyInjection;

namespace ReactReduxTodo.Tests.Integration.Models;

internal sealed class SeedResult : IDisposable
{
    public required IServiceScope Scope { get; set; }
    public required CustomAppFactory AppFactory { get; set; }

    public void Dispose()
    {
        Scope.Dispose();
        AppFactory.Dispose();
    }
}
