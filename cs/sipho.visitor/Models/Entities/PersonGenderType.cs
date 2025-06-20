namespace sipho.visitor.Models.Entities;

public class PersonGenderType
{
    [Key]
    // [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public Enums.GenderTypes GenderTypeId { get; set; }

    [MaxLength(50)]
    public required string Name { get; set; }

    [MaxLength(10)]
    public required string Code { get; set; }

    #region Timestamps_for_auditing
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    #endregion Timestamps_for_auditing

}
