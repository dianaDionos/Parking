namespace sipho.visitor.Configuration
{
    public class ParkingSettings
    {
        public int FreeParkingDurationMinutes { get; set; } = 15; // Default to 15 minutes
        public decimal HourlyRate { get; set; } = 5000.00m; // Default to 5000 COP per hour
    }
}