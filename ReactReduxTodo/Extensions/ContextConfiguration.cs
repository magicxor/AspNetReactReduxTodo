using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;

namespace ReactReduxTodo.Extensions;

public static class ContextConfiguration
{
    public static readonly Action<SqlServerDbContextOptionsBuilder> SqlServerOptionsAction = sql
        => sql.UseQuerySplittingBehavior(QuerySplittingBehavior.SingleQuery);
}
