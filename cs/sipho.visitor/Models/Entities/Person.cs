
namespace sipho.visitor.Models.Entities;

public class Person
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public Guid PersonId { get; set; }

    [StringLength(100)]
    public required string GivenNames { get; set; } = string.Empty;

    [StringLength(100)]
    public required string SurNames { get; set; } = string.Empty;

    public DateTime? DateOfBirth { get; set; }

    [ForeignKey(nameof(DocumentType))]
    public int DocumentTypeId { get; set; } = 1;

    [Required]
    [StringLength(50)]
    public required string DocumentId { get; set; }

    public string? PhoneNumber { get; set; }

    [StringLength(100)]
    [EmailAddress]
    public string? Email { get; set; }

    [ForeignKey(nameof(Gender))]
    public Enums.GenderTypes GenderId { get; set; } = Enums.GenderTypes.PreferNotToSay;

    [MaxLength(100)]
    public string? AddressLine1 { get; set; }

    [MaxLength(100)]
    public string? AddressLine2 { get; set; }

    [MaxLength(50)]
    public string? City { get; set; }

    [MaxLength(50)]
    public string? StateProvince { get; set; }

    [MaxLength(10)]
    public string? ZipCode { get; set; }

    [MaxLength(50)]
    public string? Country { get; set; }

    #region Timestamps_for_auditing
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    #endregion Timestamps_for_auditing

    #region Navigation_properties
    public virtual PersonDocumentType DocumentType { get; set; } = null!;
    public virtual PersonGenderType Gender { get; set; } = null!;
    #endregion Navigation_properties
}
