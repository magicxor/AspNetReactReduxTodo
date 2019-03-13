using ReactReduxTodo.Data;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ReactReduxTodo.Entities;

namespace ReactReduxTodo.Services
{
    public class TodoTasksService
    {
        private readonly ApplicationDbContext _applicationDbContext;

        public TodoTasksService(ApplicationDbContext applicationDbContext)
        {
            _applicationDbContext = applicationDbContext;
        }

        public async Task<IList<TodoTask>> ListAsync()
        {
            return await _applicationDbContext.TodoTasks.OrderBy(entity => entity.Id).ToListAsync();
        }

        public async Task<TodoTask> GetAsync(int id)
        {
            return await _applicationDbContext.TodoTasks.FindAsync(id);
        }

        public async Task<int> AddAsync(TodoTask todoTask)
        {
            var entityEntry = await _applicationDbContext.AddAsync(todoTask);
            await _applicationDbContext.SaveChangesAsync();
            return entityEntry.Entity.Id;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var entity = await _applicationDbContext.TodoTasks.FindAsync(id);
            if (entity == null)
            {
                return false;
            }

            try
            {
                _applicationDbContext.Remove(entity);
                await _applicationDbContext.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                return false;
            }

            return true;
        }
    }
}
