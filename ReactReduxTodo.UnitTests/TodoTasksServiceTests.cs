using System.Data;
using System.Data.Common;
using System.Diagnostics;
using System.Diagnostics.CodeAnalysis;
using DotNet.Testcontainers.Builders;
using DotNet.Testcontainers.Containers;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using ReactReduxTodo.Data;
using ReactReduxTodo.Entities;
using ReactReduxTodo.Services;
using Respawn;

namespace ReactReduxTodo.UnitTests;

/// <summary>
/// This test uses a Docker container to run a Microsoft SQL Server instance.
/// </summary>
[TestFixture]
public class TodoTasksServiceTests
{
    private const string MsSqlDockerImage = "mcr.microsoft.com/mssql/server:2022-latest";
    private const string MsSqlStartLogMessage = "The tempdb database has";
    private static readonly TimeSpan DbStartTimeout = TimeSpan.FromMinutes(5);
    private const string MsSqlPassword = "dev_pass_sm234Jm";
    private const ushort MsSqlContainerPort = 1433;
    private static readonly string MsSqlDockerContainerName = Guid.NewGuid().ToString("D");
    
    private ushort? _msSqlHostPort;
    private string? _msSqlDockerConnectionString;
    private IContainer? _dbContainer;
    private DbConnection? _dbConnection;
    private Respawner? _respawner;
    private DbContextOptions<ApplicationDbContext>? _dbContextOptions;

    private static void WriteProgressMessage([StringSyntax(StringSyntaxAttribute.CompositeFormat)] string message, params object?[] arg)
    {
        TestContext.Progress.WriteLine(message, arg);
    }

    [OneTimeSetUp]
    public async Task OneTimeSetUp()
    {
        Trace.Listeners.Add(new ConsoleTraceListener());
        
        WriteProgressMessage($"Performing {nameof(OneTimeSetUp)}");
        
        _dbContainer = new ContainerBuilder()
            .WithName(MsSqlDockerContainerName)
            .WithImage(MsSqlDockerImage)
            .WithExposedPort(MsSqlContainerPort)
            .WithPortBinding(MsSqlContainerPort, true)
            .WithEnvironment(new Dictionary<string, string>
            {
                {"MSSQL_IP_ADDRESS", "0.0.0.0"},
                {"MSSQL_PID", "Developer"},
                {"ACCEPT_EULA", "Y"},
                {"MSSQL_SA_PASSWORD", MsSqlPassword},
                {"PATH", "/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"},
            })
            .WithWaitStrategy(Wait
                .ForUnixContainer()
                .UntilMessageIsLogged(MsSqlStartLogMessage))
            .WithAutoRemove(true)
            .WithCleanUp(true)
            .Build();
        
        _dbContainer.Creating += DbContainerOnCreating;
        _dbContainer.Created += DbContainerOnCreated;
        _dbContainer.Starting += DbContainerOnStarting;
        _dbContainer.Started += DbContainerOnStarted;
        _dbContainer.Stopping += DbContainerOnStopping;
        _dbContainer.Stopped += DbContainerOnStopped;
        
        using (var cancellationTokenSource = new CancellationTokenSource(DbStartTimeout))
        {
            var cancellationToken = cancellationTokenSource.Token;
            await _dbContainer.StartAsync(cancellationToken);
        }

        _msSqlHostPort = _dbContainer.GetMappedPublicPort(MsSqlContainerPort);
        _msSqlDockerConnectionString =
            $"Server=tcp:localhost,{_msSqlHostPort};Encrypt=False;Database=AspNetReactReduxTodo;MultipleActiveResultSets=true;User ID=SA;Password={MsSqlPassword}";
        
        _dbContextOptions = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseSqlServer(_msSqlDockerConnectionString)
            .Options;
        await using var dbContext = new ApplicationDbContext(_dbContextOptions);
        await dbContext.Database.MigrateAsync();

        _dbConnection = new SqlConnection(_msSqlDockerConnectionString);
        await _dbConnection.OpenAsync();

        _respawner = await Respawner.CreateAsync(_dbConnection, new RespawnerOptions
        {
            DbAdapter = DbAdapter.SqlServer,
            SchemasToInclude = new[] {"dbo"},
        });
    }
    
    private void LogWithContainerInfo(string message)
    {
        WriteProgressMessage(message + " host port = {0}, container port = {1}, image = {2}, container name = {3}", 
            _msSqlHostPort,
            MsSqlContainerPort,
            MsSqlDockerImage,
            MsSqlDockerContainerName);
    }

    private void DbContainerOnStopped(object? sender, EventArgs e)
    {
        LogWithContainerInfo("DB container stopped:");
    }

    private void DbContainerOnStopping(object? sender, EventArgs e)
    {
        LogWithContainerInfo("Stopping DB container:");
    }

    private void DbContainerOnStarted(object? sender, EventArgs e)
    {
        LogWithContainerInfo("DB container started:");
    }

    private void DbContainerOnStarting(object? sender, EventArgs e)
    {
        LogWithContainerInfo("Starting DB container:");
    }

    private void DbContainerOnCreated(object? sender, EventArgs e)
    {
        LogWithContainerInfo("DB container created:");
    }

    private void DbContainerOnCreating(object? sender, EventArgs e)
    {
        LogWithContainerInfo("Creating DB container:");
    }

    [OneTimeTearDown]
    public async Task OneTimeTearDown()
    {
        WriteProgressMessage($"Performing {nameof(OneTimeTearDown)}");
        
        _respawner = null;
        
        if (_dbConnection != null)
        {
            if (_dbConnection.State == ConnectionState.Open)
            {
                await _dbConnection.CloseAsync();
            }

            await _dbConnection.DisposeAsync();
        }

        if (_dbContainer != null)
        {
            await _dbContainer.StopAsync();
            await _dbContainer.DisposeAsync();
        }
        
        Trace.Flush();
    }

    private async Task ResetDatabaseAsync()
    {
        WriteProgressMessage($"Performing {nameof(ResetDatabaseAsync)}");
        
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