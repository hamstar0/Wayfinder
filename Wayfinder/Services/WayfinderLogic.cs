using Wayfinder.Data;
using Wayfinder.Data.Models;

namespace Wayfinder.Services;


public class WayfinderLogic {
    public TermEntry AnythingTerm { get; private set; } = null!;


    public bool IsInitialized => this.AnythingTerm is not null;


    private ScheduleEntry? CurrentSchedule = null;



    ////////////////

    internal void InitializeData( WayfinderDbContext ctx ) {
        TermEntry? anythingTerm = ctx.Terms.FirstOrDefault(
            t => t.Name == "Anything" && t.Context != null && t.Id == t.Context.Id
        );

        if( anythingTerm is null ) {
            anythingTerm = new TermEntry { Name = "Anything" };

            ctx.Terms.Add( anythingTerm );
            ctx.SaveChanges();

            anythingTerm.Context = anythingTerm;
            ctx.Terms.Update( anythingTerm );
            ctx.SaveChanges();
        }

        this.AnythingTerm = anythingTerm;
    }


    ////////////////

    private async Task<ScheduleEntry> GetOrInitCurrentSchedule( WayfinderDbContext ctx ) {
        if( this.CurrentSchedule is null ) {
            this.CurrentSchedule = new ScheduleEntry();

            await ctx.Schedules.AddAsync( this.CurrentSchedule );
        }

        return this.CurrentSchedule;
    }

    public async Task<ScheduleEntry> GetCurrentSchedule( WayfinderDbContext ctx ) {
        return await this.GetOrInitCurrentSchedule( ctx );
    }

    public async Task AddScheduleEvent(
                WayfinderDbContext ctx,
                DateTime startTime,
                DateTime endTime,
                double startPosX,
                double startPosY,
                double endPosX,
                double endPosY ) {
        var sched = await this.GetOrInitCurrentSchedule( ctx );

        var myevent = new ScheduleEventEntry {
            StartTime = startTime,
            EndTime = endTime,
            StartPosX = startPosX,
            StartPosY = startPosY,
            EndPosX = endPosX,
            EndPosY = endPosY,
            Schedule = sched
        };
        await ctx.ScheduleEvents.AddAsync( myevent );
    }
}


