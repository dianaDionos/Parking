using System.Diagnostics;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using sipho.visitor.Models.DTOs;
using sipho.visitor.Services;
using sipho.visitor.Utils;
using Swashbuckle.AspNetCore.Annotations;
using static sipho.visitor.Models.Response;

namespace sipho.visitor.Controllers
{

    /// <summary>
    /// Sipho Visitor Controller
    /// </summary>
    [Route("api/v1/visitor")]
    [ApiController]
    [Produces("application/json")]
    // [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError, Type = typeof(ErrorResponse))]
    [ProducesResponseType(StatusCodes.Status404NotFound, Type = typeof(NotFoundResponse))]
    [ProducesResponseType(StatusCodes.Status409Conflict, Type = typeof(ConflictResponse))]
    public class VisitorController : ApiControllerBase
    {

        #region Constant error messages
        private const string ErrorSavingEntryMessage = "Error saving visitor entry: {Message}";
        private const string ErrorSavingExitMessage = "Error recording visitor exit: {Message}";
        private const string ErrorQueryMessage = "Error querying: {Message}";
        private const string ErrorUnexpectedMessage = "An unexpected error occurred during {Event}.";


        #endregion

        [HttpPost(Order = 11)]
        [SwaggerOperation(
            Summary = "Register a visitor entry event",
            Description = "Registers a new visitor entry event with the provided details.",
            OperationId = "VisitorEventEntry",
            Tags = new[] { "Visitor" }
        )]
        [ProducesResponseType(StatusCodes.Status201Created, Type = typeof(VisitorEntryResponse))]
        [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(BadRequestResponse))]
        public async Task<IActionResult> VisitorEventEntry(
            [FromBody, SwaggerRequestBody("The visitor entry payload", Required = true)] VisitorEntryRequest request,
            [FromServices] IVisitorService visitorService,
            ILogger<VisitorEntryRequest> logger
        )
        {

            if (!this.ModelState.IsValid)
            {
                return this.BadRequest(this.ModelState);
            }

            try
            {
                var response = await visitorService.SetEventEntryAsync(request);

                return this.CreatedAtAction(nameof(GetActiveVisitorEventById), new { id = response.EventId }, response);
            }
            catch (AppItemExistingException ex)
            {
                logger.LogError(ex, ErrorQueryMessage, ex.Message);
                return this.Conflict(new ConflictResponse(ex.Message));
            }
            catch (System.Data.Common.DbException ex)
            {
                logger.LogError(ex, ErrorSavingEntryMessage, ex.Message);
                return this.Problem(ex.Message);
            }
            catch (InvalidOperationException ex)
            {
                var exdb = ex.InnerException as System.Data.Common.DbException;

                if (exdb is not null)
                {
                    logger.LogError(ex, "Error saving visitor exit: {Message}", exdb.Message);
                    return this.Problem(exdb.Message);
                }

                logger.LogError(ex, ErrorSavingEntryMessage, ex.Message);
                return this.Conflict(new ConflictResponse(ex.Message));
            }
            /*
            // catch (Exception ex)
            // {
            //     logger.LogError(ex, ErrorUnexpectedMessage, "visitor entry");
            //     return this.Problem("An unexpected error occurred during visitor entry");
            // }
            */
        }

