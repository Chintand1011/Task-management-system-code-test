using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.Text;
using TaskManagement.Data;
using TaskManagement.Models;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace TaskManagement.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _config;

        public AuthController(AppDbContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
        }

        // POST /api/auth/register
        [HttpPost("register")]
        public async Task<IActionResult> Register(Users userDto)
        {
            try
            {
                if (await _context.Users.AnyAsync(u => u.Email == userDto.Email))
                    return BadRequest(new { message = "Email already registered" });

                userDto.Password = BCrypt.Net.BCrypt.HashPassword(userDto.Password);
                _context.Users.Add(userDto);
                await _context.SaveChangesAsync();
                return Ok(new { message = "User registered successfully" });
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        // POST /api/auth/login
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] Users loginDto)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == loginDto.Email);
            if (user == null || !BCrypt.Net.BCrypt.Verify(loginDto.Password, user.Password))
                return Unauthorized(new { message = "Invalid credentials" });

            var token = GenerateJwtToken(user);

            return Ok(new { token });
        }

        private string GenerateJwtToken(Users user)
        {
            try
            {
                var keyString = _config["Jwt:Key"];

                if (string.IsNullOrWhiteSpace(keyString))
                    throw new InvalidOperationException("JWT key is missing in configuration.");

                var keyBytes = Encoding.UTF8.GetBytes(keyString);

                // HS256 requires at least 256 bits (32 bytes)
                if (keyBytes.Length < 32)
                    throw new InvalidOperationException($"JWT key is too short for HS256. It must be at least 32 bytes (256 bits). Current length: {keyBytes.Length} bytes.");

                var claims = new[]
                {
                    new Claim(JwtRegisteredClaimNames.Sub, user.Username ?? ""),
                    new Claim(ClaimTypes.Role, user.Role),
                    new Claim(JwtRegisteredClaimNames.Email, user.Email ?? ""),
                    new Claim(JwtRegisteredClaimNames.NameId, user.Id.ToString() ?? ""),

                };

                var key = new SymmetricSecurityKey(keyBytes);
                var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
                var expires = DateTime.UtcNow.AddHours(2);

                var token = new JwtSecurityToken(
                    claims: claims,
                    expires: expires,
                    signingCredentials: creds);

                return new JwtSecurityTokenHandler().WriteToken(token);
            }
            catch (Exception ex)
            {
                // Optional: log exception here
                throw new InvalidOperationException("Failed to generate JWT token.", ex);
            }
        }
    }
}
