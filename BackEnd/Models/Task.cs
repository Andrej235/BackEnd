namespace BackEnd.Models
{
    public class Task
    {
        public int Id { get; set; }
        public string Type { get; set; } = null!;
        public string? Description { get; set; }
    }
}