using BackendMarketplace.Dtos;

namespace BackendMarketplace.Services
{
    public interface IOrderService
    {
        Task<OrderResponse> PlaceOrder(CreateOrderRequest request, string buyerId);

        Task<List<OrderResponse>> GetMyOrders(string buyerId);

        Task<OrderResponse?> GetOrderById(int id, string buyerId);
    }
}
