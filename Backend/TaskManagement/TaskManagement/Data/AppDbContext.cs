using Microsoft.EntityFrameworkCore;
using TaskManagement.Models;

namespace TaskManagement.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
        {
        }

        public DbSet<Users> Users { get; set; }
        public DbSet<Tasks> Tasks { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Users>(entity =>
            {
                entity.ToTable("users", "task"); // schema 'task'
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).HasColumnName("id").ValueGeneratedOnAdd();
                entity.Property(e => e.Username).HasColumnName("username").HasMaxLength(50);
                entity.Property(e => e.Email).HasColumnName("email").HasMaxLength(255);
                entity.Property(e => e.Password).HasColumnName("password").HasMaxLength(255);
                entity.Property(e => e.Role).HasColumnName("role").HasMaxLength(50).HasDefaultValue("User");
                entity.Property(e => e.CreatedAt).HasColumnName("created_at").HasDefaultValueSql("NOW()");
            });


            modelBuilder.Entity<Tasks>(entity =>
            {
                entity.ToTable("tasks", "task"); // schema 'task', table 'tasks'

                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id)
                      .HasColumnName("id") // column names are lowercase
                      .ValueGeneratedOnAdd();

                entity.Property(e => e.Title).HasColumnName("title").HasMaxLength(100).IsRequired();
                entity.Property(e => e.Description).HasColumnName("description");
                entity.Property(e => e.Status).HasColumnName("status").HasMaxLength(20).HasDefaultValue("TODO").IsRequired();
                entity.Property(e => e.Priority).HasColumnName("priority").IsRequired();
                entity.Property(e => e.AssigneeId).HasColumnName("assignee_id").IsRequired(false);
                entity.Property(e => e.CreatorId).HasColumnName("creator_id").IsRequired(false);
                entity.Property(e => e.CreatedAt).HasColumnName("created_at").HasDefaultValueSql("NOW() AT TIME ZONE 'UTC'").IsRequired();
                entity.Property(e => e.UpdatedAt).HasColumnName("updated_at").HasDefaultValueSql("NOW() AT TIME ZONE 'UTC'").IsRequired();

                //// Navigation properties
                //entity.HasOne(e => e.Assignee)
                //      .WithMany()
                //      .HasForeignKey(e => e.AssigneeId)
                //      .HasConstraintName("fk_assignee")
                //      .OnDelete(DeleteBehavior.Cascade);

                //entity.HasOne(e => e.Creator)
                //      .WithMany()
                //      .HasForeignKey(e => e.CreatorId)
                //      .HasConstraintName("fk_creator")
                //      .OnDelete(DeleteBehavior.Cascade);
            });
        }
    }
}
