using BackendMarketplace.Dtos;
using BackendMarketplace.Models;
using BackendMarketplace.Repositories;

namespace BackendMarketplace.Services
{
    public class ProductService : IProductService
    {
        private readonly IProductRepository _productRepository;

        public ProductService(IProductRepository productRepository)
        {
            _productRepository = productRepository;
        }

        public async Task<int> AddProduct(CreateProductRequest request, string ownerId)
        {
            var product = new ProductModel
            {
                Name = request.Name,
                Price = request.Price,
                Description = request.Description,
                OwnerId = ownerId
            };

            return await _productRepository.AddProduct(product);
        }

        public async Task<ProductResponse?> GetProductById(int id)
        {
            var product = await _productRepository.GetProductById(id);

            if (product == null)
                return null;

            return MapToResponse(product);
        }

        public async Task<List<ProductResponse>> GetProducts()
        {
            var products = await _productRepository.GetProducts();

            return products
                .Select(MapToResponse)
                .ToList();
        }

        public async Task<ProductResponse?> UpdateProduct(
            int id,
            UpdateProductRequest request,
            string ownerId)
        {
            var existingProduct = await _productRepository.GetProductById(id);

            if (existingProduct == null)
                return null;

            if (existingProduct.OwnerId != ownerId)
                throw new UnauthorizedAccessException("You are not the owner of this product.");

            existingProduct.Name = request.Name;
            existingProduct.Price = request.Price;
            existingProduct.Description = request.Description;

            var updatedProduct = await _productRepository.UpdateProduct(existingProduct);

            return updatedProduct == null
                ? null
                : MapToResponse(updatedProduct);
        }

        public async Task<bool> DeleteProduct(int id, string ownerId)
        {
            var existingProduct = await _productRepository.GetProductById(id);

            if (existingProduct == null)
                return false;

            if (existingProduct.OwnerId != ownerId)
                throw new UnauthorizedAccessException("You are not the owner of this product.");

            return await _productRepository.DeleteProduct(id);
        }

        private static ProductResponse MapToResponse(ProductModel product)
        {
            return new ProductResponse
            {
                Id = product.Id,
                OwnerId = product.OwnerId,
                Name = product.Name,
                Price = product.Price,
                Description = product.Description
            };
        }
    }
}