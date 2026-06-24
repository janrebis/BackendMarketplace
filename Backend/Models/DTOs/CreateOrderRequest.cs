using System.ComponentModel.DataAnnotations;

namespace BackendMarketplace.Dtos
{
    public class OrderItemRequest
    {
        [Required]
        public int ProductId { get; set; }

        [Range(1, 1000)]
        public int Quantity { get; set; }
    }

    public class CreateOrderRequest
    {
        [Required]
        [MinLength(1, ErrorMessage = "An order must contain at least one item.")]
        public List<OrderItemRequest> Items { get; set; } = new();
    }
}
