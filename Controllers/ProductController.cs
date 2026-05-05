using Microsoft.AspNetCore.Mvc;

using Microsoft.AspNetCore.Mvc;
using BackendMarketplace.Models;
using BackendMarketplace.Services;

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

        // POST: api/products
        [HttpPost]
        public async Task<IActionResult> AddProduct([FromBody] ProductModel product)
        {
            var id = await _productService.AddProduct(product);
            return CreatedAtAction(nameof(GetProductById), new { id }, product);
        }

        // GET: api/products/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetProductById(int id)
        {
            var product = await _productService.GetProductById(id);

            if (product == null)
                return NotFound();

            return Ok(product);
        }

        // PUT: api/products/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProduct(int id, [FromBody] ProductModel product)
        {
            if (id != product.Id)
                return BadRequest("ID mismatch");

            var updated = await _productService.UpdateProduct(product);

            return Ok(updated);
        }

        // DELETE: api/products/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            await _productService.DeleteProduct(id);
            return NoContent();
        }
    }
}
