using sipho.visitor.Models.Entities;

namespace sipho.visitor.Data.Repositories
{
    public interface IVisitorRepository
    {
        Task<Person?> GetByDocumentIdAndTypeAsync(string documentId, int documentTypeId);

        Task<Person> AddAsync(Person visitor);

        Task UpdateAsync(Person visitor); // In case visitor details need updating

        Task<Person?> GetByIdAsync(Guid id);

    }
}
