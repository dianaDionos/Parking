using System.Globalization;
using Humanizer;
using Microsoft.Extensions.Options;
using sipho.visitor.Configuration;
using sipho.visitor.Data.Repositories;
using sipho.visitor.Models.DTOs;
using sipho.visitor.Models.Entities;
using sipho.visitor.Utils;

namespace sipho.visitor.Services;

/// <summary>
/// Visitor Service
/// </summary>
public class VisitorService : IVisitorService
{
    private readonly IVisitorEventRepository _visitorEventRepository;
    private readonly IVisitorRepository _visitorRepository;
    private readonly IDocumentTypeRepository _documentTypeRepository;
    private readonly IVehicleTypeRepository _vehicleTypeRepository;
    private readonly IOdooService _odooService;
    private readonly ILogger<VisitorService> _logger;
    private readonly ParkingSettings _parkingSettings;

    /// <summary>
    /// Visitor Service Constructor
    /// </summary>
    /// <param name="visitorEventRepository"></param>
    /// <param name="visitorRepository"></param>
    /// <param name="documentTypeRepository"></param>
    /// <param name="odooService"></param>
    /// <param name="logger"></param>
    /// <param name="parkingSettings"></param>
    public VisitorService(
        IVisitorEventRepository visitorEventRepository,
        IVisitorRepository visitorRepository,
        IDocumentTypeRepository documentTypeRepository,
        IVehicleTypeRepository vehicleTypeRepository,
        IOdooService odooService,
        ILogger<VisitorService> logger,
        IOptions<ParkingSettings> parkingSettings)
    {
        this._visitorEventRepository = visitorEventRepository;
        this._visitorRepository = visitorRepository;
        this._documentTypeRepository = documentTypeRepository;
        this._vehicleTypeRepository = vehicleTypeRepository;
        this._odooService = odooService;
        this._logger = logger;
        this._parkingSettings = parkingSettings.Value;
    }

    #region public methods

    /// <summary>
    /// Event Entry Async
    /// </summary>
    /// <param name="request"></param>
    /// <returns></returns>
    public async Task<VisitorEntryResponse> SetEventEntryAsync(VisitorEntryRequest request)
    {
        this._logger.LogInformation("Attempting to record visitor entry for license plate: {LicensePlate}", request.LicensePlate);

        // Check for existing visitor event by document ID
        var existingVisitorEvent = await this._visitorEventRepository.ExistEventWithVisitorByDocumentIdAsync(request.DocumentId);
        if (existingVisitorEvent)
        {
            this._logger.LogWarning("Active visitor event already exists for person with document: {DocumentId}", request.DocumentId);
            throw new InvalidOperationException($"An active visitor event already exists for person with document '{request.DocumentId}'.");
        }


        // Check for active parking event for this license plate
        if (!string.IsNullOrEmpty(request.LicensePlate))
        {

            var existingParkingEvent = await this._visitorEventRepository.ExistEventWithParkingByLicensePlateAsync(request.LicensePlate);
            if (existingParkingEvent)
            {
                this._logger.LogWarning("Active parking event already exists for license plate: {LicensePlate}", request.LicensePlate);
                throw new InvalidOperationException($"An active parking event already exists for license plate '{request.LicensePlate}'.");
            }
        }

        // 1. Validate type fields
        // 1.1 Look up DocumentType
        int DocumentTypeId = request.DocumentTypeId;
        var documentType = await this._documentTypeRepository.GetByIdAsync(DocumentTypeId);
        if (documentType == null)
        {
            this._logger.LogError("Document type '{DocumentTypeId}' not found.", request.DocumentTypeId);
            throw new InvalidOperationException($"Document type with Id '{request.DocumentTypeId}' is not valid.");
        }

        // 1.2 Validate vehicle type
        int VehicleTypeId = request.VehicleTypeId;
        var vehicleType = await this._vehicleTypeRepository.GetByIdAsync(VehicleTypeId);
        if (vehicleType == null)
        {
            this._logger.LogError("Vehicle type '{VehicleTypeId}' not found.", request.VehicleTypeId);
            throw new InvalidOperationException($"Vehicle type with Id '{request.VehicleTypeId}' is not valid.");
        }


        // 2. Check if Visitor already exists
        var visitor = await this._visitorRepository.GetByDocumentIdAndTypeAsync(request.DocumentId, documentType.DocumentTypeId);

        if (visitor is null)
        {
            // 3. If Visitor doesn't exist, create a new one
            visitor = new Person
            {
                GivenNames = request.GivenNames,
                SurNames = request.SurNames,
                DocumentId = request.DocumentId,
                DocumentTypeId = documentType.DocumentTypeId,
                PhoneNumber = request.PhoneNumber,
                Email = request.Email
            };
            visitor = await this._visitorRepository.AddAsync(visitor);
            this._logger.LogInformation("New visitor created with ID: {VisitorId}", visitor.PersonId);
        }
        else
        {
            // Optionally update visitor details if they've changed
            bool updated = false;
            if (visitor.GivenNames != request.GivenNames) { visitor.GivenNames = request.GivenNames; updated = true; }
            if (visitor.SurNames != request.SurNames) { visitor.SurNames = request.SurNames; updated = true; }
            if (visitor.PhoneNumber != request.PhoneNumber) { visitor.PhoneNumber = request.PhoneNumber; updated = true; }
            if (visitor.Email != request.Email) { visitor.Email = request.Email; updated = true; }

            if (updated)
            {
                await this._visitorRepository.UpdateAsync(visitor);
                this._logger.LogInformation("Existing visitor {VisitorId} details updated.", visitor.PersonId);
            }
            this._logger.LogInformation("Existing visitor found with ID: {VisitorId}", visitor.PersonId);
        }

        // 4. Create ParkingEvent entity
        var visitorEvent = new VisitorEvent
        {
            EntryTimestamp = DateTimeOffset.UtcNow.Truncate(TimeSpan.FromMinutes(1)),
            VisitorId = visitor.PersonId,
            UnitNumberDesc = request.UnitNumberDesc,
        };

        if (!string.IsNullOrEmpty(request.LicensePlate))
        {
            visitorEvent.ParkingEntry = new ParkingEvent
            {
                EntryTimestamp = DateTimeOffset.UtcNow.Truncate(TimeSpan.FromMinutes(1)),
                LicensePlate = request.LicensePlate,
                IsFreeParking = true, // Assume free until exit calculation
                CalculatedCost = 0, // Initial cost
                VehicleTypeId = request.VehicleTypeId,
                ParkingSpaceNumberDesc = request.ParkingSpaceNumberDesc,
            };
        }

        visitorEvent = await this._visitorEventRepository.AddEventAsync(visitorEvent);
        this._logger.LogInformation("visitor entry recorded for person with document: {VisitorDocumentId}, Event ID: {EventId}", request.DocumentId, visitorEvent.EventId);

        VisitorEntryResponse visitorEntryResponse = new(visitorEvent);

        return visitorEntryResponse;

    }

