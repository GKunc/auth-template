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
    private static Random random = new Random();

    public static string RandomString(int length)
    {
        const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        return "a1!" + new string(Enumerable.Repeat(chars, length)
            .Select(s => s[random.Next(s.Length)]).ToArray());
    }
    
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
        var password = RandomString(10);
        
        var result = await _userManager.CreateAsync(user, password);
        if (!result.Succeeded)
        {
            var errors = result.Errors.Select(e => e.Description);
            return BadRequest(new RegistrationResponseDto { Errors = errors });
        }

        var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);
        var param = new Dictionary<string, string?>
        {
            {"token", token },
            {"email", user.Email }
        };
        var callback = QueryHelpers.AddQueryString("http://localhost:4400/email-confirmation", param);
        var message = new EmailMessage([user.Email], "You have created and account", callback + ", password: " + password, null);
        await _emailService.SendEmailAsync(message);
        
        await _userManager.AddToRoleAsync(user, "Student");

        return StatusCode(201);
    }
}