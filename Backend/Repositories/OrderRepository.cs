using BackendMarketplace.Data;
using BackendMarketplace.Models;
using Microsoft.EntityFrameworkCore;

namespace BackendMarketplace.Repositories
{
    public class OrderRepository : IOrderRepository
    {
        private readonly ApplicationDbContext _context;

        public OrderRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<OrderModel> AddOrder(OrderModel order)
        {
            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            return order;
        }

        public async Task<List<OrderModel>> GetOrdersByBuyer(string buyerId)
        {
            return await _context.Orders
                .Include(o => o.Items)
                .Where(o => o.BuyerId == buyerId)
                .OrderByDescending(o => o.CreatedAt)
                .ToListAsync();
        }

        public async Task<OrderModel?> GetOrderById(int id)
        {
            return await _context.Orders
                .Include(o => o.Items)
                .FirstOrDefaultAsync(o => o.Id == id);
        }
    }
}
