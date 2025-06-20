using Microsoft.EntityFrameworkCore;
using sipho.visitor.Models.Entities;

namespace sipho.visitor.Data.Repositories
{
    public class VisitorEventRepository : IVisitorEventRepository
    {
        private readonly ApplicationDbContext _context;

        public VisitorEventRepository(ApplicationDbContext context)
        {
            this._context = context;
        }

        public async Task<VisitorEvent> AddEventAsync(VisitorEvent visitorEvent)
        {
            _ = this._context.VisitorEvents.Add(visitorEvent);
            _ = await this._context.SaveChangesAsync();
            return visitorEvent;
        }

        public async Task<VisitorEvent?> GetEventByIdAsync(Guid id)
        {
            return await this._context.VisitorEvents.FindAsync(id);
        }

        public async Task UpdateEventAsync(VisitorEvent visitorEvent)
        {
            _ = this._context.VisitorEvents.Update(visitorEvent);
            _ = await this._context.SaveChangesAsync();
        }

        public async Task<VisitorEvent?> GetActiveEventWithVisitorByIdAsync(Guid Id)
        {
            return await this._context.VisitorEvents
                .Include(pe => pe.Visitor)
                    .ThenInclude(v => v.DocumentType) // Include DocumentType for Visitor
                .Include(pe => pe.ParkingEntry)
                    .ThenInclude(pe => pe.VehicleType) // Include VehicleType for ParkingEntry
                .AsNoTracking()
                .Where(pe => pe.EventId == Id && pe.ExitTimestamp == null)
                .OrderByDescending(pe => pe.EntryTimestamp)
                .FirstOrDefaultAsync();
        }


        public async Task<IReadOnlyCollection<VisitorEvent>> GetActiveEventsWithVisitorAsync()
        {
            return await this._context.VisitorEvents
                .Include(ve => ve.Visitor)
                    .ThenInclude(v => v.DocumentType) // Include DocumentType for Visitor
                .Include(pe => pe.ParkingEntry)
                    .ThenInclude(pe => pe.VehicleType) // Include VehicleType for ParkingEntry
                .AsNoTracking()
                // .Where(e => e.ExitTimestamp == null && !string.IsNullOrEmpty(e.ParkingEntry!.LicensePlate))
                .Where(e => e.ExitTimestamp == null)
                .Include(ve => ve.Visitor)
                .OrderByDescending(pe => pe.EntryTimestamp)
                .ToListAsync()
                ;
        }

        public async Task<VisitorEvent?> GetEventWithVisitorByLicensePlateAsync(string licensePlate)
        {
            return await this._context.VisitorEvents
                .Include(ve => ve.Visitor)
                    .ThenInclude(v => v.DocumentType) // Include DocumentType for Visitor
                .Include(pe => pe.ParkingEntry)
                    .ThenInclude(pe => pe.VehicleType) // Include VehicleType for ParkingEntry
                .AsNoTracking()
                .Where(pe => pe.ParkingEntry.LicensePlate == licensePlate && pe.ExitTimestamp == null)
                // .OrderByDescending(pe => pe.EntryTimestamp)
                .FirstOrDefaultAsync()
            ;
        }

        public async Task<bool> ExistEventWithParkingByLicensePlateAsync(string licensePlate)
        {
            return await this._context.VisitorEvents
                .AsNoTracking()
                .AnyAsync(pe => pe.ParkingEntry.LicensePlate == licensePlate && pe.ExitTimestamp == null)
            ;
        }

        public async Task<bool> ExistEventWithVisitorByDocumentIdAsync(string documentId)
        {
            return await this._context.VisitorEvents
                // .Include(ve => ve.Visitor)
                .AsNoTracking()
                .AnyAsync(pe => pe.Visitor.DocumentId.Equals(documentId) && pe.ExitTimestamp == null)
            ;
        }
    }
}