    /// <summary>
    /// Get Active Event By Id And Calculate Cost Async
    /// </summary>
    /// <param name="request"></param>
    /// <returns></returns>
    /// <exception cref="NotImplementedException"></exception>
    public async Task<VisitorEventResponse> GetActiveVisitorEventByIdAsync(VisitorFindRequest request)
    {
        this._logger.LogDebug("Attempting to record visitor exit for license plate: {LicensePlate}", request.LicensePlate);

        // Retrieve pending ParkingEvent by license plate, eager-loading Visitor and DocumentType
        VisitorEvent? visitorEvent = default;
        if (request.EntryId.HasValue)
        {
            visitorEvent = await this._visitorEventRepository.GetActiveEventWithVisitorByIdAsync(request.EntryId.Value);
        }
        else if (string.IsNullOrEmpty(request.LicensePlate))
        {
            visitorEvent = await this._visitorEventRepository.GetEventWithVisitorByLicensePlateAsync(request.LicensePlate ?? string.Empty);
        }

        if (visitorEvent == null)
        {
            if (request.EntryId.HasValue)
            {
                this._logger.LogWarning("No active visitor event found for Entry Id: {EntryId}", request.EntryId);
                throw new AppItemNotFoundException($"No active visitor event found for Entry Id '{request.EntryId}'.");
            }
            else if (string.IsNullOrEmpty(request.LicensePlate))
            {
                this._logger.LogWarning("No active visitor event found for license plate: {LicensePlate}", request.LicensePlate);
                throw new AppItemNotFoundException($"No active visitor event found for license plate '{request.LicensePlate}'.");
            }

            this._logger.LogWarning("No active visitor event found for Entry Id: {EntryId} or license plate: {LicensePlate}", request.EntryId, request.LicensePlate);
            throw new InvalidOperationException($"No active visitor event found for Entry Id '{request.EntryId}' or license plate: {request.LicensePlate}.");
        }

        if (visitorEvent.ExitTimestamp != null)
        {
            this._logger.LogWarning("Parking event for license plate {LicensePlate} already exited at {ExitTime}", request.LicensePlate, visitorEvent.ExitTimestamp);
            throw new InvalidOperationException($"Parking event for license plate '{request.LicensePlate}' has already exited.");
        }

        if (visitorEvent.ParkingEntry is not null)
        {
            visitorEvent.ParkingEntry = this.CalculateEventCost(visitorEvent, false);
        }

        VisitorEventResponse visitorEventResponse = new(visitorEvent);

        return visitorEventResponse;
    }


