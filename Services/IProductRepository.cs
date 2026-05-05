using BackendMarketplace.Models;

namespace BackendMarketplace.Services
{
    public interface IProductRepository
    {
        public Task<int> AddProduct(ProductModel product);
        public Task<ProductModel> GetProductById(int id);
        public Task<int> UpdateProduct(ProductModel product);
        public Task DeleteProduct(int id);
    }
}
