namespace BackEnd
{
    using BackEnd.Data;
    using BackEnd.Models;
    using System.Diagnostics;

    public class MainBackEnd
    {
        static UserContext Context = null!;
        public static void Start()
        {
            Context = new();
        }

        public static List<User> GetAllProducts()
        {
            return Context.User.ToList();
        }
    }
}