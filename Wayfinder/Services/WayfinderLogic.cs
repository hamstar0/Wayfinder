using Microsoft.EntityFrameworkCore;
using System.Collections.Concurrent;
using Wayfinder.Data;
using Wayfinder.Data.Models;

namespace Wayfinder.Services;


public class WayfinderLogic {
    public TermEntry AnythingTerm { get; private set; } = null!;


    public bool IsInitialized => this.AnythingTerm is not null;


    ////

    private IDictionary<string, ConceptEntry> CurrentConcepts = new ConcurrentDictionary<string, ConceptEntry>();
    private IDictionary<string, ScheduleEntry> CurrentSchedules = new ConcurrentDictionary<string, ScheduleEntry>();



    ////////////////

    internal async Task InitializeData_Async( WayfinderDbContext ctx ) {
        TermEntry? anythingTerm = await ctx.Terms.FirstOrDefaultAsync(
            t => t.Name == "Anything" && t.Context != null && t.Id == t.Context.Id
        );

        if( anythingTerm is null ) {
            anythingTerm = new TermEntry { Name = "Anything" };

            await ctx.Terms.AddAsync( anythingTerm );
            await ctx.SaveChangesAsync();

            anythingTerm.Context = anythingTerm;
            ctx.Terms.Update( anythingTerm );
            await ctx.SaveChangesAsync();
        }

        this.AnythingTerm = anythingTerm;
    }


    ////////////////

    public async Task<ConceptEntry> GetOrInitConcept_Async( WayfinderDbContext ctx, string dataKey ) {
        if( !this.CurrentConcepts.ContainsKey(dataKey) ) {
            this.CurrentConcepts[dataKey] = new ConceptEntry();
            this.CurrentConcepts[dataKey].Schedule = await this.GetOrInitSchedule_Async( ctx, dataKey );

            await ctx.Concepts.AddAsync( this.CurrentConcepts[dataKey] );
        }

        return this.CurrentConcepts[dataKey];
    }

    public async Task<ScheduleEntry> GetOrInitSchedule_Async( WayfinderDbContext ctx, string dataKey ) {
        if( !this.CurrentSchedules.ContainsKey(dataKey) ) {
            this.CurrentSchedules[dataKey] = new ScheduleEntry();

            await ctx.Schedules.AddAsync( this.CurrentSchedules[dataKey] );
        }

        return this.CurrentSchedules[dataKey];
    }


    ////

    public void ClearConcept( string dataKey ) {
        this.CurrentConcepts.Remove( dataKey );
    }


    ////

    public async Task AddScheduleEvent_Async(
                WayfinderDbContext ctx,
                string dataKey,
                DateTime startTime,
                DateTime endTime,
                double startPosX,
                double startPosY,
                double endPosX,
                double endPosY ) {
        var sched = await this.GetOrInitSchedule_Async( ctx, dataKey );

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


