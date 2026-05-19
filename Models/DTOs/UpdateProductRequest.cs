using System.ComponentModel.DataAnnotations;

namespace BackendMarketplace.Dtos
{
    public class UpdateProductRequest
    {
        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        [Range(0.01, 999999)]
        public decimal Price { get; set; }

        [MaxLength(1000)]
        public string Description { get; set; } = string.Empty;
    }
}