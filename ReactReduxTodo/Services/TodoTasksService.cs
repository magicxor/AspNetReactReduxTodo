using System.Collections.Generic;
using System.Data.SqlClient;
using System.Threading.Tasks;
using Dapper;
using Microsoft.Extensions.Configuration;
using ReactReduxTodo.Entities;

namespace ReactReduxTodo.Services
{
    public class TodoTasksService
    {
        private readonly string _connectionString;

        public TodoTasksService(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection");
        }

        public async Task<IEnumerable<TodoTask>> ListAsync()
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                return await connection.QueryAsync<TodoTask>(
                    @"SELECT [entity].[Id], [entity].[Description]
                      FROM [TodoTasks] AS [entity]
                      ORDER BY [entity].[Id];");
            }
        }

        public async Task<TodoTask> GetAsync(int id)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                return await connection.QueryFirstAsync<TodoTask>(
                    @"SELECT TOP 1 [entity].[Id], [entity].[Description]
                      FROM [TodoTasks] AS [entity]
                      WHERE Id = @Id;", new {Id = id});
            }            
        }

        public async Task<int> AddAsync(TodoTask todoTask)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                return await connection.QueryFirstAsync<int>(
                    @"INSERT INTO [TodoTasks] ([Description])
                      VALUES (@Description);
                      SELECT CAST(SCOPE_IDENTITY() as int);", new {Description = todoTask.Description});
            }
        }

        public async Task<bool> DeleteAsync(int id)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var count = await connection.QueryFirstAsync<int>(
                    @"DELETE FROM [TodoTasks]
                      WHERE [Id] = @Id;
                      SELECT @@ROWCOUNT;", new {Id = id});
                return count > 0;
            }
        }
    }
}