using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace sipho.visitor.Migrations
{
    /// <inheritdoc />
    public partial class siphovisitorv1 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "people_document_types",
                columns: table => new
                {
                    DocumentTypeId = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Code = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_people_document_types", x => x.DocumentTypeId);
                });

            migrationBuilder.CreateTable(
                name: "people_gender_types",
                columns: table => new
                {
                    GenderTypeId = table.Column<int>(type: "integer", nullable: false),
                    Name = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    Code = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_people_gender_types", x => x.GenderTypeId);
                });

            migrationBuilder.CreateTable(
                name: "vehicle_types",
                columns: table => new
                {
                    VehicleTypeId = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    Code = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_vehicle_types", x => x.VehicleTypeId);
                });

            migrationBuilder.CreateTable(
                name: "people",
                columns: table => new
                {
                    PersonId = table.Column<Guid>(type: "uuid", nullable: false),
                    GivenNames = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    SurNames = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    DateOfBirth = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    DocumentTypeId = table.Column<int>(type: "integer", nullable: false),
                    DocumentId = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    PhoneNumber = table.Column<string>(type: "text", nullable: true),
                    Email = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    GenderId = table.Column<int>(type: "integer", nullable: false),
                    AddressLine1 = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    AddressLine2 = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    City = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    StateProvince = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    ZipCode = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: true),
                    Country = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_people", x => x.PersonId);
                    table.ForeignKey(
                        name: "FK_people_people_document_types_DocumentTypeId",
                        column: x => x.DocumentTypeId,
                        principalTable: "people_document_types",
                        principalColumn: "DocumentTypeId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_people_people_gender_types_GenderId",
                        column: x => x.GenderId,
                        principalTable: "people_gender_types",
                        principalColumn: "GenderTypeId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "visitor_events",
                columns: table => new
                {
                    EventId = table.Column<Guid>(type: "uuid", nullable: false),
                    VisitorId = table.Column<Guid>(type: "uuid", nullable: false),
                    EntryTimestamp = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    ExitTimestamp = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                    UnitNumberDesc = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_visitor_events", x => x.EventId);
                    table.ForeignKey(
                        name: "FK_visitor_events_people_VisitorId",
                        column: x => x.VisitorId,
                        principalTable: "people",
                        principalColumn: "PersonId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "parking_events",
                columns: table => new
                {
                    EventId = table.Column<Guid>(type: "uuid", nullable: false),
                    EntryTimestamp = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    ExitTimestamp = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                    LicensePlate = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    IsFreeParking = table.Column<bool>(type: "boolean", nullable: false),
                    CalculatedCost = table.Column<decimal>(type: "numeric(18,2)", nullable: false),
                    ExternalBillId = table.Column<string>(type: "text", nullable: true),
                    BillGenerated = table.Column<bool>(type: "boolean", nullable: false),
                    ParkingSpaceNumberDesc = table.Column<string>(type: "character varying(4)", maxLength: 4, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    VehicleTypeId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_parking_events", x => x.EventId);
                    table.ForeignKey(
                        name: "FK_parking_events_vehicle_types_VehicleTypeId",
                        column: x => x.VehicleTypeId,
                        principalTable: "vehicle_types",
                        principalColumn: "VehicleTypeId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_parking_events_visitor_events_EventId",
                        column: x => x.EventId,
                        principalTable: "visitor_events",
                        principalColumn: "EventId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "people_document_types",
                columns: new[] { "DocumentTypeId", "Code", "CreatedAt", "Name", "UpdatedAt" },
                values: new object[,]
                {
                    { 1, "CC", new DateTime(2025, 6, 20, 11, 46, 6, 378, DateTimeKind.Utc).AddTicks(6980), "Cédula de Ciudadanía", new DateTime(2025, 6, 20, 11, 46, 6, 378, DateTimeKind.Utc).AddTicks(6980) },
                    { 2, "CE", new DateTime(2025, 6, 20, 11, 46, 6, 378, DateTimeKind.Utc).AddTicks(6988), "Cédula de Extranjería", new DateTime(2025, 6, 20, 11, 46, 6, 378, DateTimeKind.Utc).AddTicks(6988) },
                    { 3, "NIT", new DateTime(2025, 6, 20, 11, 46, 6, 378, DateTimeKind.Utc).AddTicks(6989), "Número de Identificación Tributaria", new DateTime(2025, 6, 20, 11, 46, 6, 378, DateTimeKind.Utc).AddTicks(6989) },
                    { 4, "PAS", new DateTime(2025, 6, 20, 11, 46, 6, 378, DateTimeKind.Utc).AddTicks(6990), "Pasaporte", new DateTime(2025, 6, 20, 11, 46, 6, 378, DateTimeKind.Utc).AddTicks(6990) }
                });

            migrationBuilder.InsertData(
                table: "people_gender_types",
                columns: new[] { "GenderTypeId", "Code", "CreatedAt", "Name", "UpdatedAt" },
                values: new object[,]
                {
                    { 1, "NO", new DateTime(2025, 6, 20, 11, 46, 6, 378, DateTimeKind.Utc).AddTicks(7786), "Prefiero no decir", new DateTime(2025, 6, 20, 11, 46, 6, 378, DateTimeKind.Utc).AddTicks(7787) },
                    { 2, "F", new DateTime(2025, 6, 20, 11, 46, 6, 378, DateTimeKind.Utc).AddTicks(7789), "Femenino", new DateTime(2025, 6, 20, 11, 46, 6, 378, DateTimeKind.Utc).AddTicks(7790) },
                    { 3, "M", new DateTime(2025, 6, 20, 11, 46, 6, 378, DateTimeKind.Utc).AddTicks(7790), "Masculino", new DateTime(2025, 6, 20, 11, 46, 6, 378, DateTimeKind.Utc).AddTicks(7791) },
                    { 4, "NB", new DateTime(2025, 6, 20, 11, 46, 6, 378, DateTimeKind.Utc).AddTicks(7792), "No Binario", new DateTime(2025, 6, 20, 11, 46, 6, 378, DateTimeKind.Utc).AddTicks(7792) }
                });

            migrationBuilder.InsertData(
                table: "vehicle_types",
                columns: new[] { "VehicleTypeId", "Code", "CreatedAt", "Name", "UpdatedAt" },
                values: new object[,]
                {
                    { 1, "VEHI", new DateTime(2025, 6, 20, 11, 46, 6, 378, DateTimeKind.Utc).AddTicks(8416), "Vehiculo", new DateTime(2025, 6, 20, 11, 46, 6, 378, DateTimeKind.Utc).AddTicks(8416) },
                    { 2, "MOTO", new DateTime(2025, 6, 20, 11, 46, 6, 378, DateTimeKind.Utc).AddTicks(8419), "Motocicleta", new DateTime(2025, 6, 20, 11, 46, 6, 378, DateTimeKind.Utc).AddTicks(8420) }
                });

            migrationBuilder.CreateIndex(
                name: "IX_parking_events_entrytime",
                table: "parking_events",
                column: "EntryTimestamp");

            migrationBuilder.CreateIndex(
                name: "IX_parking_events_exittime",
                table: "parking_events",
                column: "ExitTimestamp");

            migrationBuilder.CreateIndex(
                name: "IX_parking_events_vehicletypeid",
                table: "parking_events",
                column: "VehicleTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_people_DocumentId",
                table: "people",
                column: "DocumentId");

            migrationBuilder.CreateIndex(
                name: "IX_people_DocumentTypeId",
                table: "people",
                column: "DocumentTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_people_GenderId",
                table: "people",
                column: "GenderId");

            migrationBuilder.CreateIndex(
                name: "UIX_people_document_types_name",
                table: "people_document_types",
                column: "Name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "UIX_people_gender_types_name",
                table: "people_gender_types",
                column: "Name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "UIX_vehicle_types_name",
                table: "vehicle_types",
                column: "Name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_parking_events_visitorid",
                table: "visitor_events",
                column: "VisitorId");

            migrationBuilder.CreateIndex(
                name: "IX_visitor_events_entrytime",
                table: "visitor_events",
                column: "EntryTimestamp");

            migrationBuilder.CreateIndex(
                name: "IX_visitor_events_exittime",
                table: "visitor_events",
                column: "ExitTimestamp");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "parking_events");

            migrationBuilder.DropTable(
                name: "vehicle_types");

            migrationBuilder.DropTable(
                name: "visitor_events");

            migrationBuilder.DropTable(
                name: "people");

            migrationBuilder.DropTable(
                name: "people_document_types");

            migrationBuilder.DropTable(
                name: "people_gender_types");
        }
    }
}
