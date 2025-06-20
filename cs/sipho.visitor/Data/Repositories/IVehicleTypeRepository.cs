using sipho.visitor.Models.Entities;

namespace sipho.visitor.Data.Repositories
{
    public interface IVehicleTypeRepository
    {
        Task<VehicleType?> GetByNameAsync(string name);
        Task<VehicleType?> GetByIdAsync(int id);
    }
}
