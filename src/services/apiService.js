class ApiService {
  constructor() {
    this.baseURL = process.env.REACT_APP_API_URL || "http://localhost:3001/api";
    this.timeout = 10000;
  }

  // Método mock para evitar error en frontend
  async getVisitors() {
    // Devuelve un array vacío o datos de prueba
    return { success: true, data: [] };
  }
}

const apiService = new ApiService();
export default apiService;
