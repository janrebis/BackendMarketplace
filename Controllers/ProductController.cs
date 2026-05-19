using BackendMarketplace.Dtos;
using BackendMarketplace.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace BackendMarketplace.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController : ControllerBase
    {
        private readonly IProductService _productService;

        public ProductsController(IProductService productService)
        {
            _productService = productService;
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> AddProduct([FromBody] CreateProductRequest request)
        {
            var ownerId = GetCurrentUserId();

            var id = await _productService.AddProduct(request, ownerId);

            return CreatedAtAction(
                nameof(GetProductById),
                new { id },
                new { id });
        }

        [HttpGet]
        public async Task<IActionResult> GetProducts()
        {
            var products = await _productService.GetProducts();

            return Ok(products);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetProductById(int id)
        {
            var product = await _productService.GetProductById(id);

            if (product == null)
                return NotFound();

            return Ok(product);
        }

        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> UpdateProduct(
            int id,
            [FromBody] UpdateProductRequest request)
        {
            var ownerId = GetCurrentUserId();

            var updatedProduct = await _productService.UpdateProduct(id, request, ownerId);

            if (updatedProduct == null)
                return NotFound();

            return Ok(updatedProduct);
        }

        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            var ownerId = GetCurrentUserId();

            var deleted = await _productService.DeleteProduct(id, ownerId);

            if (!deleted)
                return NotFound();

            return NoContent();
        }

        private string GetCurrentUserId()
        {
            return User.FindFirstValue(ClaimTypes.NameIdentifier)
                ?? throw new UnauthorizedAccessException("User id not found in token.");
        }
    }
}