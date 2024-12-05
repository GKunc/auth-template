namespace WebApi.DTO;

public class AuthResponseDto
{
    public bool IsAuthSuccessful { get; set; }
    public string? ErrorMessage { get; set; }
    public string? AccessToken { get; set; }
    public string? RefreshToken { get; set; }
    public bool Is2StepVerificationRequired { get; set; }
    public string? Provider { get; set; }
}