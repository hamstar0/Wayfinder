using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Wayfinder.Data.Models;

namespace Wayfinder.Data;


public class WayfinderDbContext : IdentityDbContext {
    public DbSet<TermEntry> Terms { get; set; } = null!;
    public DbSet<ScheduleEventEntry> ScheduleEvents { get; set; } = null!;
    public DbSet<ScheduleEntry> Schedules { get; set; } = null!;
    public DbSet<ConceptEntry> Concepts { get; set; } = null!;
    public DbSet<GoalEntry> Goals { get; set; } = null!;
    public DbSet<PlanStepEntry> PlanSteps { get; set; } = null!;
    public DbSet<PlanEntry> Plans { get; set; } = null!;



    ////////////////

    public WayfinderDbContext( DbContextOptions<WayfinderDbContext> options )
                : base( options ) {
    }

    protected override void OnModelCreating( ModelBuilder modelBuilder ) {
        base.OnModelCreating( modelBuilder );

        modelBuilder.Entity<ConceptEntry>()
            .HasOne( w => w.TermA )
            .WithMany()
            .OnDelete( DeleteBehavior.NoAction );
        modelBuilder.Entity<ConceptEntry>()
            .HasOne( w => w.TermB )
            .WithMany()
            .OnDelete( DeleteBehavior.NoAction );
        modelBuilder.Entity<ConceptEntry>()
            .HasOne( w => w.TermRel )
            .WithMany()
            .OnDelete( DeleteBehavior.NoAction );
        modelBuilder.Entity<ConceptEntry>()
            .HasOne( w => w.Schedule )
            .WithMany()
            .OnDelete( DeleteBehavior.NoAction );

        modelBuilder.Entity<GoalEntry>()
            .HasOne( w => w.Needed )
            .WithMany()
            .OnDelete( DeleteBehavior.NoAction );

        modelBuilder.Entity<PlanEntry>()
            .HasOne( w => w.Goal )
            .WithMany()
            .OnDelete( DeleteBehavior.NoAction );

        modelBuilder.Entity<PlanStepEntry>()
            .HasOne( w => w.Plan )
            .WithMany()
            .OnDelete( DeleteBehavior.NoAction );
        modelBuilder.Entity<PlanStepEntry>()
            .HasOne( w => w.Needed )
            .WithMany()
            .OnDelete( DeleteBehavior.NoAction );
        modelBuilder.Entity<PlanStepEntry>()
            .HasOne( w => w.Fulfills )
            .WithMany()
            .OnDelete( DeleteBehavior.NoAction );
        modelBuilder.Entity<PlanStepEntry>()
            .HasOne( w => w.Event )
            .WithMany()
            .OnDelete( DeleteBehavior.NoAction );

        modelBuilder.Entity<ScheduleEventEntry>()
            .HasOne( w => w.Schedule )
            .WithMany()
            .OnDelete( DeleteBehavior.NoAction );

        modelBuilder.Entity<TermEntry>()
            .HasOne( w => w.Context )
            .WithMany()
            .OnDelete( DeleteBehavior.NoAction );

        // modelBuilder.Conventions.Remove<OneToManyCascadeDeleteConvention>();
        //            .HasRequired( m => m.HomeTeam )
        //            .WithMany( t => t.HomeMatches )
        //            .HasForeignKey( m => m.HomeTeamId )
        //            .WillCascadeOnDelete( false );
    }
}
