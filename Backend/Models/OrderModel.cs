namespace BackendMarketplace.Models
{
    public class OrderModel
    {
        public int Id { get; set; }

        public string BuyerId { get; set; } = string.Empty;

        public ApplicationUser? Buyer { get; set; }

        public List<OrderItemModel> Items { get; set; } = new();

        public decimal TotalPrice { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
