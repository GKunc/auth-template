using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using WebApi.DTO;
using WebApi.Entities;
using WebApi.Services;

namespace WebApi.Controllers;

[ApiController]
[Authorize]
[Route("api/teachers")]
public class TeachersController : ControllerBase
{
    private readonly UserManager<User> _userManager;
    private readonly IMapper _mapper;
    
    public TeachersController(UserManager<User> userManager, IMapper mapper)
    {
        _userManager = userManager;
        _mapper = mapper;
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
        var password = PasswordGenerator.GeneratePassword(10, 1);
        Console.WriteLine(password);
        var result = await _userManager.CreateAsync(user, password);
        if (!result.Succeeded)
        {
            var errors = result.Errors.Select(e => e.Description);
            return BadRequest(new RegistrationResponseDto { Errors = errors });
        }

        await _userManager.AddToRoleAsync(user, "Teacher");

        return StatusCode(201);
    }

    [Authorize(Roles = "Administrator")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTeacher([FromRoute] string id)
    {
        var user = await _userManager.FindByIdAsync(id);
        if (user == null)
            return NotFound("User not found");
        await _userManager.DeleteAsync(user);
        return Ok();
    }

    [Authorize(Roles = "Administrator")]
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateTeacher([FromRoute] string id, [FromBody] UserForRegistrationDto userForUpdate)
    {
        if (!ModelState.IsValid)
            return BadRequest();
        var user = await _userManager.FindByIdAsync(id);
        if (user == null)
            return NotFound("User not found");
        user.Email = userForUpdate.Email;
        user.UserName = userForUpdate.Email;
        user.FirstName = userForUpdate.FirstName;
        user.LastName = userForUpdate.LastName;
        var result = await _userManager.UpdateAsync(user);
        if (!result.Succeeded)
        {
            var errors = result.Errors.Select(e => e.Description);
            return BadRequest(new RegistrationResponseDto { Errors = errors });
        }
        return Ok();
    }
}