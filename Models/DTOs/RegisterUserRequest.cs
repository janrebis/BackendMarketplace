using System.ComponentModel.DataAnnotations;

namespace BackendMarketplace.Dtos
{
    public class RegisterUserRequest
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        [MinLength(12)]
        public string Password { get; set; } = string.Empty;
    }
}