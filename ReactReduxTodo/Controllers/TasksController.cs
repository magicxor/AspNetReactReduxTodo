using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;
using ReactReduxTodo.Models;
using ReactReduxTodo.Services;

namespace ReactReduxTodo.Controllers
{
    [Route("api/[controller]")]
    public class TasksController : Controller
    {
        private readonly TodoTasksService _todoTasksService;
        
        public TasksController(TodoTasksService todoTasksService)
        {
            _todoTasksService = todoTasksService;
        }

        [HttpGet("")]
        public async Task<IEnumerable<TodoTask>> List()
        {
            return await _todoTasksService.ListAsync();
        }

        [HttpGet("/{id}")]
        public async Task<TodoTask> Get(int id)
        {
            return await _todoTasksService.GetAsync(id);
        }

        [HttpPost("")]
        public async Task<int> Add([FromBody] TodoTask todoTask)
        {
            var id = await _todoTasksService.AddAsync(todoTask);
            return id;
        }

        [HttpDelete("")]
        public async Task<IActionResult> Delete([FromBody] int id)
        {
            await _todoTasksService.DeleteAsync(id);
            return Ok();
        }
    }
}
