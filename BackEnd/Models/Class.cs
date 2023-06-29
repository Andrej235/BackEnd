namespace BackEnd.Models
{
    public class Class
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public TimeFrame ClassTimeFrame { get; set; } = null!;
        public Task? Task { get; set; }
    }
}
