# AspNetReactReduxTodo

[![Unit Tests](https://github.com/magicxor/AspNetReactReduxTodo/actions/workflows/unit-tests.yml/badge.svg)](https://github.com/magicxor/AspNetReactReduxTodo/actions/workflows/unit-tests.yml)
![Endpoint Badge](https://img.shields.io/endpoint?url=https%3A%2F%2Fgist.githubusercontent.com%2Fmagicxor%2Fd65b6e3ef87f1cee894fe9aa6032ce81%2Fraw%2FAspNetReactReduxTodo-cobertura-coverage.json)
[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/magicxor/AspNetReactReduxTodo)

A "hello world" app on the following stack:

- Back-end
  - ASP.NET Core Web API
  - Entity Framework Core
  - Microsoft SQL Server
  - Open API (Swashbuckle)
- Front-end
  - React
  - React-Redux
  - Redux-Saga
  - Bootstrap


https://user-images.githubusercontent.com/8275793/235338371-01c1edec-4343-4567-95ec-3a8c7fb0c085.mp4


### Usage
To run this application in development environment, you should run front-end and back-end projects separately:

- Back-end:
```powershell
sqllocaldb start
dotnet ef database update --project ReactReduxTodo
dotnet run
```
will be availiable on `http://localhost:5000/api/[actionName]` and `http://localhost:5000/swagger`

- Front-end:
```powershell
npm install
npm start
```
will be availiable on `http://localhost:3000/`
