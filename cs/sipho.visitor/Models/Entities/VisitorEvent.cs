namespace sipho.visitor.Models.Entities;

public partial class VisitorEvent
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public Guid EventId { get; set; }

    [Required]
    [ForeignKey(nameof(Visitor))]
    public Guid VisitorId { get; set; } // Foreign Key to Visitor

    public required DateTimeOffset EntryTimestamp { get; set; }

    public DateTimeOffset? ExitTimestamp { get; set; }

    [StringLength(10)]
    public required string UnitNumberDesc { get; set; }


    #region Timestamps_for_auditing
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    #endregion Timestamps_for_auditing

    #region Navigation_properties
    public Person Visitor { get; set; } = null!; // Navigation property

    public ParkingEvent ParkingEntry { get; set; } = null!; // Navigation property

    #endregion Navigation_properties
}
