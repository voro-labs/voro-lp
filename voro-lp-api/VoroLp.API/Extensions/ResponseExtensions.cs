using VoroLp.API.ViewModels;
using Microsoft.AspNetCore.Mvc;

namespace VoroLp.API.Extensions
{
    public static class ResponseExtensions
    {
        public static IActionResult ToActionResult<T>(this ResponseViewModel<T> response) where T : class?
        {
            var statusCodeResult = response.Status switch
            {
                >= 200 and < 300 => new ObjectResult(response) { StatusCode = response.Status },
                >= 400 and < 500 => new BadRequestObjectResult(response) { StatusCode = response.Status },
                >= 500 => new ObjectResult(response) { StatusCode = response.Status },
                _ => new ObjectResult(response) { StatusCode = StatusCodes.Status500InternalServerError }
            };

            return statusCodeResult;
        }
    }
}
