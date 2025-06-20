using Microsoft.EntityFrameworkCore;
using sipho.visitor.Models.Entities;

namespace sipho.visitor.Data.Repositories
{
    public class VisitorRepository : IVisitorRepository
    {
        private readonly ApplicationDbContext _context;

        public VisitorRepository(ApplicationDbContext context)
        {
            this._context = context;
        }

        public async Task<Person?> GetByDocumentIdAndTypeAsync(string documentId, int documentTypeId)
        {
            return await this._context.Visitors
                .Include(v => v.DocumentType)
                .FirstOrDefaultAsync(v => v.DocumentId == documentId && v.DocumentTypeId == documentTypeId);
        }

        public async Task<Person> AddAsync(Person visitor)
        {
            _ = await this._context.Visitors.AddAsync(visitor);
            _ = await this._context.SaveChangesAsync();
            return visitor;
        }

        public async Task UpdateAsync(Person visitor)
        {
            _ = this._context.Visitors.Update(visitor);
            _ = await this._context.SaveChangesAsync();
        }

        public async Task<Person?> GetByIdAsync(Guid id)
        {
            return await this._context.Visitors.FindAsync(id);
        }

    }
}
