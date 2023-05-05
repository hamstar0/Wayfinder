using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Wayfinder.Data.Models;


[Index(nameof(Name), "ContextId", IsUnique = true)]
public class TermEntry {
    [Key]
    public long Id { get; set; }

    public string Name { get; set; } = null!;

    public TermEntry? Context { get; set; } = null!;

    public long? ContextId { get; set; } = null!;



    public override string ToString() {
        return $"{this.Name} ({this.Context?.Name})";
    }
}
