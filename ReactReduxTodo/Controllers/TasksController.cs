using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ReactReduxTodo.Dto;
using ReactReduxTodo.Models;
using ReactReduxTodo.Services;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ReactReduxTodo.Controllers
{
    [Route("api/tasks")]
    [Produces("application/json")]
    [ApiController]
    public class TasksController : Controller
    {
        private readonly TodoTasksService _todoTasksService;

        public TasksController(TodoTasksService todoTasksService)
        {
            _todoTasksService = todoTasksService;
        }

        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<TodoTask>), StatusCodes.Status200OK)]
        public async Task<IEnumerable<TodoTask>> List()
        {
            return await _todoTasksService.ListAsync();
        }

        [HttpGet("{id}")]
        [ProducesResponseType(typeof(TodoTask), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiErrorResult), StatusCodes.Status404NotFound)]
        public async Task<ActionResult<TodoTask>> Get(int id)
        {
            var model = await _todoTasksService.GetAsync(id);
            if (model == null)
            {
                return NotFound(new ApiErrorResult(StatusCodes.Status404NotFound, "Not found", $"Entity {id} not found"));
            }
            return model;
        }

        [HttpPost]
        [ProducesResponseType(typeof(TodoTaskAddResult), StatusCodes.Status201Created)]
        public async Task<ActionResult<TodoTaskAddResult>> Add([FromBody] TodoTask todoTask)
        {
            var id = await _todoTasksService.AddAsync(todoTask);
            var result = new TodoTaskAddResult { Id = id };
            return CreatedAtAction(nameof(Get), new { id }, result);
        }

        [HttpDelete("{id}")]
        [ProducesResponseType(typeof(TodoTaskDeleteResult), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiErrorResult), StatusCodes.Status404NotFound)]
        public async Task<ActionResult<TodoTaskDeleteResult>> Delete(int id)
        {
            var success = await _todoTasksService.DeleteAsync(id);
            var result = new TodoTaskDeleteResult { Id = id };

            if (!success)
            {
                return NotFound(new ApiErrorResult(StatusCodes.Status404NotFound, "Not found", $"Entity {id} not found"));
            }
            return result;
        }
    }
}
