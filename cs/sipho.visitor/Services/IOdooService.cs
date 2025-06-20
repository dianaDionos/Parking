using sipho.visitor.Models.DTOs;

namespace sipho.visitor.Services
{
    public interface IOdooService
    {
        Task<bool> GenerateBillAsync(OdooBillRequest billData);
    }
}