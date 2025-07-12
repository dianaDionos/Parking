// Servicio API principal para comunicación con backend
class ApiService {
  constructor() {
    this.baseURL = process.env.REACT_APP_API_URL || "http://localhost:3001/api";
    this.timeout = 10000;
  }

  // Método base para hacer peticiones HTTP
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      timeout: this.timeout,
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error);
      return {
        success: false,
        error: error.message,
        status: error.status || 500,
      };
    }
  }

  // Métodos para visitantes
  async getVisitors() {
    return this.request("/visitors");
  }

  async createVisitor(visitorData) {
    return this.request("/visitors", {
      method: "POST",
      body: JSON.stringify(visitorData),
    });
  }

  async updateVisitor(id, visitorData) {
    return this.request(`/visitors/${id}`, {
      method: "PUT",
      body: JSON.stringify(visitorData),
    });
  }

  async deleteVisitor(id) {
    return this.request(`/visitors/${id}`, {
      method: "DELETE",
    });
  }

  // Métodos para parqueadero
  async getParkingSpots() {
    return this.request("/parking/spots");
  }

  async createParkingTicket(ticketData) {
    return this.request("/parking/tickets", {
      method: "POST",
      body: JSON.stringify(ticketData),
    });
  }

  async processParkingExit(vehicleId, exitData) {
    return this.request(`/parking/exit/${vehicleId}`, {
      method: "POST",
      body: JSON.stringify(exitData),
    });
  }

  async getParkingStatistics() {
    return this.request("/parking/statistics");
  }

  // Métodos para facturación electrónica
  async sendElectronicInvoice(billingData) {
    return this.request("/billing/electronic-invoice", {
      method: "POST",
      body: JSON.stringify(billingData),
    });
  }

  async getInvoiceStatus(invoiceId) {
    return this.request(`/billing/invoice/${invoiceId}/status`);
  }

  // Métodos para residentes
  async getResidents() {
    return this.request("/residents");
  }

  async searchResidents(query) {
    return this.request(`/residents/search?q=${encodeURIComponent(query)}`);
  }

  // Métodos para notificaciones
  async sendNotification(notificationData) {
    return this.request("/notifications", {
      method: "POST",
      body: JSON.stringify(notificationData),
    });
  }

  // Métodos para reportes
  async getVisitorReport(dateRange) {
    return this.request(
      `/reports/visitors?from=${dateRange.from}&to=${dateRange.to}`
    );
  }

  async getParkingReport(dateRange) {
    return this.request(
      `/reports/parking?from=${dateRange.from}&to=${dateRange.to}`
    );
  }

  // Método para validar ticket
  async validateTicket(ticketNumber) {
    return this.request(`/parking/tickets/${ticketNumber}/validate`);
  }

  // Método para obtener configuración
  async getConfiguration() {
    return this.request("/configuration");
  }

  // Método para actualizar configuración
  async updateConfiguration(config) {
    return this.request("/configuration", {
      method: "PUT",
      body: JSON.stringify(config),
    });
  }

  // Métodos de autenticación (para futuras implementaciones)
  async login(credentials) {
    return this.request("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  }

  async logout() {
    return this.request("/auth/logout", {
      method: "POST",
    });
  }

  async refreshToken() {
    return this.request("/auth/refresh", {
      method: "POST",
    });
  }

  // Método para subir archivos
  async uploadFile(file, type = "general") {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);

    return this.request("/upload", {
      method: "POST",
      body: formData,
      headers: {}, // No establecer Content-Type para FormData
    });
  }

  // Método para health check
  async healthCheck() {
    return this.request("/health");
  }
}

export default new ApiService();
