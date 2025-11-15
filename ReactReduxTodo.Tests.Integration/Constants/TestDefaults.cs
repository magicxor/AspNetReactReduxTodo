namespace ReactReduxTodo.Tests.Integration.Constants;

internal static class TestDefaults
{
    public const string DbPassword = "mdkoe@ri^_SDFSFD@@4958$jsdihuq";
    public const string DbName = "ReactReduxTodo_tests";
    public const int DbPort = 1433;
    public const int TestTimeout = 20 * 1000; /* 20 seconds */
    public static readonly TimeSpan DbStartTimeout = TimeSpan.FromMinutes(2);
}
