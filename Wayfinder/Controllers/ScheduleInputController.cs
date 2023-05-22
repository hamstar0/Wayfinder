using Microsoft.AspNetCore.Mvc;
using Wayfinder.Data;
using Wayfinder.Data.Models;

namespace Wayfinder.Controllers;


[Route( "api/[controller]/[action]" )]
[ApiController]
public class ScheduleInputController : ControllerBase {
    [HttpPost( "{id}" )]
    public async Task AddTimeSeg(
                [FromServices] WayfinderDbContext ctx,
                [FromRoute] long id,
                (long SegTimeMin, long SegTimeMax) data ) {
        // TODO: validate id

        var myevent = new ScheduleEventEntry {
            StartTime = DateTimeOffset.FromUnixTimeMilliseconds( data.SegTimeMin ).UtcDateTime,
            EndTime = DateTimeOffset.FromUnixTimeMilliseconds( data.SegTimeMax ).UtcDateTime
        };

        await ctx.ScheduleEvents.AddAsync( myevent );
    }
}
