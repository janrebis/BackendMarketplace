using BackendMarketplace.Models;

namespace BackendMarketplace.Services
{
    public class ProductService
    {
        private readonly IProductRepository _productRepository;

        public ProductService(IProductRepository productRepository)
        {
            _productRepository = productRepository;
        }
       
        public async Task<int> AddProduct(ProductModel product)
        {
            //TODO: Walidacja i jakieś sensowne przetwarzanie danych
            return await _productRepository.AddProduct(product);
        }

        public async Task<ProductModel> GetProductById(int id)
        {
            return await _productRepository.GetProductById(id);
        }

        public async Task<int> UpdateProduct(ProductModel product) 
        { 
            return await _productRepository.UpdateProduct(product);
        }

        public async Task DeleteProduct(int id)
        {
            await _productRepository.DeleteProduct(id);
;        }
    }
}
