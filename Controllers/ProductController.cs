using BackendMarketplace.Models;
using BackendMarketplace.Services;
using Microsoft.AspNetCore.Mvc;

namespace BackendMarketplace.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController : ControllerBase
    {
        private readonly ProductService _productService;

        public ProductsController(ProductService productService)
        {
            _productService = productService;
        }

        [HttpPost]
        public async Task<IActionResult> AddProduct([FromBody] ProductModel product)
        {
            var id = await _productService.AddProduct(product);
            return CreatedAtAction(nameof(GetProductById), new { id }, product);
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
        public async Task<IActionResult> UpdateProduct(int id, [FromBody] ProductModel product)
        {
            if (id != product.Id)
                return BadRequest("ID mismatch");

            var updatedProduct = await _productService.UpdateProduct(product);

            if (updatedProduct == null)
                return NotFound();

            return Ok(updatedProduct);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            var deleted = await _productService.DeleteProduct(id);

            if (!deleted)
                return NotFound();

            return NoContent();
        }
    }
}