using DotActivDashboard.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DotActivDashboard.Controllers
{
    [Route("api/[controller]")]
    public class StoresController : ControllerBase
    {
        private readonly AppDbContext _context;

        public StoresController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetStores([FromHeader(Name = "X-User-Id")] int userId)
        {
            if (userId <= 0)
            {
                return BadRequest("Invalid user ID.");
            }

            var user = await _context.Users.Include(u => u.Role).FirstOrDefaultAsync(u => u.PkUserId == userId);

            if (user == null || user.Role == null)
            {
                return NotFound("User not found.");
            }

            IQueryable<Store> query = _context.Stores.AsQueryable();

            if (!string.IsNullOrEmpty(user.Role.SProvince))
            {
                query = query.Where(s => s.SProvince == user.Role.SProvince);
            }

            var stores = await query.OrderBy(s => s.SStoreName).ToListAsync();

            return Ok(stores);
        }
    }
}
