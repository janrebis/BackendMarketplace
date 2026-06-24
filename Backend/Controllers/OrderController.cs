using BackendMarketplace.Dtos;
using BackendMarketplace.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace BackendMarketplace.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class OrdersController : ControllerBase
    {
        private readonly IOrderService _orderService;

        public OrdersController(IOrderService orderService)
        {
            _orderService = orderService;
        }

        [HttpPost]
        public async Task<IActionResult> PlaceOrder([FromBody] CreateOrderRequest request)
        {
            var buyerId = GetCurrentUserId();

            var order = await _orderService.PlaceOrder(request, buyerId);

            return CreatedAtAction(
                nameof(GetOrderById),
                new { id = order.Id },
                order);
        }

        [HttpGet]
        public async Task<IActionResult> GetMyOrders()
        {
            var buyerId = GetCurrentUserId();

            var orders = await _orderService.GetMyOrders(buyerId);

            return Ok(orders);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetOrderById(int id)
        {
            var buyerId = GetCurrentUserId();

            var order = await _orderService.GetOrderById(id, buyerId);

            if (order == null)
                return NotFound();

            return Ok(order);
        }

        private string GetCurrentUserId()
        {
            return User.FindFirstValue(ClaimTypes.NameIdentifier)
                ?? throw new UnauthorizedAccessException("User id not found in token.");
        }
    }
}
