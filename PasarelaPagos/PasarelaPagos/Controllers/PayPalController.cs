using Microsoft.AspNetCore.Mvc;
using PasarelaPagos.Services;

namespace PasarelaPagos.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PayPalController : ControllerBase
    {
        private readonly PayPalService _payPalService;

        public PayPalController(PayPalService payPalService)
        {
            _payPalService = payPalService;
        }

        [HttpPost("create-payment")]
        public async Task<IActionResult> CreatePayment([FromBody] PaymentRequest request)
        {
            if (request == null)
            {
                return BadRequest(new { error = "El cuerpo de la solicitud es nulo" });
            }

            if (request.Amount <= 0 || string.IsNullOrEmpty(request.Description))
            {
                return BadRequest(new { error = "Los datos enviados son inválidos" });
            }

            try
            {
                var approvalUrl = await _payPalService.CreatePayment(request.Amount, request.Description);
                return Ok(new { approval_url = approvalUrl });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }
    }

    public class PaymentRequest
    {
        public decimal Amount { get; set; }
        public string Description { get; set; }
    }
}
