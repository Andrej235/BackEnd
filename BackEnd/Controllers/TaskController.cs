using BackEnd.Data;
using BackEnd.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BackEnd.Controllers
{
    [ApiController]
    public class TaskController : ControllerBase
    {
        private readonly ClassContext context = new();

        [HttpGet]
        [Route("/api/day/getclasses/{id}")]
        public async Task<IActionResult> GetClassesInDay(int id)
        {
            var day = await context.Days
                .Include(d => d.Classes).ThenInclude(c => c.ClassTimeFrame)
                .Include(d => d.Classes).ThenInclude(c => c.Task)
                .FirstOrDefaultAsync(d => d.Id == id);
            return day != null && day.Classes != null ? Ok(day) : NotFound();
        }
    }
}
