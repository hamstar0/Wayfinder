using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Wayfinder.Data.Models;


public class ScheduleEntry {
    [Key]
    public long Id { get; set; }

    [InverseProperty( "Schedule" )]
    public ICollection<ScheduleEventEntry> Events { get; set; } = null!;
}
