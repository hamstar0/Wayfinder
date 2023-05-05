using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Wayfinder.Data.Models;


public class GoalEntry {
    [Key]
    public long Id { get; set; }

    public string Name { get; set; } = null!;

    public ConceptEntry Needed { get; set; } = null!;
}
