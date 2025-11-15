using ReactReduxTodo.Data;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ReactReduxTodo.Entities;

namespace ReactReduxTodo.Services;

public class TodoTasksService
{
    private readonly ApplicationDbContext _applicationDbContext;

    public TodoTasksService(ApplicationDbContext applicationDbContext)
    {
        _applicationDbContext = applicationDbContext;
    }

    public async Task<IList<TodoTask>> ListAsync(CancellationToken cancellationToken)
    {
        return await _applicationDbContext.TodoTasks
            .OrderBy(entity => entity.Id)
            .ToListAsync(cancellationToken: cancellationToken);
    }

    public async Task<TodoTask?> GetAsync(int id, CancellationToken cancellationToken)
    {
        return await _applicationDbContext.TodoTasks.FindAsync([id], cancellationToken: cancellationToken);
    }

    public async Task<int> AddAsync(TodoTask todoTask, CancellationToken cancellationToken)
    {
        var entityEntry = await _applicationDbContext.AddAsync(todoTask, cancellationToken);
        await _applicationDbContext.SaveChangesAsync(cancellationToken);
        return entityEntry.Entity.Id;
    }

    public async Task<bool> DeleteAsync(int id, CancellationToken cancellationToken)
    {
        var rowsDeleted = await _applicationDbContext.TodoTasks
            .Where(t => t.Id == id)
            .ExecuteDeleteAsync(cancellationToken: cancellationToken);
        
        return rowsDeleted > 0;
    }
}
