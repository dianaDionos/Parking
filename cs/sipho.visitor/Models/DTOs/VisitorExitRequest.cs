
namespace sipho.visitor.Models.DTOs
{
    /// <summary>
    /// Visitor Exit Request
    /// </summary>
    public record VisitorExitRequest
    {
        /// <summary>
        /// Entry Id
        /// </summary>
        public Guid EntryId { get; init; }

    }
}