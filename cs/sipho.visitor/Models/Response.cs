namespace sipho.visitor.Models;

public static class Response
{


    public interface IErrorResponse
    {
        string Title { get; }
        string Message { get; set; }
        int StatusCode { get; }
    }

    public struct ErrorResponse(string message) : IErrorResponse
    {
        public string Title { get; } = "An unexpected error occurred";

        public string Message { get; set; } = message ?? "An unexpected error occurred.";

        [DefaultValue(500)]
        public int StatusCode { get; } = 500;
    }

    public struct NotFoundResponse(string message) : IErrorResponse
    {
        public string Title { get; } = "Resource not found";

        public string Message { get; set; } = message ?? "The requested resource could not be found.";

        [DefaultValue(404)]
        public int StatusCode { get; } = 404;
    }

    public struct ConflictResponse(string message) : IErrorResponse
    {
        public string Title { get; } = "Resource in conflict";

        public string Message { get; set; } = message ?? "The requested resource is in conflict.";

        [DefaultValue(409)]
        public int StatusCode { get; } = 409;
    }

    public struct BadRequestResponse(string message) : IErrorResponse
    {
        public string Title { get; } = "Bad request";
        public string Message { get; set; } = message ?? "The request was invalid or cannot be otherwise served.";

        [DefaultValue(400)]
        public int StatusCode { get; } = 400;
    }
}
