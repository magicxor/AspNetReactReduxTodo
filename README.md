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
will be availiable on https://localhost:5001/api/[actionName] and https://localhost:5001/swagger

- Front-end:
```
npm install
npm start
```
will be availiable on http://localhost:3000/

To build this application in production mode go to Back-end project directory and run:
```
dotnet publish --self-contained -c Release -r win10-x64
```