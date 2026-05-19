using BackendMarketplace.Dtos;
using BackendMarketplace.Models;
using Microsoft.AspNetCore.Identity;

namespace BackendMarketplace.Services
{
    public interface IUserService
    {
        Task<IdentityResult> RegisterUser(RegisterUserRequest request);

        Task<AuthResponse?> LoginUser(LoginUserRequest request);

        Task<ApplicationUser?> GetUserById(string id);
    }
}