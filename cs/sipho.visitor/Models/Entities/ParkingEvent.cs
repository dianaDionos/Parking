using System.Globalization;
using Humanizer;

namespace sipho.visitor.Models.Entities;

public class ParkingEvent
{
    [Key]
    public Guid EventId { get; set; }

    public DateTimeOffset EntryTimestamp { get; set; }

    public DateTimeOffset? ExitTimestamp { get; set; }

    [StringLength(20)]
    public required string LicensePlate { get; set; }

    public bool IsFreeParking { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal CalculatedCost { get; set; }

    public string? ExternalBillId { get; set; } // Reference to Odoo's bill ID or any other extrernal system

    public bool BillGenerated { get; internal set; }

    [StringLength(4)]
    public string? ParkingSpaceNumberDesc { get; set; }

    #region Timestamps_for_auditing
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    #endregion Timestamps_for_auditing

    #region Navigation_properties

    public int VehicleTypeId { get; set; }
    public VehicleType VehicleType { get; set; } = null!; // Navigation property to VehicleTypes

    // public Guid VisitorId { get; set; } // Foreign Key to Visitor
    public VisitorEvent VisitorEvent { get; set; } = null!;

    #endregion Navigation_properties

    #region not_mapped_properties

    [NotMapped]
    public bool IsPendingForBilling { get; set; } = false;

    [NotMapped]
    public double MinutesTotal { get; set; }

    [NotMapped]
    public string MinutesTotalHuman => TimeSpan.FromMinutes(this.MinutesTotal).Humanize(3, culture: CultureInfo.CurrentCulture);

    [NotMapped]
    public double MinutesChargeable { get; set; }

    [NotMapped]
    public string MinutesChargeableHuman => TimeSpan.FromMinutes(this.MinutesChargeable).Humanize(3, culture: CultureInfo.CurrentCulture);
    #endregion not_mapped_properties
}
