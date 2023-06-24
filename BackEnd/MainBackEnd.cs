namespace BackEnd
{
    using BackEnd.Data;
    using BackEnd.Models;
    public class MainBackEnd
    {
        static SomethingContext Context = null!;
        public static void Start()
        {
            Context = new();
        }

        public static List<Product> GetAllProducts()
        {
            return Context.Product.ToList();
        }
    }
}