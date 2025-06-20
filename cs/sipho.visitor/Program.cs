using System.Globalization;
using System.Threading;
using DotNetEnv.Configuration;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.OpenApi.Models;
using sipho.visitor.Configuration;
using sipho.visitor.Data;
using sipho.visitor.Data.Repositories;
using sipho.visitor.Services;

Thread.CurrentThread.CurrentCulture = CultureInfo.CreateSpecificCulture("es-CO");

var builder = WebApplication.CreateBuilder(args);

// Load environment variables from .env
builder.Configuration.AddDotNetEnv(".env", DotNetEnv.LoadOptions.TraversePath());

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Version = "v1",
        Title = "SIPHO Visitor API",
        Description = "API for handling Visitor events in condominiums with SIPHO technology.",
    });

    options.EnableAnnotations();
});

builder.Services.AddControllers();

// Disable automatic model state validation
// builder.Services.Configure<ApiBehaviorOptions>(options => { options.SuppressModelStateInvalidFilter = true; });

// Configuration binding
builder.Services.Configure<ParkingSettings>(builder.Configuration.GetSection("ParkingSettings"));
builder.Services.Configure<OdooSettings>(builder.Configuration.GetSection("OdooSettings"));

// Database Context
var sqlConnectionString = builder.Configuration.GetConnectionString("siphopg");
if (string.IsNullOrEmpty(sqlConnectionString))
{
    throw new InvalidOperationException("Database connection string is not configured.");
}

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(sqlConnectionString)
);
// end - Database Context

// Repositories
builder.Services.AddScoped<IVisitorEventRepository, VisitorEventRepository>();
builder.Services.AddScoped<IVisitorRepository, VisitorRepository>();
builder.Services.AddScoped<IDocumentTypeRepository, DocumentTypeRepository>();
builder.Services.AddScoped<IVehicleTypeRepository, VehicleTypeRepository>();

// HTTP Client for Odoo
builder.Services.AddHttpClient<IOdooService, OdooService>(client =>
{
    var odooSettings = builder.Configuration.GetSection("OdooSettings").Get<OdooSettings>();
    if (odooSettings != null && !string.IsNullOrEmpty(odooSettings.ApiBaseUrl))
    {
        client.BaseAddress = new Uri(odooSettings.ApiBaseUrl);
        // Add any default headers like API key if applicable
        client.DefaultRequestHeaders.Add("Authorization", $"Bearer {odooSettings.ApiKey}");
    }
});

// Business Services
builder.Services.AddScoped<IVisitorService, VisitorService>();

var app = builder.Build();

// Apply migrations automatically
if (builder.Configuration.GetValue<bool>("Databases:StartDatabaseMigration"))
{
    Console.WriteLine("Applying database migrations...");
    ApplyMigrations(app);
}
else
{
    Console.WriteLine("Skipping database migrations.");
    Console.WriteLine("If database changes are needed, run migrations manually.");
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    _ = app.UseSwagger();
    _ = app.UseSwaggerUI();
}

// Global Error Handling
app.UseExceptionHandler(appBuilder =>
{
    appBuilder.Run(async context =>
    {
        context.Response.StatusCode = StatusCodes.Status500InternalServerError;
        await context.Response.WriteAsJsonAsync(new { error = "An unexpected error occurred." });
    });
});

// add controller endpoints api explorer
app.MapControllers();

app.MapGet("/", () =>
{
    return "Welcome to Sipho Visitor!";
}).ExcludeFromDescription();

/*
DateTime utcTime = DateTime.UtcNow;
TimeZoneInfo myTimezone = TimeZoneInfo.FindSystemTimeZoneById("America/Bogota");
DateTime myLocalTime = TimeZoneInfo.ConvertTime(utcTime, myTimezone);

Console.WriteLine("Bogota-Time:{0}, utc-Time{1}", myLocalTime, utcTime);
*/
static void ApplyMigrations(WebApplication app)
{
    using var scope = app.Services.CreateScope();
    var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

    // Check and apply pending migrations
    var pendingMigrations = dbContext.Database.GetPendingMigrations();
    if (pendingMigrations.Any())
    {
        Console.WriteLine("Applying pending migrations...");
        dbContext.Database.Migrate();
        Console.WriteLine("Migrations applied successfully.");
    }
    else
    {
        Console.WriteLine("No pending migrations found.");
    }
}

await app.RunAsync(); // Run Web Api


