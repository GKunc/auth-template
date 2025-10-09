using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using WebApi.DTO;
using WebApi.Entities;

namespace WebApi.Controllers;

[ApiController]
[Authorize]
[Route("api/teachers")]
public class TeachersController : ControllerBase
{
    private readonly UserManager<User> _userManager;
    private readonly IMapper _mapper;
    private static Random random = new Random();
    
    public TeachersController(UserManager<User> userManager, IMapper mapper)
    {
        _userManager = userManager;
        _mapper = mapper;
    }

    public static string RandomString(int length)
    {
        const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        return new string(Enumerable.Repeat(chars, length)
            .Select(s => s[random.Next(s.Length)]).ToArray());
    }
    
    [Authorize(Roles = "Administrator,Teacher,Student")]
    [HttpGet]
    public async Task<IActionResult> GetTeachers()
    {
       var teachers = await _userManager.GetUsersInRoleAsync("Teacher");
       return Ok(teachers);
    }

    [Authorize(Roles = "Administrator")]
    [HttpPost]
    public async Task<IActionResult> Register([FromBody] UserForRegistrationDto userForRegistration)
    {
        if (!ModelState.IsValid)
            return BadRequest();

        var user = _mapper.Map<User>(userForRegistration);
        var password = RandomString(10);
        var result = await _userManager.CreateAsync(user, password);
        if (!result.Succeeded)
        {
            var errors = result.Errors.Select(e => e.Description);
            return BadRequest(new RegistrationResponseDto { Errors = errors });
        }

        await _userManager.AddToRoleAsync(user, "Teacher");

        return StatusCode(201);
    }
}