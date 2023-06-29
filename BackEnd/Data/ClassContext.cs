using BackEnd.Models;
using Microsoft.EntityFrameworkCore;

namespace BackEnd.Data
{
    public class ClassContext : DbContext
    {
        public DbSet<TimeFrame> TimeFrame { get; set; }
        public DbSet<Class> Classes { get; set; }
        public DbSet<Day> Days { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlServer(@"Data Source=(localdb)\MSSQLLocalDB;Initial Catalog=TaskDB;Integrated Security=True;");
        }
    }
}
