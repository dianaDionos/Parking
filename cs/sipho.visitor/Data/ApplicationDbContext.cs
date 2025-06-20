using Microsoft.EntityFrameworkCore;
using sipho.visitor.Models.Entities;
using sipho.visitor.Models.Enums;

namespace sipho.visitor.Data
{
    public class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : DbContext(options)
    {

        #region Personal_Information
        public DbSet<PersonDocumentType> VisitorDocumentTypes { get; set; }
        public DbSet<PersonGenderType> VisitorGenderTypes { get; set; }
        public DbSet<Person> Visitors { get; set; }
        #endregion Personal_Information

        public DbSet<VisitorEvent> VisitorEvents { get; set; }

        public DbSet<VehicleType> VehicleTypes { get; set; }
        public DbSet<ParkingEvent> ParkingEvents { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure table naming and primary key for Person
            _ = modelBuilder.Entity<Person>()
                .ToTable("people")
                .HasKey(en => en.PersonId) // Ensure Id is the primary key
            ;

            _ = modelBuilder.Entity<Person>()
                .HasIndex(en => new { en.DocumentTypeId }, "IX_people_DocumentTypeId")
            ;
            _ = modelBuilder.Entity<Person>()
                .HasIndex(en => new { en.DocumentId }, "IX_people_DocumentId")
            ;

            // Configure Visitor-DocumentType relationship
            _ = modelBuilder.Entity<Person>()
                .HasOne(ent => ent.DocumentType)
                .WithMany()
                .HasForeignKey(ent => ent.DocumentTypeId)
                .IsRequired()
                .OnDelete(DeleteBehavior.Restrict) // Prevent accidental deletion
            ;
            _ = modelBuilder.Entity<Person>()
                .HasOne(ent => ent.Gender)
                .WithMany()
                .HasForeignKey(ent => ent.GenderId)
                .IsRequired()
                .OnDelete(DeleteBehavior.Restrict) // Prevent accidental deletion
            ;

            // Configure DocumentType
            _ = modelBuilder.Entity<PersonDocumentType>()
                .ToTable("people_document_types")
                .HasKey(ent => ent.DocumentTypeId) // Ensure Id is the primary key
            ;

            _ = modelBuilder.Entity<PersonDocumentType>()
                .HasIndex(ent => new { ent.Name }, "UIX_people_document_types_name")
                .IsUnique() // Ensure unique names
            ;

            // Seed DocumentTypes (example data)
            _ = modelBuilder.Entity<PersonDocumentType>().HasData(
                new PersonDocumentType { DocumentTypeId = 1, Code = "CC", Name = "Cédula de Ciudadanía" },
                new PersonDocumentType { DocumentTypeId = 2, Code = "CE", Name = "Cédula de Extranjería" },
                new PersonDocumentType { DocumentTypeId = 3, Code = "NIT", Name = "Número de Identificación Tributaria" },
                new PersonDocumentType { DocumentTypeId = 4, Code = "PAS", Name = "Pasaporte" }
            );

            _ = modelBuilder.Entity<PersonGenderType>()
                .ToTable("people_gender_types")
                .Property(ent => ent.GenderTypeId)
                .HasConversion<int>();

            _ = modelBuilder.Entity<PersonGenderType>()
                .HasIndex(ent => new { ent.Name }, "UIX_people_gender_types_name")
                .IsUnique() // Ensure unique names
            ;

            // Seed GenderTypes (example data)
            _ = modelBuilder.Entity<PersonGenderType>().HasData(
                new PersonGenderType { GenderTypeId = GenderTypes.PreferNotToSay, Code = "NO", Name = "Prefiero no decir" },
                new PersonGenderType { GenderTypeId = GenderTypes.Female, Code = "F", Name = "Femenino" },
                new PersonGenderType { GenderTypeId = GenderTypes.Male, Code = "M", Name = "Masculino" },
                new PersonGenderType { GenderTypeId = GenderTypes.NonBinary, Code = "NB", Name = "No Binario" }
            );

            _ = modelBuilder.Entity<VehicleType>()
                .ToTable("vehicle_types")
                .HasKey(ent => ent.VehicleTypeId)
            ;

            _ = modelBuilder.Entity<VehicleType>()
                .HasIndex(ent => new { ent.Name }, "UIX_vehicle_types_name")
                .IsUnique() // Ensure unique names
            ;

            // Seed VehicleTypes (example data)
            _ = modelBuilder.Entity<VehicleType>().HasData(
                new VehicleType { VehicleTypeId = 1, Code = "VEHI", Name = "Vehiculo" },
                new VehicleType { VehicleTypeId = 2, Code = "MOTO", Name = "Motocicleta" }
            );

            _ = modelBuilder.Entity<ParkingEvent>()
                .ToTable("parking_events")
                .HasKey(ent => ent.EventId)
            ;


            _ = modelBuilder.Entity<ParkingEvent>()
                .HasIndex(ent => new { ent.VehicleTypeId }, "IX_parking_events_vehicletypeid")
            ;

            _ = modelBuilder.Entity<ParkingEvent>()
                .HasIndex(ent => new { ent.EntryTimestamp }, "IX_parking_events_entrytime")
            ;

            _ = modelBuilder.Entity<ParkingEvent>()
                .HasIndex(ent => new { ent.ExitTimestamp }, "IX_parking_events_exittime")
            ;


            _ = modelBuilder.Entity<VisitorEvent>()
                .ToTable("visitor_events")
                .HasKey(ent => ent.EventId)
            ;

            _ = modelBuilder.Entity<VisitorEvent>()
                .HasIndex(ent => new { ent.VisitorId }, "IX_parking_events_visitorid")
            ;

            _ = modelBuilder.Entity<VisitorEvent>()
                .HasIndex(ent => new { ent.EntryTimestamp }, "IX_visitor_events_entrytime")
            ;

            _ = modelBuilder.Entity<VisitorEvent>()
                .HasIndex(ent => new { ent.ExitTimestamp }, "IX_visitor_events_exittime")
            ;

            // Configure VisitorEvent-Visitor relationship
            _ = modelBuilder.Entity<VisitorEvent>()
                .HasOne(ent => ent.Visitor)
                .WithMany()
                .HasForeignKey(ent => ent.VisitorId)
                .IsRequired()
                .OnDelete(DeleteBehavior.Restrict) // Prevent accidental deletion
            ;

            // Configure VisitorEvent-ParkingEvent relationship
            _ = modelBuilder.Entity<VisitorEvent>()
                .HasOne(ve => ve.ParkingEntry)
                .WithOne(pe => pe.VisitorEvent)
                .HasForeignKey<ParkingEvent>(pe => pe.EventId)
                .OnDelete(DeleteBehavior.Cascade) // Delete ParkingEvent when VisitorEvent is deleted
            ;
        }
    }
}
