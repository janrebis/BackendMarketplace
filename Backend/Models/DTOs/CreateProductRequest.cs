using System.ComponentModel.DataAnnotations;
using BackendMarketplace.Models;

namespace BackendMarketplace.Dtos
{
    public class CreateProductRequest
    {
        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        [Range(0.01, 999999)]
        public decimal Price { get; set; }

        [MaxLength(1000)]
        public string Description { get; set; } = string.Empty;

        [MaxLength(500)]
        public string ImageUrl { get; set; } = string.Empty;

        [EnumDataType(typeof(ProductCategory))]
        public ProductCategory Category { get; set; }
    }
}