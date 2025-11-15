using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ReactReduxTodo.Dto;
using ReactReduxTodo.Models;
using ReactReduxTodo.Services;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http.HttpResults;
using ReactReduxTodo.Entities;

namespace ReactReduxTodo.Controllers;

[Route("api/tasks")]
[Produces("application/json")]
[Consumes("application/json")]
[ApiController]
public sealed class TasksController : ControllerBase
{
    private readonly TodoTasksService _todoTasksService;

    public TasksController(TodoTasksService todoTasksService)
    {
        _todoTasksService = todoTasksService;
    }

    [HttpGet("", Name = "TasksList")]
    public async Task<IEnumerable<TodoTask>> List(CancellationToken cancellationToken)
    {
        return await _todoTasksService.ListAsync(cancellationToken);
    }

    [HttpGet("{id:int}", Name = "TasksGet")]
    public async Task<Results<Ok<TodoTask>, NotFound<ApiErrorResult>, InternalServerError<ApiErrorResult>>> Get([FromRoute] int id, CancellationToken cancellationToken)
    {
        var model = await _todoTasksService.GetAsync(id, cancellationToken);

        if (model == null)
        {
            return TypedResults.NotFound(new ApiErrorResult(StatusCodes.Status404NotFound, "Not found", $"Entity {id} not found"));
        }

        return TypedResults.Ok(model);
    }

    [HttpPost("", Name = "TasksAdd")]
    public async Task<Results<Created<TodoTaskAddResult>, InternalServerError<ApiErrorResult>>> Add([FromBody] TodoTask todoTask, CancellationToken cancellationToken)
    {
        var id = await _todoTasksService.AddAsync(todoTask, cancellationToken);
        var result = new TodoTaskAddResult { Id = id };

        var location = Url.Action(nameof(Add), new { id });
        return TypedResults.Created(location, result);
    }

    [HttpDelete("{id:int}", Name = "TasksDelete")]
    public async Task<Results<Ok<TodoTaskDeleteResult>, NotFound<ApiErrorResult>, InternalServerError<ApiErrorResult>>> Delete([FromRoute] int id, CancellationToken cancellationToken)
    {
        var success = await _todoTasksService.DeleteAsync(id, cancellationToken);
        var result = new TodoTaskDeleteResult { Id = id };

        if (!success)
        {
            return TypedResults.NotFound(new ApiErrorResult(StatusCodes.Status404NotFound, "Not found", $"Entity {id} not found"));
        }

        return TypedResults.Ok(result);
    }
}
