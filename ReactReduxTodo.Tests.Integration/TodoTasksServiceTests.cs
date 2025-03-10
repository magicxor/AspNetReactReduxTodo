using System.Data;
using System.Data.Common;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using ReactReduxTodo.Data;
using ReactReduxTodo.Entities;
using ReactReduxTodo.Services;
using ReactReduxTodo.Tests.Integration.Constants;
using ReactReduxTodo.Tests.Integration.Services;
using Respawn;

namespace ReactReduxTodo.Tests.Integration;

/// <summary>
/// This test uses a Docker container to run a Microsoft SQL Server instance.
/// </summary>
[TestFixture]
public class TodoTasksServiceTests
{
    private Respawner? _respawner;
    private MsSqlContainerManager? _dbContainerManager;
    private DbConnection? _dbConnection;
    private DbContextOptions<ApplicationDbContext>? _dbContextOptions;

    [OneTimeSetUp]
    public async Task OneTimeSetUp()
    {
        _dbContainerManager = new MsSqlContainerManager();
        var containerInfo = await _dbContainerManager.StartAsync();

        var msSqlDockerConnectionString =
            $"Server=tcp:{containerInfo.Host},{containerInfo.Port};Encrypt=False;Database=AspNetReactReduxTodo;MultipleActiveResultSets=true;User ID=SA;Password={Defaults.DbPassword}";

        _dbContextOptions = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseSqlServer(msSqlDockerConnectionString)
            .Options;
        await using var dbContext = new ApplicationDbContext(_dbContextOptions);
        await dbContext.Database.MigrateAsync();

        _dbConnection = new SqlConnection(msSqlDockerConnectionString);
        await _dbConnection.OpenAsync();

        _respawner = await Respawner.CreateAsync(_dbConnection, new RespawnerOptions
        {
            DbAdapter = DbAdapter.SqlServer,
            SchemasToInclude = ["dbo"],
        });
    }

    [OneTimeTearDown]
    public async Task OneTimeTearDown()
    {
        _respawner = null;
        
        if (_dbConnection != null)
        {
            if (_dbConnection.State == ConnectionState.Open)
            {
                await _dbConnection.CloseAsync();
            }

            await _dbConnection.DisposeAsync();
        }

        if (_dbContainerManager != null)
        {
            await _dbContainerManager.StopAsync();
        }
    }

    private async Task ResetDatabaseAsync()
    {
        if (_respawner != null && _dbConnection != null)
        {
            await _respawner.ResetAsync(_dbConnection);
        }
        else if (_respawner == null)
        {
            throw new Exception($"{nameof(_respawner)} == null");
        }
        else if (_dbConnection == null)
        {
            throw new Exception($"{nameof(_dbConnection)} == null");
        }
    }

    [SetUp]
    public async Task SetUp()
    {
        await ResetDatabaseAsync();
    }

    private ApplicationDbContext BuildDbContextAsync()
    {
        if (_dbContextOptions != null)
        {
            return new ApplicationDbContext(_dbContextOptions);
        }
        else
        {
            throw new Exception($"{nameof(_dbContextOptions)} == null");
        }
    }
    
    [Test]
    public async Task TestListAsync()
    {
        await using var dbContext = BuildDbContextAsync();
        var expectedTasks = new List<TodoTask>
        {
            new() { Description = "a" },
            new() { Description = "ab" },
            new() { Description = "abc" },
        };
        await dbContext.TodoTasks.AddRangeAsync(expectedTasks);
        await dbContext.SaveChangesAsync();

        var todoTasksService = new TodoTasksService(dbContext);
        var tasks = await todoTasksService.ListAsync();
        
        Assert.That(tasks, Has.Count.EqualTo(expectedTasks.Count));
        Assert.That(tasks, Is.EquivalentTo(expectedTasks)
            .Using<TodoTask,TodoTask>((act, exp) => act.Description == exp.Description));
    }
    
    [Test]
    public async Task TestGetAsync()
    {
        await using var dbContext = BuildDbContextAsync();
        var expectedTask = new TodoTask { Description = "abc" };
        await dbContext.TodoTasks.AddAsync(expectedTask);
        await dbContext.SaveChangesAsync();

        var todoTasksService = new TodoTasksService(dbContext);
        var task = await todoTasksService.GetAsync(expectedTask.Id);
        
        Assert.That(task, Is.EqualTo(expectedTask)
            .Using<TodoTask,TodoTask>((act, exp) => act.Description == exp.Description));
    }
    
    [Test]
    public async Task TestAddAsync()
    {
        await using var dbContext = BuildDbContextAsync();
        var expectedTask = new TodoTask { Description = "abc" };

        var todoTasksService = new TodoTasksService(dbContext);
        var taskId = await todoTasksService.AddAsync(expectedTask);
        
        Assert.That(taskId, Is.GreaterThan(0));
        
        var actualTask = await dbContext.TodoTasks.FindAsync(taskId);
        
        Assert.That(actualTask, Is.EqualTo(expectedTask)
            .Using<TodoTask,TodoTask>((act, exp) => act.Description == exp.Description));

        var tasks = await dbContext.TodoTasks.ToListAsync();
        Assert.That(tasks, Has.Count.EqualTo(1));
    }
    
    [Test]
    public async Task TestDeleteAsync()
    {
        await using var dbContext = BuildDbContextAsync();
        var expectedTask = new TodoTask { Description = "abc" };
        await dbContext.TodoTasks.AddAsync(expectedTask);
        await dbContext.SaveChangesAsync();
        
        var todoTasksService = new TodoTasksService(dbContext);
        var result = await todoTasksService.DeleteAsync(expectedTask.Id);
        
        Assert.That(result, Is.True);
        
        var tasks = await dbContext.TodoTasks.ToListAsync();
        Assert.That(tasks, Has.Count.EqualTo(0));
    }
}
