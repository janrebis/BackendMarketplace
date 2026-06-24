using BackendMarketplace.Data;
using BackendMarketplace.Models;
using Microsoft.EntityFrameworkCore;

namespace BackendMarketplace.Repositories
{
    public class ProductRepository : IProductRepository
    {
        private readonly ApplicationDbContext _context;

        public ProductRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<int> AddProduct(ProductModel product)
        {
            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            return product.Id;
        }

        public async Task<ProductModel?> GetProductById(int id)
        {
            return await _context.Products
                .FirstOrDefaultAsync(p => p.Id == id);
        }

        public async Task<List<ProductModel>> GetProducts(int? page = null, int? pageSize = null)
        {
            var query = _context.Products
                .OrderBy(p => p.Id)
                .AsQueryable();

            if (page.HasValue && pageSize.HasValue)
            {
                query = query
                    .Skip((Math.Max(page.Value, 1) - 1) * pageSize.Value)
                    .Take(pageSize.Value);
            }

            return await query.ToListAsync();
        }

        public async Task<ProductModel?> UpdateProduct(ProductModel product)
        {
            // product is already tracked by this scoped DbContext (loaded earlier
            // via GetProductById), so its modified properties are picked up by the
            // change tracker - no need to fetch it again.
            await _context.SaveChangesAsync();

            return product;
        }

        public async Task<bool> DeleteProduct(int id)
        {
            var product = await _context.Products
                .FirstOrDefaultAsync(p => p.Id == id);

            if (product == null)
                return false;

            _context.Products.Remove(product);
            await _context.SaveChangesAsync();

            return true;
        }
    }
}