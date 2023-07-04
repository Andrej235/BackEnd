namespace BackEnd.Models
{
    public class Day
    {
        public int Id { get; set; }
        public virtual ICollection<Class> Classes { get; set; } = null!;
        public DayName Name { get; set; }
        public int Shift { get; set; }

        public enum DayName
        {
            Monday,
            Tuesday,
            Wednesday,
            Thursday,
            Friday,
            Saturday,
            Sunday
        }
    }
}