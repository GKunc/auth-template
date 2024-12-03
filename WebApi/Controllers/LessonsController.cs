using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebApi.Controllers;

[ApiController]
[Route("api/lessons")]
[Authorize]
public class LessonsController : ControllerBase
{
    private static readonly string[] Lessons = new[]
    {
        "Lesson 1", 
        "Lesson 2", 
        "Lesson 3", 
    };
    
    [HttpGet]
    public IEnumerable<string> GetLessons()
    {
        return Lessons.ToArray();
    }
}