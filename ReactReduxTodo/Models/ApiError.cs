namespace ReactReduxTodo.Models;

public sealed class ApiError
{
    public int Code { get; set; }
    public string? Header { get; set; }
    public string? Message { get; set; }
}
