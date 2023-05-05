using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Numerics;

namespace Wayfinder.Data.Models;


public class ConceptEntry {
    [Key]
    public long Id { get; set; }

    [Comment( "Target" )]
    public TermEntry TermA { get; set; } = null!;

    [Comment( "Concept" )]
    public TermEntry TermB { get; set; } = null!;

    [Comment( "Relationship nature" )]
    public TermEntry TermRel { get; set; } = null!;

    public ScheduleEntry Schedule { get; set; } = null!;

    public bool IsFact { get; set; }

    public bool IsImpossible { get; set; }
}
