using JetBrains.Annotations;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using ReactReduxTodo.Data;
using ReactReduxTodo.Entities;
using ReactReduxTodo.Services;
using ReactReduxTodo.Tests.Integration.Constants;
using ReactReduxTodo.Tests.Integration.Extensions;
using ReactReduxTodo.Tests.Integration.Models;
using ReactReduxTodo.Tests.Integration.Services;
using ReactReduxTodo.Tests.Integration.Utils;

namespace ReactReduxTodo.Tests.Integration.Tests;

/// <summary>
/// This test uses a Docker container to run a Microsoft SQL Server instance.
/// </summary>
[TestFixture]
[Parallelizable(scope: ParallelScope.Fixtures)]
public sealed class TodoTasksServiceTests
{
    private RespawnableContextManager<ApplicationDbContext>? _contextManager;

    [OneTimeSetUp]
    public async Task OneTimeSetUpAsync()
    {
        _contextManager = await TestDbUtils.CreateNewRandomDbContextManagerAsync();
    }

    [OneTimeTearDown]
    public async Task OneTimeTearDownAsync()
    {
        await _contextManager.StopIfNotNullAsync();
    }

    [MustDisposeResource]
    private async Task<SeedResult> Seed(CancellationToken cancellationToken)
    {
        var connectionString = await _contextManager!.CreateRespawnedDbConnectionStringAsync();
        var customAppFactory = new CustomAppFactory(connectionString);

        var scope = customAppFactory.Services.GetRequiredService<IServiceScopeFactory>().CreateScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

        if ((await dbContext.Database.GetPendingMigrationsAsync(cancellationToken)).Any())
        {
            await dbContext.Database.MigrateAsync(cancellationToken);
        }

        return new SeedResult
        {
            Scope = scope,
            AppFactory = customAppFactory,
        };
    }

    [CancelAfter(TestDefaults.TestTimeout)]
    [Test]
    public async Task TestListAsync(CancellationToken cancellationToken)
    {
        using var seedResult = await Seed(cancellationToken);
        var dbContext = seedResult.AppFactory.Services.GetRequiredService<ApplicationDbContext>();

        var expectedTasks = new List<TodoTask>
        {
            new() { Description = "a" },
            new() { Description = "ab" },
            new() { Description = "abc" },
        };
        await dbContext.TodoTasks.AddRangeAsync(expectedTasks, cancellationToken);
        await dbContext.SaveChangesAsync(cancellationToken);

        var todoTasksService = new TodoTasksService(dbContext);
        var tasks = await todoTasksService.ListAsync(cancellationToken);

        Assert.That(tasks, Has.Count.EqualTo(expectedTasks.Count));
        Assert.That(tasks, Is.EquivalentTo(expectedTasks)
            .Using<TodoTask, TodoTask>((act, exp) => act.Description == exp.Description));
    }

    [CancelAfter(TestDefaults.TestTimeout)]
    [Test]
    public async Task TestGetAsync(CancellationToken cancellationToken)
    {
        using var seedResult = await Seed(cancellationToken);
        var dbContext = seedResult.AppFactory.Services.GetRequiredService<ApplicationDbContext>();

        var expectedTask = new TodoTask { Description = "abc" };
        await dbContext.TodoTasks.AddAsync(expectedTask, cancellationToken);
        await dbContext.SaveChangesAsync(cancellationToken);

        var todoTasksService = new TodoTasksService(dbContext);
        var task = await todoTasksService.GetAsync(expectedTask.Id, cancellationToken);

        Assert.That(task, Is.EqualTo(expectedTask)
            .Using<TodoTask, TodoTask>((act, exp) => act.Description == exp.Description));
    }

    [CancelAfter(TestDefaults.TestTimeout)]
    [Test]
    public async Task TestAddAsync(CancellationToken cancellationToken)
    {
        using var seedResult = await Seed(cancellationToken);
        var dbContext = seedResult.AppFactory.Services.GetRequiredService<ApplicationDbContext>();

        var expectedTask = new TodoTask { Description = "abc" };

        var todoTasksService = new TodoTasksService(dbContext);
        var taskId = await todoTasksService.AddAsync(expectedTask, cancellationToken);

        Assert.That(taskId, Is.GreaterThan(0));

        var actualTask = await dbContext.TodoTasks.FindAsync([taskId], cancellationToken: cancellationToken);

        Assert.That(actualTask, Is.EqualTo(expectedTask)
            .Using<TodoTask, TodoTask>((act, exp) => act.Description == exp.Description));

        var tasks = await dbContext.TodoTasks.ToListAsync(cancellationToken: cancellationToken);
        Assert.That(tasks, Has.Count.EqualTo(1));
    }

    [CancelAfter(TestDefaults.TestTimeout)]
    [Test]
    public async Task TestDeleteAsync(CancellationToken cancellationToken)
    {
        using var seedResult = await Seed(cancellationToken);
        var dbContext = seedResult.AppFactory.Services.GetRequiredService<ApplicationDbContext>();

        var expectedTask = new TodoTask { Description = "abc" };
        await dbContext.TodoTasks.AddAsync(expectedTask, cancellationToken);
        await dbContext.SaveChangesAsync(cancellationToken);

        var todoTasksService = new TodoTasksService(dbContext);
        var result = await todoTasksService.DeleteAsync(expectedTask.Id, cancellationToken);

        Assert.That(result, Is.True);

        var tasks = await dbContext.TodoTasks.ToListAsync(cancellationToken: cancellationToken);
        Assert.That(tasks, Has.Count.EqualTo(0));
    }
}
