using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TaskManagement.Models
{
    [Table("users", Schema = "task")]
    public class Users
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [MaxLength(50)]
        public string? Username { get; set; }

        [EmailAddress]
        [MaxLength(255)]
        public string? Email { get; set; }

        [MaxLength(255)]
        public string? Password { get; set; }

        [MaxLength(50)]
        public string Role { get; set; } = "User";

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        //public ICollection<Tasks>? AssignedTasks { get; set; }
        //public ICollection<Tasks>? CreatedTasks { get; set; }
    }
}
