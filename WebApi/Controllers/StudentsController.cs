using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using WebApi.DTO;
using WebApi.Entities;

namespace WebApi.Controllers;

[ApiController]
[Authorize]
[Route("api/students")]
public class StudentsController : ControllerBase
{
    private readonly UserManager<User> _userManager;
    private readonly IMapper _mapper;

    public StudentsController(UserManager<User> userManager, IMapper mapper)
    {
        _userManager = userManager;
        _mapper = mapper;
    }

    [Authorize(Roles = "Administrator,Teacher")]
    [HttpGet]
    public async Task<IActionResult> GetStudents()
    {
       var students = await _userManager.GetUsersInRoleAsync("Student");
       return Ok(students);
    }

    [Authorize(Roles = "Administrator")]
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
}