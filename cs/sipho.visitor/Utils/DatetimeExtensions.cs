namespace sipho.visitor.Utils;

public static class DatetimeExtensions
{
    /// <summary>
    /// Converts a DateTimeOffset to a DateTime in UTC.
    /// </summary>
    /// <param name="dateTimeOffset">The DateTimeOffset to convert.</param>
    /// <returns>A DateTime in UTC.</returns>
    public static DateTime ToUtcDateTime(this DateTimeOffset dateTimeOffset)
    {
        return dateTimeOffset.UtcDateTime;
    }

    /// <summary>
    /// Truncates a DateTimeOffset to the nearest specified TimeSpan.
    /// This is useful for rounding down to the nearest hour, minute, etc.
    /// For example, if you want to truncate to the nearest hour, you would pass in
    /// TimeSpan.FromHours(1).
    /// </summary>
    /// <param name="dateTime"></param>
    /// <param name="timeSpan"></param>
    /// <returns></returns>
    public static DateTimeOffset Truncate(this DateTimeOffset dateTime, TimeSpan timeSpan)
    {
        if (TimeSpan.Zero.Equals(timeSpan))
        {
            return dateTime; // Or could throw an ArgumentException
        }

        if (DateTime.MinValue.Equals(dateTime) || DateTime.MaxValue.Equals(dateTime))
        {
            return dateTime; // do not modify "guard" values
        }

        return dateTime.AddTicks(-(dateTime.Ticks % timeSpan.Ticks));
    }
}
