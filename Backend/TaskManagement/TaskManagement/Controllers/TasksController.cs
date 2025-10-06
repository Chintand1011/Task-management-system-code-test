using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TaskManagement.Data;
using TaskManagement.Models;

namespace TaskManagement.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TasksController : Controller
    {
        private readonly AppDbContext _context;
        public TasksController(AppDbContext context) => _context = context;

        // GET /api/tasks?status=&assignee=
        [HttpGet("gettasks")]
        public async Task<IActionResult> GetTasks([FromQuery] string? status, [FromQuery] int? assignee)
        {
            try
            {
                var query = _context.Tasks.AsQueryable();

                if (!string.IsNullOrEmpty(status))
                    query = query.Where(t => t.Status == status);

                if (assignee.HasValue)
                    query = query.Where(t => t.AssigneeId == assignee);

                var tasksResponse = await _context.Tasks
                .Select(t => new TasksResponse
                {
                    Id = t.Id,
                    Title = t.Title,
                    Description = t.Description,
                    Status = t.Status,
                    Priority = t.Priority,
                    CreatedAt = t.CreatedAt,
                    UpdatedAt = t.UpdatedAt,
                    Assignee = t.AssigneeId != null
                        ? _context.Users.FirstOrDefault(u => u.Id == t.AssigneeId)!.Username
                        : null
                })
                .ToListAsync();
                return Ok(tasksResponse);
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        [HttpPost("createtask")]
        public async Task<IActionResult> CreateTask(Tasks task)
        {
            try
            {
                // Ensure the assignee exists
                var assigneeExists = await _context.Users.AnyAsync(u => u.Id == task.AssigneeId);
                if (!assigneeExists)
                    return BadRequest(new { message = $"AssigneeId {task.AssigneeId} does not exist" });

                
                var creatorExists = await _context.Users.AnyAsync(u => u.Id == task.CreatorId);
                if (!creatorExists)
                    return BadRequest(new { message = $"CreatorId {task.CreatorId} does not exist" });

                task.CreatedAt = DateTime.UtcNow;
                task.UpdatedAt = DateTime.UtcNow;

                _context.Tasks.Add(task);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetTasks), new { id = task.Id }, task);
            }
            catch (Exception ex)
            {
                
                return StatusCode(500, new { message = ex.Message });
            }

        }

        // PUT /api/tasks/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTask(int id, Tasks updatedTask)
        {
            var task = await _context.Tasks.FindAsync(id);
            if (task == null) return NotFound();

            task.Title = updatedTask.Title;
            task.Description = updatedTask.Description;
            task.Status = updatedTask.Status;
            task.Priority = updatedTask.Priority;
            task.AssigneeId = updatedTask.AssigneeId;
            task.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return Ok(task);
        }

        // DELETE /api/tasks/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTask(int id)
        {
            var task = await _context.Tasks.FindAsync(id);
            if (task == null) return NotFound();

            _context.Tasks.Remove(task);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}