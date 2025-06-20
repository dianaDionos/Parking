using sipho.visitor.Models.Entities;

namespace sipho.visitor.Data.Repositories
{
    public interface IDocumentTypeRepository
    {
        Task<PersonDocumentType?> GetByNameAsync(string name);
        Task<PersonDocumentType?> GetByIdAsync(int id);
    }
}