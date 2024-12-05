using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;
using WebApi.DTO;
using WebApi.Entities;
using WebApi.JwtFeatures;

namespace WebApi.Controllers;

[ApiController]
[Route("api/accounts")]
public class AccountsController : ControllerBase
{
    private readonly UserManager<User> _userManager;
    private readonly IMapper _mapper;
    private readonly JwtHandler _jwtHandler;

    public AccountsController(UserManager<User> userManager, IMapper mapper, JwtHandler jwtHandler)
    {
        _userManager = userManager;
        _mapper = mapper;
        _jwtHandler = jwtHandler;
    }
    
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] UserForRegistrationDto userForRegistration)
    {
        if (!ModelState.IsValid)
            return BadRequest();

        var user = _mapper.Map<User>(userForRegistration);
        var result = await _userManager.CreateAsync(user, userForRegistration.Password!);
        if (!result.Succeeded)
        {
            var errors = result.Errors.Select(e => e.Description);
            return BadRequest(new RegistrationResponseDto { Errors = errors });
        }

        await _userManager.AddToRoleAsync(user, "Student");

        return StatusCode(201);
    }
    
    [HttpPost("login")]
    public async Task<IActionResult> Login()
    {
        return Ok("test_token");
    }
    
    [HttpPost("login/google")]
    public async Task<IActionResult> ExternalLogin([FromBody] GoogleAuthDto externalAuth)
    {
        // var payload = await _jwtHandler.VerifyGoogleToken(externalAuth);
        // if (payload == null)
        //     return BadRequest("Invalid External Authentication.");
        //
        // var info = new UserLoginInfo(externalAuth.Provider, payload.Subject, externalAuth.Provider);
        //
        // var user = await _userManager.FindByLoginAsync(info.LoginProvider, info.ProviderKey);
        // if (user == null)
        // {
        //     user = await _userManager.FindByEmailAsync(payload.Email);
        //     if (user == null)
        //     {
        //         user = new User { Email = payload.Email, UserName = payload.Email };
        //         await _userManager.CreateAsync(user);
        //
        //         //prepare and send an email for the email confirmation
        //
        //         await _userManager.AddToRoleAsync(user, "Viewer");
        //         await _userManager.AddLoginAsync(user, info);
        //     }
        //     else
        //     {
        //         await _userManager.AddLoginAsync(user, info);
        //     }
        // }
        //
        // if (user == null)
        //     return BadRequest("Invalid External Authentication.");
        //
        // //check for the Locked out account
        // var token = await _jwtHandler.GenerateToken();

        return Ok(new AuthResponseDto { Token = "token_test", IsAuthSuccessful = true });
    }
}