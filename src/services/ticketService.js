// Servicio para generación y manejo de tickets de parqueadero
class TicketService {
  constructor() {
    this.ticketTemplate = this.getTicketTemplate();
  }

  // Generar ticket de parqueadero
  generateTicket(ticketData) {
    const ticket = {
      ...ticketData,
      qrCode: this.generateQRCode(ticketData),
      barcode: this.generateBarcode(ticketData.ticketNumber),
      printDate: new Date().toISOString(),
      validUntil: this.calculateValidUntil(),
    };

    return ticket;
  }

  // Generar código QR para el ticket
  generateQRCode(ticketData) {
    const qrData = {
      ticketNumber: ticketData.ticketNumber,
      entryTime: ticketData.entryTime,
      licensePlate: ticketData.licensePlate,
      apartment: ticketData.apartment,
    };

    // En producción, aquí se usaría una librería como qrcode
    // Por ahora retornamos un string que representa el QR
    return `data:${JSON.stringify(qrData)}`;
  }

  // Generar código de barras
  generateBarcode(ticketNumber) {
    // Simulación de código de barras
    return `|||| | || ||| | || |||| | ||| | || ||||`;
  }

  // Calcular validez del ticket (24 horas por defecto)
  calculateValidUntil() {
    const validUntil = new Date();
    validUntil.setHours(validUntil.getHours() + 24);
    return validUntil.toISOString();
  }

  // Formatear ticket para impresión
  formatForPrint(ticketData) {
    return {
      header: {
        title: "CONJUNTO TOLEDO",
        subtitle: "TICKET DE PARQUEADERO",
        logo: "/assets/logo-toledo.png",
      },
      content: {
        ticketNumber: ticketData.ticketNumber,
        date: new Date(ticketData.entryTime).toLocaleDateString(),
        time: new Date(ticketData.entryTime).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        visitor: ticketData.visitorName,
        apartment: ticketData.apartment,
        interior: ticketData.interior,
        licensePlate: ticketData.licensePlate,
        vehicleType: ticketData.vehicleType,
        qrCode: ticketData.qrCode,
      },
      footer: {
        warning: "⚠️ CONSERVE ESTE TICKET",
        details: [
          "La pérdida del ticket genera multa de $1.000",
          "Tarifa de parqueadero: $5.000",
          "Válido por 24 horas",
        ],
        contact: "Sistema de Control - Conjunto Toledo",
      },
    };
  }

  // Imprimir ticket
  async printTicket(ticketData) {
    try {
      const formattedTicket = this.formatForPrint(ticketData);

      // Crear ventana de impresión
      const printWindow = window.open("", "_blank");
      const printContent = this.generatePrintHTML(formattedTicket);

      printWindow.document.write(printContent);
      printWindow.document.close();

      // Esperar a que cargue y luego imprimir
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print();
          printWindow.close();
        }, 500);
      };

      return { success: true, message: "Ticket enviado a impresión" };
    } catch (error) {
      console.error("Error al imprimir ticket:", error);
      return { success: false, message: "Error al imprimir ticket" };
    }
  }

  // Generar HTML para impresión
  generatePrintHTML(ticketData) {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>Ticket de Parqueadero - ${
            ticketData.content.ticketNumber
          }</title>
          <style>
            @page {
              size: 80mm 120mm;
              margin: 0;
            }
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body {
              font-family: 'Courier New', monospace;
              font-size: 12px;
              line-height: 1.3;
              padding: 8mm;
              background: white;
            }
            .header {
              text-align: center;
              border-bottom: 2px solid #000;
              padding-bottom: 8px;
              margin-bottom: 12px;
            }
            .title {
              font-size: 16px;
              font-weight: bold;
              margin-bottom: 4px;
            }
            .subtitle {
              font-size: 12px;
              margin-bottom: 8px;
            }
            .ticket-number {
              font-size: 20px;
              font-weight: bold;
              text-align: center;
              margin: 12px 0;
              padding: 8px;
              border: 2px solid #000;
            }
            .info-row {
              display: flex;
              justify-content: space-between;
              margin-bottom: 4px;
              padding: 2px 0;
            }
            .label {
              font-weight: bold;
            }
            .qr-placeholder {
              width: 60px;
              height: 60px;
              border: 2px dashed #666;
              margin: 12px auto;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 10px;
            }
            .warning {
              background: #fff3cd;
              border: 1px solid #856404;
              padding: 8px;
              margin: 12px 0;
              text-align: center;
              font-weight: bold;
            }
            .footer {
              border-top: 1px solid #000;
              padding-top: 8px;
              margin-top: 12px;
              font-size: 10px;
              text-align: center;
            }
            .details {
              margin: 8px 0;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="title">${ticketData.header.title}</div>
            <div class="subtitle">${ticketData.header.subtitle}</div>
          </div>
          
          <div class="ticket-number">
            #${ticketData.content.ticketNumber}
          </div>
          
          <div class="info-row">
            <span class="label">Fecha:</span>
            <span>${ticketData.content.date}</span>
          </div>
          <div class="info-row">
            <span class="label">Hora:</span>
            <span>${ticketData.content.time}</span>
          </div>
          <div class="info-row">
            <span class="label">Visitante:</span>
            <span>${ticketData.content.visitor}</span>
          </div>
          <div class="info-row">
            <span class="label">Unidad residencial:</span>
            <span>${ticketData.content.apartment}</span>
          </div>
          <div class="info-row">
            <span class="label">Interior:</span>
            <span>${ticketData.content.interior}</span>
          </div>
          <div class="info-row">
            <span class="label">Placa:</span>
            <span><strong>${ticketData.content.licensePlate}</strong></span>
          </div>
          <div class="info-row">
            <span class="label">Vehículo:</span>
            <span>${ticketData.content.vehicleType}</span>
          </div>
          
          <div class="qr-placeholder">
            Código QR
          </div>
          
          <div class="warning">
            ${ticketData.footer.warning}
          </div>
          
          <div class="details">
            ${ticketData.footer.details
              .map((detail) => `<div>• ${detail}</div>`)
              .join("")}
          </div>
          
          <div class="footer">
            <div>${ticketData.footer.contact}</div>
            <div>Generado: ${new Date().toLocaleString()}</div>
          </div>
        </body>
      </html>
    `;
  }

  // Validar ticket
  validateTicket(ticketNumber) {
    // Aquí se validaría contra la base de datos
    // Por ahora simulamos la validación
    return {
      valid: true,
      ticket: {
        ticketNumber,
        status: "active",
        entryTime: new Date().toISOString(),
      },
    };
  }

  // Obtener template base del ticket
  getTicketTemplate() {
    return {
      width: "80mm",
      height: "auto",
      margins: "5mm",
      fontSize: "12px",
      fontFamily: "Courier New, monospace",
    };
  }
}

export default new TicketService();
