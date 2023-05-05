using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Numerics;

namespace Wayfinder.Data.Models;


public class ScheduleEventEntry {
    [Key]
    public long Id { get; set; }

    public ScheduleEntry Schedule { get; set; } = null!;

    public DateTime StartTime { get; set; }

    public DateTime EndTime { get; set; }

    public double StartPosX { get; set; }
    public double StartPosY { get; set; }

    public double EndPosX { get; set; }
    public double EndPosY { get; set; }
}
