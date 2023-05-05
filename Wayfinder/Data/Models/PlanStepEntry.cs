using Microsoft.EntityFrameworkCore;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Wayfinder.Data.Models;


public class PlanStepEntry {
    [Key]
    public long Id { get; set; }

    public PlanEntry Plan { get; set; } = null!;

    public ConceptEntry Needed { get; set; } = null!;

    public ConceptEntry Fulfills { get; set; } = null!;

    public ScheduleEntry Event { get; set; } = null!;
}