# AspNetReactReduxTodo
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

### Usage
To run this application in development environment, you should run front-end and back-end projects separately:

- Back-end:
```
dotnet run
```
will be availiable on `http://localhost:5000/api/[actionName]` and `http://localhost:5000/swagger`

- Front-end:
```
npm install
npm start
```
will be availiable on `http://localhost:3000/`
