namespace sipho.visitor.Configuration
{
    public class OdooSettings
    {
        public string ApiBaseUrl { get; set; } = string.Empty;
        public string ApiKey { get; set; } = string.Empty;
        // Add other Odoo specific settings like company ID, product ID etc.
    }
}