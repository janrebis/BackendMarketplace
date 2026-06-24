using BackendMarketplace.Models;

namespace BackendMarketplace.Repositories
{
    public interface IOrderRepository
    {
        Task<OrderModel> AddOrder(OrderModel order);

        Task<List<OrderModel>> GetOrdersByBuyer(string buyerId);

        Task<OrderModel?> GetOrderById(int id);
    }
}
