using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using BackEnd.Data;
using BackEnd.Models;
using System.Diagnostics;
using Microsoft.VisualStudio.Web.CodeGenerators.Mvc.Dependency;

namespace BackEnd.Controllers
{
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly UserContext context = new();

        [HttpGet]
        [Route("api/user/getall")]
        public async Task<IEnumerable<User>> Get()
        {
            return await context.User.ToListAsync();
        }

        [HttpGet]
        [Route("api/user/getbyemail/{email}")]
        public async Task<IActionResult> GetUserByEmail(string email)
        {
            var user = await context.User.FirstOrDefaultAsync(u => u.Email == email);
            return user != null ? Ok(user) : NotFound();
        }

        [HttpPost]
        [Route("api/user/create")]
        public async void Add(User user)
        {
            await context.User.AddAsync(user);
            await context.SaveChangesAsync();
        }

        [HttpDelete]
        [Route("api/user/delete/{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var user = await context.User.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }
            context.User.Remove(user);
            await context.SaveChangesAsync();
            return Ok();
        }
    }
}
