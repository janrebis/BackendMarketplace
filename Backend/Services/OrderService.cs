using BackendMarketplace.Dtos;
using BackendMarketplace.Models;
using BackendMarketplace.Repositories;

namespace BackendMarketplace.Services
{
    public class OrderService : IOrderService
    {
        private readonly IOrderRepository _orderRepository;
        private readonly IProductRepository _productRepository;

        public OrderService(
            IOrderRepository orderRepository,
            IProductRepository productRepository)
        {
            _orderRepository = orderRepository;
            _productRepository = productRepository;
        }

        public async Task<OrderResponse> PlaceOrder(CreateOrderRequest request, string buyerId)
        {
            var items = new List<OrderItemModel>();

            foreach (var line in request.Items)
            {
                var product = await _productRepository.GetProductById(line.ProductId);

                if (product == null)
                    throw new KeyNotFoundException($"Product {line.ProductId} was not found.");

                if (product.OwnerId == buyerId)
                    throw new InvalidOperationException($"You cannot buy your own listing '{product.Name}'.");

                // Price/name are snapshotted server-side from the current product
                // record - the client never gets to dictate what it pays.
                items.Add(new OrderItemModel
                {
                    ProductId = product.Id,
                    ProductName = product.Name,
                    UnitPrice = product.Price,
                    Quantity = line.Quantity
                });
            }

            var order = new OrderModel
            {
                BuyerId = buyerId,
                Items = items,
                TotalPrice = items.Sum(i => i.UnitPrice * i.Quantity),
                CreatedAt = DateTime.UtcNow
            };

            var created = await _orderRepository.AddOrder(order);

            return MapToResponse(created);
        }

        public async Task<List<OrderResponse>> GetMyOrders(string buyerId)
        {
            var orders = await _orderRepository.GetOrdersByBuyer(buyerId);

            return orders
                .Select(MapToResponse)
                .ToList();
        }

        public async Task<OrderResponse?> GetOrderById(int id, string buyerId)
        {
            var order = await _orderRepository.GetOrderById(id);

            if (order == null)
                return null;

            if (order.BuyerId != buyerId)
                throw new UnauthorizedAccessException("You are not the owner of this order.");

            return MapToResponse(order);
        }

        private static OrderResponse MapToResponse(OrderModel order)
        {
            return new OrderResponse
            {
                Id = order.Id,
                BuyerId = order.BuyerId,
                TotalPrice = order.TotalPrice,
                CreatedAt = order.CreatedAt,
                Items = order.Items
                    .Select(i => new OrderItemResponse
                    {
                        ProductId = i.ProductId,
                        ProductName = i.ProductName,
                        UnitPrice = i.UnitPrice,
                        Quantity = i.Quantity
                    })
                    .ToList()
            };
        }
    }
}
