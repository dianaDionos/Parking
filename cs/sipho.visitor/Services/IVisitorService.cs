using sipho.visitor.Models.DTOs;

namespace sipho.visitor.Services
{
    /// <summary>
    /// Visitor Service Interface
    /// </summary>
    public interface IVisitorService
    {
        /// <summary>
        /// Record Entry Async
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        Task<VisitorEntryResponse> SetEventEntryAsync(VisitorEntryRequest request);

        // Task<ResponseWrapper<VisitorEntryResponse>> SetEventEntryAsync(VisitorEntryRequest request, ResponseWrapper<VisitorEntryResponse> responseWrapper);


        /// <summary>
        /// Calculate Cost Async
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        Task<VisitorEventResponse> GetActiveVisitorEventByIdAsync(VisitorFindRequest request);

        Task<ICollection<VisitorEventResponse>> GetActiveVisitorEventsAsync();


        /// <summary>
        /// Record Exit And Calculate Cost Async
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        Task<VisitorEventResponse> SetEventExitAsync(VisitorExitRequest request);
    }
}
