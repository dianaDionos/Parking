namespace sipho.visitor.Models.DTOs
{

    /// <summary>
    /// Parking Entry Request Model
    /// </summary>
    public class VisitorEntryRequest
    {

        [DefaultValue("1501101101")]
        [Required(AllowEmptyStrings = false)]
        [StringLength(20)]
        public required string DocumentId { get; set; }

        [DefaultValue("-1")]
        [Required]
        [Range(1, 100)]
        public int DocumentTypeId { get; set; }

        [DefaultValue("Eren Patricio")]
        [Required]
        [StringLength(100)]
        public string GivenNames { get; set; } = string.Empty;

        [DefaultValue("Catin")]
        [Required]
        [StringLength(100)]
        public string SurNames { get; set; } = string.Empty;

        [DefaultValue("3108010101")]
        [StringLength(10)]
        public string? PhoneNumber { get; set; }

        [DefaultValue("user@mail.net.co")]
        [StringLength(100)]
        [EmailAddress]
        public string? Email { get; set; }

        [DefaultValue("T1-A101")]
        [StringLength(10)]
        public required string UnitNumberDesc { get; set; }


        [DefaultValue("ABC001")]
        [StringLength(10)]
        public string? LicensePlate { get; set; }

        [DefaultValue("-1")]
        [Range(1, 100)]
        public int VehicleTypeId { get; set; }

        [DefaultValue("P82")]
        [StringLength(4)]
        public string? ParkingSpaceNumberDesc { get; set; }

    }
}
