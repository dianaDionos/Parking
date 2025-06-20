using Microsoft.EntityFrameworkCore;
using sipho.visitor.Models.Entities;

namespace sipho.visitor.Data.Repositories
{
    public class DocumentTypeRepository : IDocumentTypeRepository
    {
        private readonly ApplicationDbContext _context;

        public DocumentTypeRepository(ApplicationDbContext context)
        {
            this._context = context;
        }

        public async Task<PersonDocumentType?> GetByNameAsync(string name)
        {
            return await this._context.VisitorDocumentTypes.FirstOrDefaultAsync(dt => dt.Name == name);
        }

        public async Task<PersonDocumentType?> GetByIdAsync(int id)
        {
            return await this._context.VisitorDocumentTypes.FindAsync(id);
        }
    }
}
