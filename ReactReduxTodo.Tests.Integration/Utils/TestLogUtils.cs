namespace ReactReduxTodo.Tests.Integration.Utils;

public static class TestLogUtils
{
    private static readonly TimeProvider TimeProvider = TimeProvider.System;

    public static void WriteProgressMessage(string message)
    {
        var now = TimeProvider.GetLocalNow();
        TestContext.Progress.WriteLine($"{now:HH:mm:ss.fff} " + message);
    }
}
