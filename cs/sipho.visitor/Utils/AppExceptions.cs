namespace sipho.visitor.Utils;

public class AppItemNotFoundException : Exception
{
    public AppItemNotFoundException()
    {
    }

    public AppItemNotFoundException(string? message) : base(message)
    {
    }

    public AppItemNotFoundException(string? message, Exception? innerException) : base(message, innerException)
    {
    }

}

public class AppItemExistingException : Exception
{
    public AppItemExistingException()
    {
    }

    public AppItemExistingException(string? message) : base(message)
    {
    }

    public AppItemExistingException(string? message, Exception? innerException) : base(message, innerException)
    {
    }

}
