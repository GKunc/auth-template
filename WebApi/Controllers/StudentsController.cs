using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;
using WebApi.DTO;
using WebApi.Entities;
using WebApi.Services;

namespace WebApi.Controllers;

[ApiController]
[Authorize]
[Route("api/students")]
public class StudentsController : ControllerBase
{
    private readonly UserManager<User> _userManager;
    private readonly IEmailService _emailService;
    private readonly IMapper _mapper;

    public StudentsController(UserManager<User> userManager, IEmailService emailService,IMapper mapper)
    {
        _userManager = userManager;
        _emailService = emailService;
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

        var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);
        Console.WriteLine(token);
        var param = new Dictionary<string, string?>
        {
            {"token", token },
            {"email", user.Email }
        };
        var callback = QueryHelpers.AddQueryString("http://localhost:4400", param);
        var message = new EmailMessage([user.Email], "Email Confirmation token", callback, null);
        await _emailService.SendEmailAsync(message);
        
        await _userManager.AddToRoleAsync(user, "Student");

        return StatusCode(201);
    }
}