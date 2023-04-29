# AspNetReactReduxTodo

[![Unit Tests](https://github.com/magicxor/AspNetReactReduxTodo/actions/workflows/unit-tests.yml/badge.svg)](https://github.com/magicxor/AspNetReactReduxTodo/actions/workflows/unit-tests.yml)

Hello world app on the following stack:

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


[demo](https://user-images.githubusercontent.com/8275793/235323620-82afed36-13a2-4118-9f38-0eba9b0845c3.mp4)


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
