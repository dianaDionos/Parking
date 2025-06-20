using Microsoft.EntityFrameworkCore;
using sipho.visitor.Models.Entities;

namespace sipho.visitor.Data.Repositories
{
    public class VehicleTypeRepository : IVehicleTypeRepository
    {
        private readonly ApplicationDbContext _context;

        public VehicleTypeRepository(ApplicationDbContext context)
        {
            this._context = context;
        }

        public async Task<VehicleType?> GetByNameAsync(string name)
        {
            return await this._context.VehicleTypes.FirstOrDefaultAsync(dt => dt.Name == name);
        }

        public async Task<VehicleType?> GetByIdAsync(int id)
        {
            return await this._context.VehicleTypes.FindAsync(id);
        }
    }
}
