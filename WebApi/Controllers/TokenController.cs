using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebApi.Data;
using WebApi.DTO;
using WebApi.JwtFeatures;

namespace WebApi.Controllers;

[Route("api/token")]
[ApiController]
public class TokenController : ControllerBase
{
    private readonly ApplicationDbContext _dbContext;
    private readonly JwtHandler _JwtHandler;

    public TokenController(ApplicationDbContext dbContext, JwtHandler JwtHandler)
    {
        this._dbContext = dbContext ?? throw new ArgumentNullException(nameof(dbContext));
        this._JwtHandler = JwtHandler ?? throw new ArgumentNullException(nameof(JwtHandler));
    }

    [HttpPost]
    [Route("refresh")]
    public async Task<IActionResult> Refresh(RefreshTokeDto token)
    {
        if (token is null)
            return BadRequest("Invalid client request");

        string accessToken = token.AccessToken;
        string refreshToken = token.RefreshToken;

        var principal = _JwtHandler.GetPrincipalFromExpiredToken(accessToken);
        var username = principal.Identity.Name; //this is mapped to the Name claim by default

        var user = _dbContext.Users.SingleOrDefault(u => u.UserName == username);

        if (user is null || user.RefreshToken != refreshToken || user.RefreshTokenExpiryTime <= DateTime.Now)
            return BadRequest("Invalid client request");

        var newAccessToken = await _JwtHandler.GenerateToken(user);
        var newRefreshToken = _JwtHandler.GenerateRefreshToken();

        user.RefreshToken = newRefreshToken;
        await _dbContext.SaveChangesAsync();

        return Ok(new AuthResponseDto()
        {
            IsAuthSuccessful = true,
            AccessToken = newAccessToken,
            RefreshToken = newRefreshToken
        });
    }

    [HttpPost]
    [Authorize]
    [Route("revoke")]
    public async Task<IActionResult> Revoke()
    {
        var username = User.Identity.Name;

        var user = _dbContext.Users.SingleOrDefault(u => u.UserName == username);
        if (user == null) return BadRequest();

        user.RefreshToken = null;

        await _dbContext.SaveChangesAsync();

        return NoContent();
    }
}