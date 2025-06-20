using System.Globalization;
using System.Text.Json.Serialization;
using Humanizer;
using sipho.visitor.Models.Entities;

namespace sipho.visitor.Models.DTOs
{
    public class VisitorEventPerson
    {
        public string DocumentId { get; set; } = string.Empty;
        public string DocumentTypeName { get; set; } = string.Empty;
        public string GivenNames { get; set; } = string.Empty;
        public string Surnames { get; set; } = string.Empty;
        public string? PhoneNumber { get; set; }
        public string? Email { get; set; }
    }

    public class VisitorEventParking
    {
        public string? LicensePlate { get; set; }

        public double DurationMinutes { get; set; } = 0D;

        public string DurationMinutesHuman { get; internal set; } = string.Empty;

        public double ChargeableMinutes { get; internal set; } = 0D;

        public string ChargeableHuman { get; internal set; } = string.Empty;

        public DateTimeOffset? EntryTime { get; set; }

        public DateTimeOffset? ExitTime { get; set; }

        public bool IsFreeParking { get; set; }

        [JsonPropertyName("parkingCost")]
        public decimal CalculatedCost { get; set; }

        public bool BillGenerated { get; set; }

        public string? OdooBillId { get; set; }
    }

    public struct Durations
    {
        public double Minutes { get; set; }

        public readonly string MinutesHuman => TimeSpan.FromMinutes(this.Minutes).Humanize(3, culture: CultureInfo.CurrentCulture);

        public double ChargeableMinutes { get; set; }

        public readonly string ChargeableMinutesHuman => TimeSpan.FromMinutes(this.ChargeableMinutes).Humanize(3, culture: CultureInfo.CurrentCulture);

    }

    public class VisitorEventResponse
    {
        public Guid EventId { get; set; }
        public DateTimeOffset? EntryTime { get; set; }
        public DateTimeOffset? ExitTime { get; set; }

        // Visitor Details
        public VisitorEventPerson Visitor { get; set; } = new VisitorEventPerson();

        // Parking Details
        public VisitorEventParking? Parking { get; private set; } = null;

        [JsonIgnore]
        internal VisitorEvent DbEvent { get; private set; }

        public VisitorEventResponse(VisitorEvent dbEvent)
        {
            this.DbEvent = dbEvent ?? throw new ArgumentNullException(nameof(dbEvent));
            this.SetInitialData();
        }
        private void SetInitialData()
        {

            this.EventId = this.DbEvent.EventId;
            this.EntryTime = this.DbEvent.EntryTimestamp;
            this.ExitTime = this.DbEvent.ExitTimestamp;

            this.Visitor = new VisitorEventPerson
            {
                DocumentId = this.DbEvent.Visitor.DocumentId,
                DocumentTypeName = this.DbEvent.Visitor.DocumentType.Name,
                GivenNames = this.DbEvent.Visitor.GivenNames,
                Surnames = this.DbEvent.Visitor.SurNames,
                PhoneNumber = this.DbEvent.Visitor.PhoneNumber,
                Email = this.DbEvent.Visitor.Email
            };

            if (this.DbEvent.ParkingEntry != null)
            {
                this.Parking = new VisitorEventParking
                {
                    LicensePlate = this.DbEvent.ParkingEntry.LicensePlate,
                    DurationMinutes = this.DbEvent.ParkingEntry.MinutesTotal,
                    DurationMinutesHuman = this.DbEvent.ParkingEntry.MinutesTotalHuman,
                    ChargeableMinutes = this.DbEvent.ParkingEntry.MinutesChargeable,
                    ChargeableHuman = this.DbEvent.ParkingEntry.MinutesChargeableHuman,
                    EntryTime = this.DbEvent.ParkingEntry.EntryTimestamp,
                    ExitTime = this.DbEvent.ParkingEntry.ExitTimestamp,
                    IsFreeParking = this.DbEvent.ParkingEntry.IsFreeParking,
                    CalculatedCost = this.DbEvent.ParkingEntry.CalculatedCost,
                    BillGenerated = this.DbEvent.ParkingEntry.BillGenerated,
                    OdooBillId = this.DbEvent.ParkingEntry.ExternalBillId
                };
            }
        }
    }
}
