using System.ComponentModel.DataAnnotations;

namespace WebApi.DTO;

public class UserForAuthenticationDto
{
    [Required(ErrorMessage = "Email is required.")]
    public string? Email { get; set; }

    [Required(ErrorMessage = "Password is required.")]
    public string? Password { get; set; }

    public string? ClientURI { get; set; }
}