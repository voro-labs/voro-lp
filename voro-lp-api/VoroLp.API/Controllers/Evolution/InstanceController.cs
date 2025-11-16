using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VoroLp.API.Extensions;
using VoroLp.API.ViewModels;
using VoroLp.Application.DTOs.Evolution.API;
using VoroLp.Application.Services.Interfaces.Evolution;

namespace VoroLp.API.Controllers.Evolution
{
    [Route("api/v{version:version}/[controller]")]
    [Tags("Evolution")]
    [ApiController]
    [Authorize]
    public class InstanceController(IEvolutionService evolutionService) : ControllerBase
    {
        private readonly IEvolutionService _evolutionService = evolutionService;

        [HttpGet("status")]
        public async Task<IActionResult> GetStatus()
        {
            try
            {
                var status = await _evolutionService.GetInstanceStatusAsync();

                return ResponseViewModel<InstanceEventDto>
                    .SuccessWithMessage("Status successful.", status)
                    .ToActionResult();
            }
            catch (Exception ex)
            {
                return ResponseViewModel<InstanceEventDto>
                    .Fail(ex.Message)
                    .ToActionResult();
            }
        }
    }
}
