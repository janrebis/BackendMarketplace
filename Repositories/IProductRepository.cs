using BackendMarketplace.Models;

namespace BackendMarketplace.Repositories
{
    public interface IProductRepository
    {
        Task<int> AddProduct(ProductModel product);

        Task<ProductModel?> GetProductById(int id);

        Task<List<ProductModel>> GetProducts();

        Task<ProductModel?> UpdateProduct(ProductModel product);

        Task<bool> DeleteProduct(int id);
    }
}