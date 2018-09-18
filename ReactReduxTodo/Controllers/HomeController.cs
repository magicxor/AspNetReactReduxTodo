using Microsoft.AspNetCore.Mvc;

namespace ReactReduxTodo.Controllers
{
    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            return RedirectToRoutePermanent("react");
        }
    }
}
