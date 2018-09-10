using Microsoft.AspNetCore.Mvc;
using ReactReduxTodo.Models;
using ReactReduxTodo.Services;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ReactReduxTodo.Controllers
{
    [Route("api/tasks")]
    public class TasksController : Controller
    {
        private readonly TodoTasksService _todoTasksService;

        public TasksController(TodoTasksService todoTasksService)
        {
            _todoTasksService = todoTasksService;
        }

        [HttpGet]
        public async Task<IEnumerable<TodoTask>> List()
        {
            return await _todoTasksService.ListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<TodoTask>> Get(int id)
        {
            var model = await _todoTasksService.GetAsync(id);
            if (model == null)
            {
                return NotFound();
            }
            return model;
        }

        [HttpPost]
        public async Task<ActionResult<int>> Add([FromBody] TodoTask todoTask)
        {
            var id = await _todoTasksService.AddAsync(todoTask);
            return id;
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var success = await _todoTasksService.DeleteAsync(id);
            if (!success)
            {
                return NotFound();
            }
            return Ok();
        }
    }
}
