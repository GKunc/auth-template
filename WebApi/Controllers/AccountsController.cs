using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using WebApi.DTO;
using WebApi.Entities;
using WebApi.JwtFeatures;

namespace WebApi.Controllers;

[ApiController]
[Route("api/accounts")]
public class AccountsController : ControllerBase
{
    private readonly UserManager<User> _userManager;
    private readonly JwtHandler _jwtHandler;

    public AccountsController(UserManager<User> userManager, JwtHandler jwtHandler)
    {
        _userManager = userManager;
        _jwtHandler = jwtHandler;
    }

    
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] UserForAuthenticationDto userForAuthentication)
    {
        var user = await _userManager.FindByNameAsync(userForAuthentication.Email!);
        if (user == null)
            return BadRequest("Invalid Request");

        if (!await _userManager.IsEmailConfirmedAsync(user))
            return Unauthorized(new AuthResponseDto { ErrorMessage = "Email is not confirmed" });

        if (!await _userManager.CheckPasswordAsync(user, userForAuthentication.Password!))
        {
            await _userManager.AccessFailedAsync(user);

            if (await _userManager.IsLockedOutAsync(user))
            {
                return Unauthorized(new AuthResponseDto { ErrorMessage = "The account is locked out" });
            }

            return Unauthorized(new AuthResponseDto { ErrorMessage = "Invalid Authentication" });
        }

        var token = await _jwtHandler.GenerateToken(user);
        var refreshToken = _jwtHandler.GenerateRefreshToken();

        await _userManager.ResetAccessFailedCountAsync(user);
        
        user.RefreshToken = refreshToken;
        user.RefreshTokenExpiryTime = DateTime.SpecifyKind(DateTime.Now.AddMinutes(7), DateTimeKind.Utc);

        await _userManager.UpdateAsync(user);
        
        return Ok(new AuthResponseDto { IsAuthSuccessful = true, AccessToken = token, RefreshToken = refreshToken });
    }
    
    [HttpPost("login/google")]
    public async Task<IActionResult> ExternalLogin([FromBody] GoogleAuthDto externalAuth)
    {
        var payload = await _jwtHandler.VerifyGoogleToken(externalAuth);
        
        var info = new UserLoginInfo(externalAuth.Provider!, payload.Subject, externalAuth.Provider);
        
        var user = await _userManager.FindByLoginAsync(info.LoginProvider, info.ProviderKey);
        if (user == null)
        {
            user = await _userManager.FindByEmailAsync(payload.Email);
            if (user == null)
            {
                user = new User { Email = payload.Email, UserName = payload.Email };
                await _userManager.CreateAsync(user);
                await _userManager.AddToRoleAsync(user, "Viewer");
                await _userManager.AddLoginAsync(user, info);
            }
            else
            {
                await _userManager.AddLoginAsync(user, info);
            }
        }
        
        var token = await _jwtHandler.GenerateToken(user);
        var refreshToken = _jwtHandler.GenerateRefreshToken();

        return Ok(new AuthResponseDto { AccessToken = token, RefreshToken = refreshToken, IsAuthSuccessful = true });
    }
}