        [SuppressModelStateInvalidFilter]
        [HttpPost("w", Order = 12)]
        [SwaggerOperation(
            Summary = "Register a visitor entry event",
            Description = "Registers a new visitor entry event with the provided details.",
            OperationId = "VisitorEventWEntry",
            Tags = new[] { "Visitor_w" }
        )]
        [ProducesResponseType(StatusCodes.Status201Created, Type = typeof(ResponseWrapper<VisitorEntryResponse>))]
        [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(BadRequestResponse))]
        public async Task<IActionResult> VisitorEventWEntry(
            [FromBody, SwaggerRequestBody("The visitor entry payload", Required = true)] VisitorEntryRequest request,
            [FromServices] IVisitorService visitorService,
            ILogger<VisitorEntryRequest> logger
        )
        {
            ResponseWrapper<VisitorEntryResponse> responseWrapper = new()
            {
                Message = "Visitor entry created successfully.",
                TraceId = Activity.Current?.Id ?? this.ControllerContext.HttpContext.TraceIdentifier
            };

            if (!this.ModelState.IsValid)
            {
                var errors = this.ModelState.Where(e => e.Value?.Errors.Count > 0).Select(e => e.Value?.Errors?.FirstOrDefault()!.ErrorMessage).ToList();
                responseWrapper.Message = "Invalid visitor entry request.";
                responseWrapper.Validations = errors!;
                responseWrapper.Success = false;
                return this.BadRequest(responseWrapper);
            }

            var response = await visitorService.SetEventEntryAsync(request);
            responseWrapper.Data = response;
            responseWrapper.Success = true;
            // responseWrapper = await visitorService.SetEventEntryAsync(request, responseWrapper);

            return this.CreatedAtAction(nameof(GetActiveVisitorEventById), new { id = responseWrapper.Data.EventId }, responseWrapper);
        }

        [HttpGet("{id:guid}", Order = 22)]
        [SwaggerOperation(
            Summary = "Get active visitor by event Id",
            Description = "Retrieves the details of an active visitor event using the provided Event Id.",
            OperationId = "GetActiveVisitorEventById",
            Tags = new[] { "Visitor" }
        )]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(VisitorEventResponse))]
        public async Task<IActionResult> GetActiveVisitorEventById(
            [SwaggerParameter("Visitor event Id", Required = true)] Guid id,
            [FromServices] IVisitorService visitorService,
            ILogger<VisitorExitRequest> logger
        )
        {
            try
            {
                var response = await visitorService.GetActiveVisitorEventByIdAsync(new VisitorFindRequest { EntryId = id });
                return this.Ok(response);
            }
            catch (AppItemNotFoundException ex)
            {
                logger.LogError(ex, ErrorQueryMessage, ex.Message);
                return this.NotFound(new NotFoundResponse(ex.Message));
            }
            catch (InvalidOperationException ex)
            {
                var exdb = ex.InnerException as System.Data.Common.DbException;

                if (exdb is not null)
                {
                    logger.LogError(ex, ErrorQueryMessage, exdb.Message);
                    return this.Problem(exdb.Message);
                }

                logger.LogError(ex, ErrorQueryMessage, ex.InnerException?.Message);
                return this.Conflict(new ConflictResponse(ex.Message));
            }
            catch (System.Data.Common.DbException ex)
            {
                logger.LogError(ex, ErrorQueryMessage, ex.Message);
                return this.Problem(ex.Message);
            }
            // catch (Exception ex)
            // {
            //     logger.LogError(ex, ErrorUnexpectedMessage, "Queryng visitor event");
            //     return this.Problem("An unexpected error occurred during Queryng visitor event");
            // }
        }

        [HttpGet(Order = 21)]
        [SwaggerOperation(
            Summary = "Get all active visitor events",
            Description = "Retrieves a list of all active visitor events.",
            OperationId = "GetActiveVisitorEvents",
            Tags = new[] { "Visitor" }
        )]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(VisitorEventResponse[]))]
        public async Task<IActionResult> GetActiveVisitorEvents(
            [FromServices] IVisitorService visitorService,
            ILogger<VisitorExitRequest> logger
        )
        {
            try
            {
                var response = await visitorService.GetActiveVisitorEventsAsync();
                return this.Ok(response);
            }
            catch (InvalidOperationException ex)
            {
                var exdb = ex.InnerException as System.Data.Common.DbException;

                if (exdb is not null)
                {
                    logger.LogError(ex, ErrorQueryMessage, exdb.Message);
                    return this.Problem(exdb.Message);
                }

                logger.LogError(ex, ErrorQueryMessage, ex.InnerException?.Message);
                return this.Conflict(new ConflictResponse(ex.Message));
            }
            catch (System.Data.Common.DbException ex)
            {
                logger.LogError(ex, ErrorQueryMessage, ex.Message);
                return this.Problem(ex.Message);
            }
            // catch (Exception ex)
            // {
            //     logger.LogError(ex, ErrorUnexpectedMessage, "Queryng visitor event");
            //     return this.Problem("An unexpected error occurred during Queryng visitor event");
            // }
        }

        /// <summary>
        ///  Set visitor exit event by ID
        /// </summary>
        /// <param name="id"></param>
        /// <param name="visitorService"></param>
        /// <param name="logger"></param>
        /// <returns></returns>
        [HttpPut("{id}", Order = 31)]
        [SwaggerOperation(
            Summary = "Set visitor exit event by ID",
            Description = "Records the exit of a visitor using the provided Event Id.",
            OperationId = "VisitorEventExit",
            Tags = new[] { "Visitor" }
        )]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(VisitorEventResponse))]
        public async Task<IActionResult> VisitorEventExit(
            [SwaggerParameter("Visitor event Id", Required = true)] Guid id,
            [FromServices] IVisitorService visitorService,
            ILogger<VisitorExitRequest> logger
        )
        {
            var request = new VisitorExitRequest { EntryId = id };

            try
            {
                var response = await visitorService.SetEventExitAsync(request);
                return this.Ok(response);
            }
            catch (AppItemNotFoundException ex)
            {
                logger.LogError(ex, ErrorSavingExitMessage, ex.Message);
                return this.NotFound(new NotFoundResponse(ex!.Message));
            }
            catch (InvalidOperationException ex)
            {
                var exdb = ex.InnerException as System.Data.Common.DbException;

                if (exdb is not null)
                {
                    logger.LogError(ex, ErrorSavingExitMessage, exdb.Message);
                    return this.Problem(exdb.Message);
                }

                logger.LogError(ex, ErrorSavingExitMessage, ex.InnerException?.Message);
                return this.Conflict(new ConflictResponse(ex.Message));

            }
            catch (System.Data.Common.DbException ex)
            {
                logger.LogError(ex, ErrorSavingExitMessage, ex.Message);
                return this.Problem(ex.Message);
            }
            // catch (Exception ex)
            // {
            //     logger.LogError(ex, ErrorUnexpectedMessage, "visitor exit");
            //     return this.Problem("An unexpected error occurred during visitor exit", null, StatusCodes.Status500InternalServerError, "visitor exit");
            // }
        }
    }

    internal class ResponseWrapper<T>
    {
        public T? Data { get; set; }
        public required string Message { get; set; }
        public IList<string> Validations { get; set; } = [];
        public bool Success { get; set; } = false;
        public required string TraceId { get; set; }
    }
}
