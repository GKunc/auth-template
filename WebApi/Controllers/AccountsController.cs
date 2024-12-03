using Microsoft.AspNetCore.Mvc;

namespace WebApi.Controllers;

[ApiController]
[Route("api/accounts")]
public class AccountsController : ControllerBase
{
    [HttpPost("register")]
    public async Task<IActionResult> Register()
    {
        return StatusCode(201);
    }
    
    [HttpPost("login")]
    public async Task<IActionResult> Login()
    {
        return Ok("test_token");
    }
}