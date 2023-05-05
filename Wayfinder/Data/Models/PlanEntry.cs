using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Wayfinder.Data.Models;


public class PlanEntry {
    [Key]
    public long Id { get; set; }

    public string Name { get; set; } = null!;

    public GoalEntry Goal { get; set; } = null!;

    [InverseProperty( "Plan" )]
    public ICollection<PlanStepEntry> Steps { get; set; } = null!;
}

