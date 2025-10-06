using System.ComponentModel.DataAnnotations;

namespace TaskManagement.Models
{
    public class TasksResponse
    {
        public int Id { get; set; }

        [Required, MaxLength(100)]
        public string? Title { get; set; }
        public string? Description { get; set; }
        public string? Status { get; set; }
        public int Priority { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public string? Assignee { get; set; }
    }
}
