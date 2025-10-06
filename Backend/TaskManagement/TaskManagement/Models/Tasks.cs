using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TaskManagement.Models
{
    public class Tasks
    {
        public int Id { get; set; }

        [Required, MaxLength(100)]
        public string? Title { get; set; }

        public string? Description { get; set; }

        [MaxLength(20)]
        public string Status { get; set; } = "TODO";

        public int Priority { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Foreign keys
        public int? AssigneeId { get; set; }
        public int? CreatorId { get; set; }

        //// Navigation properties
        //[ForeignKey("AssigneeId")]
        //public Users? Assignee { get; set; }

        //[ForeignKey("CreatorId")]
        //public Users? Creator { get; set; }
    }
}