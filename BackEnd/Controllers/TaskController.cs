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
        [Route("/api/day/getclasses/{dayId}/{shiftId}")]
        public async Task<IActionResult> GetClassesInDay(int dayId, int shiftId)
        {
            var day = await context.Days
                .Include(d => d.Classes).ThenInclude(c => c.ClassTimeFrame)
                .Include(d => d.Classes).ThenInclude(c => c.Task)
                .FirstOrDefaultAsync(d => d.Name == (Day.DayName)dayId && d.Shift == shiftId);
            return day != null && day.Classes != null ? Ok(day) : NotFound();
        }

        [HttpPut]
        [Route("/api/task/{id}")]
        public async Task<IActionResult> EditTaskDetails(int id, [FromBody] Models.Task updatedTask)
        {
            var task = await context.Task.FindAsync(id);

            if (task == null)
                return NotFound();

            task.Type = updatedTask.Type;
            task.Description = updatedTask.Description;
            await context.SaveChangesAsync();
            return Ok(task);
        }

        [HttpPost]
        [Route("/api/task/add/{classID}")]
        public async Task<IActionResult> AddNewTaskToClass(int classId, [FromBody] Models.Task task)
        {
            var classObj = await context.Classes.FindAsync(classId);
            if (classObj == null)
                return NotFound();

            classObj.Task = task;
            await context.SaveChangesAsync();

            return Ok(classObj.Task);
        }

        [HttpDelete]
        [Route("/api/task/removefromclass/{classID}")]
        public async Task<IActionResult> RemoveTaskFromClass(int classId)
        {
            var classObj = await context.Classes
                .Include(c => c.Task)
                .FirstOrDefaultAsync(c => c.Id == classId);

            if (classObj == null)
                return NotFound("Class with id " + classId + " could not be found");

            if (classObj.Task == null)
                return NotFound("Class with id " + classId + " doesn't have a task.");

            var task = classObj.Task;
            classObj.Task = null;

            var classesWithTask = await context.Classes.AllAsync(x => x.Task == task);
            if (!classesWithTask)
                context.Task.Remove(task);

            await context.SaveChangesAsync();
            return Ok(classObj);
        }
    }
}