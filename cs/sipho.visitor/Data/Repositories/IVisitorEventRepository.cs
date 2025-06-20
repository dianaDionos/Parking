using sipho.visitor.Models.Entities;

namespace sipho.visitor.Data.Repositories
{
    /// <summary>
    /// Visitor Event Repository
    /// </summary>
    public interface IVisitorEventRepository
    {

        /// <summary>
        /// Add Event Async
        /// </summary>
        /// <param name="visitorEvent"></param>
        /// <returns></returns>
        Task<VisitorEvent> AddEventAsync(VisitorEvent visitorEvent);

        /// <summary>
        /// Get Event By Id Async
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        Task<VisitorEvent?> GetEventByIdAsync(Guid id);

        /// <summary>
        /// Update Event Async
        /// </summary>
        /// <param name="visitorEvent"></param>
        /// <returns></returns>
        Task UpdateEventAsync(VisitorEvent visitorEvent);


        /// <summary>
        ///  Get Event With Visitor By Id Async
        /// </summary>
        /// <param name="Id"></param>
        /// <returns></returns>
        Task<VisitorEvent?> GetActiveEventWithVisitorByIdAsync(Guid Id);

        Task<IReadOnlyCollection<VisitorEvent>> GetActiveEventsWithVisitorAsync();

        Task<VisitorEvent?> GetEventWithVisitorByLicensePlateAsync(string licensePlate);

        Task<bool> ExistEventWithParkingByLicensePlateAsync(string licensePlate);

        Task<bool> ExistEventWithVisitorByDocumentIdAsync(string documentId);
    }
}
