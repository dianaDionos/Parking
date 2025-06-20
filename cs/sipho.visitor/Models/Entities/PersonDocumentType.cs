namespace sipho.visitor.Models.Entities;

public class PersonDocumentType
{
    [Key]
    // [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int DocumentTypeId { get; set; }

    [StringLength(100)]
    public required string Name { get; set; } // e.g., "Cédula de Ciudadanía"

    [StringLength(10)]
    public required string Code { get; set; } // e.g., "CC", "CE"

    #region Timestamps_for_auditing
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    #endregion Timestamps_for_auditing

}
