using BackendMarketplace.Dtos;

namespace BackendMarketplace.Services
{
    public interface IProductService
    {
        Task<int> AddProduct(CreateProductRequest request, string ownerId);

        Task<ProductResponse?> GetProductById(int id);

        Task<List<ProductResponse>> GetProducts();

        Task<ProductResponse?> UpdateProduct(int id, UpdateProductRequest request, string ownerId);

        Task<bool> DeleteProduct(int id, string ownerId);
    }
}