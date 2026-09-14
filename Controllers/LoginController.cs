using DotActivDashboard.DTO;
using DotActivDashboard.Models;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DotActivDashboard.Controllers
{
    public class LoginController : ControllerBase    
    {
        private readonly AppDbContext _context;

        public LoginController(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IActionResult> Login(LoginRequestDTO loginRequest)
        {
            if (string.IsNullOrWhiteSpace(loginRequest.Username) || string.IsNullOrWhiteSpace(loginRequest.Password))
            {
                return BadRequest(new { Message = "Username and password are required." });
            }

            var user = await _context.Users
                .Include(u => u.Role)
                .FirstOrDefaultAsync(u => u.SUsername == loginRequest.Username && u.SPassword == loginRequest.Password);
            if (user == null)
            {
                return Unauthorized(new { Message = "Invalid username or password." });
            }
            var userSession = new UserSessionDTO
            {
                UserId = user.PkUserId,
                Username = user.SUsername,
                RoleName = user.Role?.SRoleName ?? string.Empty,
                Province = user.Role?.SProvince
            };

            return Ok(userSession);
        }
    }
}
