using Microsoft.Extensions.Options;
using sipho.visitor.Configuration;
using sipho.visitor.Models.DTOs;
using System.Net.Http.Headers;
using System.Text.Json;

namespace sipho.visitor.Services
{
    public class OdooService : IOdooService
    {
        private readonly HttpClient _httpClient;
        private readonly ILogger<OdooService> _logger;
        private readonly OdooSettings _odooSettings;

        public OdooService(HttpClient httpClient, ILogger<OdooService> logger, IOptions<OdooSettings> odooSettings)
        {
            this._httpClient = httpClient;
            this._logger = logger;
            this._odooSettings = odooSettings.Value;

            // Ensure BaseAddress is set, though it's also set in Program.cs
            if (this._httpClient.BaseAddress == null && !string.IsNullOrEmpty(this._odooSettings.ApiBaseUrl))
            {
                this._httpClient.BaseAddress = new Uri(this._odooSettings.ApiBaseUrl);
            }

            // Add API key to default request headers if available
            if (!string.IsNullOrEmpty(this._odooSettings.ApiKey))
            {
                this._httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", this._odooSettings.ApiKey);
            }
        }

        public async Task<bool> GenerateBillAsync(OdooBillRequest billData)
        {
            this._logger.LogInformation("Attempting to generate Odoo bill for license plate: {LicensePlate}", billData.LicensePlate);

            try
            {
                // Example Odoo API endpoint (adjust as per actual Odoo API)
                var requestUri = "api/v1/invoices"; // This is a placeholder, replace with actual Odoo API endpoint

                var jsonContent = JsonSerializer.Serialize(billData, new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase });
                var content = new StringContent(jsonContent, System.Text.Encoding.UTF8, "application/json");

                var response = await this._httpClient.PostAsync(requestUri, content);

                if (response.IsSuccessStatusCode)
                {
                    this._logger.LogInformation("Odoo bill successfully generated for {LicensePlate}. Status: {StatusCode}", billData.LicensePlate, response.StatusCode);
                    // Optionally parse response to get Odoo's bill ID
                    // var responseContent = await response.Content.ReadAsStringAsync();
                    // var odooResponse = JsonSerializer.Deserialize<OdooApiResponse>(responseContent);
                    // return odooResponse?.BillId;
                    return true;
                }
                else
                {
                    var errorContent = await response.Content.ReadAsStringAsync();
                    this._logger.LogError("Failed to generate Odoo bill for {LicensePlate}. Status: {StatusCode}, Response: {ErrorContent}",
                        billData.LicensePlate, response.StatusCode, errorContent);
                    return false;
                }
            }
            catch (HttpRequestException ex)
            {
                this._logger.LogError(ex, "HTTP request error while generating Odoo bill for {LicensePlate}: {Message}", billData.LicensePlate, ex.Message);
                return false;
            }
            catch (JsonException ex)
            {
                this._logger.LogError(ex, "JSON serialization error while generating Odoo bill for {LicensePlate}: {Message}", billData.LicensePlate, ex.Message);
                return false;
            }
            catch (Exception ex)
            {
                this._logger.LogError(ex, "An unexpected error occurred while generating Odoo bill for {LicensePlate}: {Message}", billData.LicensePlate, ex.Message);
                return false;
                throw new InvalidOperationException(
                    $"An unexpected error occurred while generating Odoo bill for {billData.LicensePlate}.",
                    ex
                );
            }
        }
    }
}
