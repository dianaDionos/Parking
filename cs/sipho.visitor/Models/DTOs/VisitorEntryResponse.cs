using System.Text.Json.Serialization;
using sipho.visitor.Models.Entities;

namespace sipho.visitor.Models.DTOs;

/// <summary>
/// Visitor Entry Response Model
/// </summary>
public class VisitorEntryResponse
{

    /// <summary>
    /// Entry Id
    /// </summary>
    public Guid EventId { get; set; }

    public string VisitorName { get; set; } = string.Empty;

    /// <summary>
    /// Entry Timestamp
    /// </summary>
    public DateTimeOffset EntryTime { get; set; }

    /// <summary>
    /// License Plate
    /// </summary>
    public string? LicensePlate { get; set; }

    [JsonIgnore]
    internal VisitorEvent DbEvent { get; private set; }

    public VisitorEntryResponse(VisitorEvent dbEvent)
    {
        this.DbEvent = dbEvent ?? throw new ArgumentNullException(nameof(dbEvent));
        this.SetInitialData();
    }

    private void SetInitialData()
    {
        this.EventId = this.DbEvent.EventId;
        this.LicensePlate = this.DbEvent.ParkingEntry is null ? null : this.DbEvent.ParkingEntry.LicensePlate;
        this.EntryTime = this.DbEvent.EntryTimestamp;
        this.VisitorName = $"{this.DbEvent.Visitor.GivenNames} {this.DbEvent.Visitor.SurNames}";
    }
}
