namespace BackendMarketplace.Dtos
{
    public class OrderItemResponse
    {
        public int ProductId { get; set; }

        public string ProductName { get; set; } = string.Empty;

        public decimal UnitPrice { get; set; }

        public int Quantity { get; set; }

        public decimal LineTotal => UnitPrice * Quantity;
    }

    public class OrderResponse
    {
        public int Id { get; set; }

        public string BuyerId { get; set; } = string.Empty;

        public decimal TotalPrice { get; set; }

        public DateTime CreatedAt { get; set; }

        public List<OrderItemResponse> Items { get; set; } = new();
    }
}
