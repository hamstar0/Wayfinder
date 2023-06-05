/*using Microsoft.AspNetCore.Mvc;
using Wayfinder.Data;
using Wayfinder.Data.Models;
using Wayfinder.Services;

namespace Wayfinder.Controllers;


[Route( "api/[controller]/[action]" )]
[ApiController]
public class ScheduleInputController : ControllerBase {
    //[HttpPost( "{id}" )]
    public async Task AddTimeSeg(
                //[FromRoute] long id,
                [FromServices] WayfinderDbContext ctx,
                [FromServices] WayfinderLogic logic,
                (long SegTimeBeg, long SegTimeEnd) data ) {
        await logic.AddScheduleEvent(
            ctx: ctx,
            startTime: DateTimeOffset.FromUnixTimeMilliseconds( data.SegTimeBeg ).UtcDateTime,
            endTime: DateTimeOffset.FromUnixTimeMilliseconds( data.SegTimeEnd ).UtcDateTime,
            startPosX: 0,   //TODO
            startPosY: 0,   //TODO
            endPosX: 0,   //TODO
            endPosY: 0   //TODO
        );
    }
}*/
