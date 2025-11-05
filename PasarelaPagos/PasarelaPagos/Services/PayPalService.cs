using RestSharp;
using System.Text;
using System.Text.Json;

namespace PasarelaPagos.Services
{
    public class PayPalService
    {
        private readonly IConfiguration _configuration;
        private string _accessToken;

        public PayPalService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        // Obtener el token de acceso desde PayPal
        public async Task<string> GetAccessToken()
        {
            var clientId = _configuration["PayPal:ClientId"];
            var secretKey = _configuration["PayPal:SecretKey"];
            var baseUrl = _configuration["PayPal:BaseUrl"];

            var client = new RestClient($"{baseUrl}/v1/oauth2/token");
            var request = new RestRequest();
            request.Method = Method.Post;

            request.AddHeader("Content-Type", "application/x-www-form-urlencoded");
            request.AddHeader("Authorization", "Basic " + Convert.ToBase64String(Encoding.UTF8.GetBytes($"{clientId}:{secretKey}")));
            request.AddParameter("grant_type", "client_credentials");

            var response = await client.ExecuteAsync(request);

            if (response.IsSuccessful)
            {
                var json = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(response.Content);

                if (json != null && json.TryGetValue("access_token", out var accessTokenElement))
                {
                    _accessToken = accessTokenElement.GetString();
                    return _accessToken;
                }
            }

            throw new Exception($"Error al obtener el token de acceso de PayPal: {response.Content}");
        }

        // Crear un pago en PayPal
        public async Task<string> CreatePayment(decimal amount, string description)
        {
            if (string.IsNullOrEmpty(_accessToken))
            {
                _accessToken = await GetAccessToken();
            }

            var client = new RestClient($"{_configuration["PayPal:BaseUrl"]}/v1/payments/payment");
            var request = new RestRequest();
            request.Method = Method.Post;

            request.AddHeader("Content-Type", "application/json");
            request.AddHeader("Authorization", $"Bearer {_accessToken}");

            // Convertir el monto al formato requerido por PayPal
            var formattedAmount = amount.ToString("F2", System.Globalization.CultureInfo.InvariantCulture);

            var paymentData = new
            {
                intent = "sale",
                payer = new { payment_method = "paypal" },
                transactions = new[]
                {
                    new
                    {
                        amount = new { total = formattedAmount, currency = "USD" },
                        description
                    }
                },
                redirect_urls = new
                {
                    return_url = "https://tusitio.com/success",
                    cancel_url = "https://tusitio.com/cancel"
                }
            };

            // Log del cuerpo del JSON para verificar
            Console.WriteLine(JsonSerializer.Serialize(paymentData));

            request.AddJsonBody(paymentData);
            var response = await client.ExecuteAsync(request);

            if (response.IsSuccessful)
            {
                var json = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(response.Content);

                if (json != null && json.TryGetValue("links", out var linksElement))
                {
                    foreach (var link in linksElement.EnumerateArray())
                    {
                        if (link.TryGetProperty("rel", out var relElement) &&
                            relElement.GetString() == "approval_url" &&
                            link.TryGetProperty("href", out var hrefElement))
                        {
                            return hrefElement.GetString();
                        }
                    }
                }
            }

            throw new Exception($"Error al crear el pago en PayPal: {response.Content}");
        }
    }
}
