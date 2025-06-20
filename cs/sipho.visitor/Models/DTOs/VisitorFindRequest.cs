namespace sipho.visitor.Models.DTOs;

/// <summary>
/// Visitor Find Request
/// </summary>
public class VisitorFindRequest
{

  /// <summary>
  /// License Plate
  /// </summary>
  [StringLength(10)]
  public string? LicensePlate { get; init; }

  /// <summary>
  /// Entry Id
  /// </summary>
  public Guid? EntryId { get; init; }

}
