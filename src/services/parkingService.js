// Servicio para manejo de parqueadero
class ParkingService {
  constructor() {
    this.baseURL = "/api/parking";
    this.tickets = [];
    this.vehicles = [];
    // No accedemos a localStorage aquí para evitar errores en SSR
  }

  // Cargar datos desde localStorage (solo en cliente)
  loadData() {
    if (typeof window !== "undefined") {
      this.tickets = JSON.parse(localStorage.getItem("parkingTickets")) || [];
      this.vehicles = JSON.parse(localStorage.getItem("parkingVehicles")) || [];
    } else {
      this.tickets = [];
      this.vehicles = [];
    }
  }

  // Generar nuevo ticket de parqueadero
  async generateTicket(visitorData, vehicleData) {
    this.loadData();
    const ticket = {
      id: Date.now(),
      ticketNumber: this.generateTicketNumber(),
      visitorName: visitorData.name,
      visitorId: visitorData.id,
      apartment: visitorData.apartment,
      interior: visitorData.interior || "Principal",
      licensePlate: vehicleData.plate,
      vehicleType: vehicleData.vehicleType,
      entryTime: new Date().toISOString(),
      entryDate: new Date().toLocaleDateString(),
      entryHour: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      status: "active",
      parkingFee: 5000,
      lostTicketFee: 1000,
    };

    this.tickets.push(ticket);
    this.saveTickets();

    // Agregar vehículo a la lista de vehículos en parqueadero
    const vehicle = {
      id: ticket.id,
      spot: this.findAvailableSpot(),
      status: "ocupado",
      type: vehicleData.vehicleType === "moto" ? "moto" : "car",
      licensePlate: vehicleData.plate,
      visitorName: visitorData.name,
      interior: visitorData.interior || "Principal",
      apartment: visitorData.apartment,
      entryTime: ticket.entryTime,
      ticketId: ticket.id,
    };

    this.vehicles.push(vehicle);
    this.saveVehicles();

    return ticket;
  }

  // Generar número único de ticket
  generateTicketNumber() {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const random = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0");
    return `${year}${month}${day}${random}`;
  }

  // Encontrar espacio disponible
  findAvailableSpot() {
    const occupiedSpots = this.vehicles
      .filter((v) => v.status === "ocupado")
      .map((v) => v.spot);
    for (let i = 1; i <= 20; i++) {
      if (!occupiedSpots.includes(i)) {
        return i;
      }
    }
    return null; // No hay espacios disponibles
  }

  // Procesar salida de vehículo
  async processExit(vehicleId, exitData) {
    this.loadData();
    const vehicle = this.vehicles.find((v) => v.id === vehicleId);
    const ticket = this.tickets.find((t) => t.id === vehicleId);

    if (!vehicle || !ticket) {
      throw new Error("Vehículo o ticket no encontrado");
    }

    const exitTime = new Date();
    const billing = {
      ticketNumber: ticket.ticketNumber,
      visitorName: vehicle.visitorName,
      licensePlate: vehicle.licensePlate,
      apartment: vehicle.apartment,
      interior: vehicle.interior,
      entryTime: ticket.entryTime,
      exitTime: exitTime.toISOString(),
      exitDate: exitTime.toLocaleDateString(),
      exitHour: exitTime.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      parkingFee: ticket.parkingFee,
      lostTicketFee: exitData.lostTicket ? ticket.lostTicketFee : 0,
      total:
        ticket.parkingFee + (exitData.lostTicket ? ticket.lostTicketFee : 0),
      billingType: exitData.billingType || "personal",
      companyData: exitData.companyData || null,
      wantsCopy: exitData.wantsCopy || false,
      lostTicket: exitData.lostTicket || false,
      facturaNumber: this.generateInvoiceNumber(),
      cufe: this.generateCUFE(),
      observations: exitData.observations || "",
    };

    // Marcar ticket como usado
    ticket.status = "completed";
    ticket.exitTime = billing.exitTime;
    ticket.billing = billing;

    // Liberar espacio de parqueadero
    const vehicleIndex = this.vehicles.findIndex((v) => v.id === vehicleId);
    if (vehicleIndex !== -1) {
      this.vehicles.splice(vehicleIndex, 1);
    }

    this.saveTickets();
    this.saveVehicles();

    // Enviar factura electrónica si es necesario
    if (billing.wantsCopy && billing.billingType === "empresa") {
      await this.sendElectronicInvoice(billing);
    }

    return billing;
  }

  // Generar número de factura
  generateInvoiceNumber() {
    const date = new Date();
    const year = date.getFullYear();
    const sequence = Math.floor(Math.random() * 100000) + 1;
    return `FAC-${year}-${sequence.toString().padStart(6, "0")}`;
  }

  // Generar CUFE (Código Único de Facturación Electrónica)
  generateCUFE() {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substring(2, 15);
    return `${timestamp}-${random}-TOLEDO-PARKING`.toUpperCase();
  }

  // Enviar factura electrónica por correo
  async sendElectronicInvoice(billing) {
    try {
      // Simulación de envío de factura electrónica
      console.log("Enviando factura electrónica...", billing);

      // Aquí se integraría con el servicio de facturación electrónica real
      // como FacturaSend, Siigo, o directamente con la DIAN

      return {
        success: true,
        message: "Factura electrónica enviada correctamente",
        cufe: billing.cufe,
        invoiceNumber: billing.facturaNumber,
      };
    } catch (error) {
      console.error("Error enviando factura electrónica:", error);
      return {
        success: false,
        message: "Error al enviar la factura electrónica",
        error: error.message,
      };
    }
  }

  // Obtener lista de vehículos en parqueadero
  getVehicles() {
    this.loadData();
    return this.vehicles;
  }

  // Obtener lista de tickets
  getTickets() {
    this.loadData();
    return this.tickets;
  }

  // Buscar ticket por número
  findTicketByNumber(ticketNumber) {
    this.loadData();
    return this.tickets.find((t) => t.ticketNumber === ticketNumber);
  }

  // Buscar vehículo por placa
  findVehicleByPlate(licensePlate) {
    this.loadData();
    return this.vehicles.find((v) => v.licensePlate === licensePlate);
  }

  // Obtener estadísticas del parqueadero
  getStatistics() {
    this.loadData();
    const totalSpots = 20;
    const occupiedSpots = this.vehicles.filter(
      (v) => v.status === "ocupado"
    ).length;
    const freeSpots = totalSpots - occupiedSpots;

    return {
      totalSpots,
      occupiedSpots,
      freeSpots,
      occupancyRate: (occupiedSpots / totalSpots) * 100,
      todayTickets: this.tickets.filter((t) => {
        const today = new Date().toDateString();
        return new Date(t.entryTime).toDateString() === today;
      }).length,
    };
  }

  // Guardar en localStorage
  saveTickets() {
    if (typeof window !== "undefined") {
      localStorage.setItem("parkingTickets", JSON.stringify(this.tickets));
    }
  }

  saveVehicles() {
    if (typeof window !== "undefined") {
      localStorage.setItem("parkingVehicles", JSON.stringify(this.vehicles));
    }
  }

  // Limpiar datos (para testing)
  clearData() {
    this.tickets = [];
    this.vehicles = [];
    if (typeof window !== "undefined") {
      localStorage.removeItem("parkingTickets");
      localStorage.removeItem("parkingVehicles");
    }
  }
}

export default new ParkingService();
