namespace sipho.visitor.Models.DTOs
{
    public class OdooBillRequest
    {
        [Required]
        public string LicensePlate { get; set; } = string.Empty;

        [Required]
        public DateTimeOffset EntryTime { get; set; }

        public DateTimeOffset? ExitTime { get; set; }

        [Required]
        public decimal Amount { get; set; }

        [Required]
        public string VisitorDocumentId { get; set; } = string.Empty;

        [Required]
        public string VisitorDocumentTypeName { get; set; } = string.Empty;

        [Required]
        public string VisitorNames { get; set; } = string.Empty;

        [Required]
        public string VisitorSurnames { get; set; } = string.Empty;

        public string? VisitorPhoneNumber { get; set; }

        public string? VisitorEmail { get; set; }

        // Additional fields for Odoo if needed, e.g., product_id, company_id
        public string? Description { get; set; }
    }
}