    public async Task<ICollection<VisitorEventResponse>> GetActiveVisitorEventsAsync()
    {

        IReadOnlyCollection<VisitorEvent> visitorEvents = await this._visitorEventRepository.GetActiveEventsWithVisitorAsync();

        ICollection<VisitorEventResponse> visitorEventsResponse = [];
        foreach (var visitorEvent in visitorEvents)
        {
            if (visitorEvent.ParkingEntry is not null)
            {
                visitorEvent.ParkingEntry = this.CalculateEventCost(visitorEvent, false);
            }
            visitorEventsResponse.Add(new VisitorEventResponse(visitorEvent));
        }

        return visitorEventsResponse;
    }

    /// <summary>
    /// Event Exit And Calculate Cost Async
    /// </summary>
    /// <param name="request"></param>
    /// <returns></returns>
    /// <exception cref="InvalidOperationException"></exception>
    public async Task<VisitorEventResponse> SetEventExitAsync(VisitorExitRequest request)
    {
        this._logger.LogDebug("Attempting to record visitor exit for Entry Id: {LicensePlate}", request.EntryId);

        // Retrieve pending ParkingEvent by license plate, eager-loading Visitor and DocumentType
        VisitorEvent? recordVisitorEvent = await this._visitorEventRepository.GetActiveEventWithVisitorByIdAsync(request.EntryId);

        if (recordVisitorEvent is null)
        {
            this._logger.LogWarning("No active visitor event found for Entry Id: {EntryId}", request.EntryId);
            throw new AppItemNotFoundException($"No active visitor event found for Entry Id '{request.EntryId}'.");
        }

        if (recordVisitorEvent.ExitTimestamp != null)
        {
            this._logger.LogWarning("Visitor event person with document: {VisitorDocumentId} already exited at {ExitTime}", recordVisitorEvent.Visitor.DocumentId, recordVisitorEvent.ExitTimestamp);
            throw new InvalidOperationException($"Parking event for person with document '{recordVisitorEvent.Visitor.DocumentId}' has already exited.");
        }

        if (recordVisitorEvent.ParkingEntry?.ExitTimestamp != null)
        {
            this._logger.LogWarning("Parking event for license plate {LicensePlate} already exited at {ExitTime}", recordVisitorEvent.ParkingEntry?.LicensePlate, recordVisitorEvent.ParkingEntry?.ExitTimestamp);
            throw new InvalidOperationException($"Parking event for license plate '{recordVisitorEvent.ParkingEntry?.LicensePlate}' has already exited.");
        }

        VisitorEvent visitorEvent = await this.ProcessEventPayment(recordVisitorEvent!);

        await this._visitorEventRepository.UpdateEventAsync(visitorEvent);
        this._logger.LogInformation("Visitor event updated for person with document: {VisitorDocumentId}, Event ID: {EventId}", visitorEvent.Visitor.DocumentId, visitorEvent.EventId);

        return new VisitorEventResponse(visitorEvent);
    }

    #endregion

    #region private methods


    private async Task<VisitorEvent> ProcessEventPayment(VisitorEvent visitorEvent)
    {
        await Task.Delay(1); // Simulate async operation

        if (visitorEvent.ExitTimestamp is not null)
        {
            this._logger.LogWarning("Visitor event with ID {EventId} already has an exit timestamp.", visitorEvent.EventId);
            throw new InvalidOperationException($"Visitor event with ID '{visitorEvent.EventId}' already has been closed.");
        }

        visitorEvent.ExitTimestamp = DateTimeOffset.UtcNow.Truncate(TimeSpan.FromMinutes(1));

        // Calculate cost for the parking event if it exists
        if (visitorEvent.ParkingEntry is not null)
        {
            var ParkingCalculated = this.CalculateEventCost(visitorEvent, true);

            if (ParkingCalculated.IsPendingForBilling)
            {
                ParkingCalculated.ExitTimestamp = visitorEvent.ExitTimestamp;
            }

            visitorEvent.ParkingEntry = ParkingCalculated;


            VisitorEvent visitorEventOut = await this.GenerateEventElectronicBillAsync(visitorEvent);

            visitorEvent = visitorEventOut;
        }

        return visitorEvent;
    }

