namespace BackendMarketplace.Models
{
    public class OrderItemModel
    {
        public int Id { get; set; }

        public int OrderId { get; set; }

        public OrderModel? Order { get; set; }

        public int ProductId { get; set; }

        public ProductModel? Product { get; set; }

        // Snapshot of the product at purchase time, so later edits or
        // deletion of the product don't change historical order data.
        public string ProductName { get; set; } = string.Empty;

        public decimal UnitPrice { get; set; }

        public int Quantity { get; set; }
    }
}
