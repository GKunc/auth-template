using System.ComponentModel.DataAnnotations;

namespace WebApi.DTO;

public class UserForRegistrationDto
{
    public string? FirstName { get; set; }
    public string? LastName { get; set; }

    [Required(ErrorMessage = "Email is required.")]
    public string? Email { get; set; }
    
    [Required(ErrorMessage = "Phone is required.")]
    public string? PhoneNumber { get; set; }
    
    public string? ClientURI { get; set; }
}