    private ParkingEvent CalculateEventCost(VisitorEvent visitorEvent, bool isForExit = false)
    {
        ParkingEvent? parkingEvent = visitorEvent.ParkingEntry;

        if (parkingEvent is null)
        {
            this._logger.LogError("Parking entry is null for VisitorEvent with ID {EventId}.", visitorEvent.EventId);
            return visitorEvent.ParkingEntry!;
        }

        if (parkingEvent.ExitTimestamp is not null)
        {
            this._logger.LogWarning("Parking event with ID {EventId} already has an exit timestamp.", parkingEvent.EventId);
            return parkingEvent;
        }

        DateTimeOffset exitTimestamp = !isForExit ? DateTimeOffset.UtcNow : visitorEvent.ExitTimestamp ?? DateTimeOffset.UtcNow;

        var duration = exitTimestamp - visitorEvent.ParkingEntry.EntryTimestamp;
        double chargeableMinutes = 0D;
        double durationMinutes = double.Ceiling(duration.TotalMinutes);
        string durationHuman = TimeSpan.FromMinutes(durationMinutes).Humanize(3, culture: CultureInfo.CurrentCulture);

        this._logger.LogInformation("Parking duration for {LicensePlate}: {DurationMinutes} minutes.", parkingEvent.LicensePlate, durationHuman);

        if (isForExit)
        {
            parkingEvent.ExitTimestamp = exitTimestamp.Truncate(TimeSpan.FromMinutes(1));
            parkingEvent.IsPendingForBilling = true;
        }
        // Apply free period logic
        if (durationMinutes <= this._parkingSettings.FreeParkingDurationMinutes)
        {
            parkingEvent.CalculatedCost = 0;
            parkingEvent.IsFreeParking = true;
            this._logger.LogInformation("Parking for {LicensePlate} is free (duration: {DurationMinutes} min).", parkingEvent.LicensePlate, durationHuman);
        }
        else
        {
            parkingEvent.IsFreeParking = false;
            // Calculate charged fee
            chargeableMinutes = durationMinutes - this._parkingSettings.FreeParkingDurationMinutes;
            string chargeableHuman = TimeSpan.FromMinutes(chargeableMinutes).ToString(@"hh\:mm");
            decimal hourlyRate = this._parkingSettings.HourlyRate;
            parkingEvent.CalculatedCost = decimal.Round(Convert.ToDecimal(chargeableMinutes / 60) * hourlyRate, 0);
            this._logger.LogInformation("Parking for {LicensePlate} charged: {Cost:C} (duration: {DurationMinutes} min, chargeable: {ChargeableMinutes} min).", parkingEvent.LicensePlate, parkingEvent.CalculatedCost, durationHuman, chargeableHuman);
        }

        parkingEvent.MinutesTotal = durationMinutes;
        parkingEvent.MinutesChargeable = chargeableMinutes;

        return parkingEvent;
    }

    private async Task<VisitorEvent> GenerateEventElectronicBillAsync(VisitorEvent visitorEvent)
    {
        ParkingEvent parkingEvent = visitorEvent.ParkingEntry ?? throw new InvalidOperationException("Parking entry is required for cost calculation.");

        if (
            parkingEvent.CalculatedCost > 0
            && parkingEvent.IsPendingForBilling
            && !parkingEvent.IsFreeParking
            && !string.IsNullOrEmpty(parkingEvent.LicensePlate)
        )
        {
            var odooBillRequest = new OdooBillRequest
            {
                LicensePlate = parkingEvent.LicensePlate,
                EntryTime = parkingEvent.EntryTimestamp,
                ExitTime = parkingEvent.ExitTimestamp!.Value,
                Amount = parkingEvent.CalculatedCost,
                VisitorDocumentId = visitorEvent.Visitor.DocumentId,
                VisitorDocumentTypeName = visitorEvent.Visitor.DocumentType.Name,
                VisitorNames = visitorEvent.Visitor.GivenNames,
                VisitorSurnames = visitorEvent.Visitor.SurNames,
                VisitorPhoneNumber = visitorEvent.Visitor.PhoneNumber,
                VisitorEmail = visitorEvent.Visitor.Email,
                Description = $"Parqueo del vehiculo con placa: {parkingEvent.LicensePlate} desde {parkingEvent.EntryTimestamp:g} Hasta {parkingEvent.ExitTimestamp:g}"
            };

            try
            {
                bool billGenerated = await this._odooService.GenerateBillAsync(odooBillRequest);
                parkingEvent.ExternalBillId = billGenerated ? "Generated" : null;
                parkingEvent.BillGenerated = billGenerated;
                this._logger.LogInformation("Odoo bill generation status for {LicensePlate}: {BillGenerated}", parkingEvent.LicensePlate, billGenerated);
            }
            catch (InvalidOperationException ex)
            {
                this._logger.LogError(ex, "Failed to generate Odoo bill for license plate: {LicensePlate}", parkingEvent.LicensePlate);
                // Decide if this should prevent visitor exit or just log and proceed
                parkingEvent.BillGenerated = false;
            }
        }

        return visitorEvent;
    }

    #endregion

}
