// Servicio para envío de emails y facturación electrónica
class EmailService {
  constructor() {
    this.baseURL = "/api/email";
    this.templates = {
      invoice: this.getInvoiceTemplate(),
      receipt: this.getReceiptTemplate(),
    };
  }

  async sendElectronicInvoice(billing) {
    try {
      const emailData = this.prepareInvoiceEmail(billing);

      console.log("Enviando factura electrónica:", emailData);

      await new Promise((resolve) => setTimeout(resolve, 2000));

      this.saveEmailHistory(emailData);

      return {
        success: true,
        message: "Factura electrónica enviada correctamente",
        emailId: this.generateEmailId(),
        sentAt: new Date().toISOString(),
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

  // Preparar datos del email para factura
  prepareInvoiceEmail(billing) {
    const recipientEmail = this.getRecipientEmail(billing);

    return {
      to: recipientEmail,
      subject: `Factura Electrónica N° ${billing.facturaNumber} - Conjunto Toledo`,
      html: this.generateInvoiceHTML(billing),
      attachments: [
        {
          filename: `Factura_${billing.facturaNumber}.pdf`,
          content: this.generateInvoicePDF(billing),
          contentType: "application/pdf",
        },
      ],
      metadata: {
        invoiceNumber: billing.facturaNumber,
        cufe: billing.cufe,
        ticketNumber: billing.ticketNumber,
        type: "electronic_invoice",
      },
    };
  }

  // Obtener email del destinatario
  getRecipientEmail(billing) {
    // En producción, esto vendría de la base de datos del visitante/empresa
    if (billing.billingType === "empresa" && billing.companyData?.email) {
      return billing.companyData.email;
    }

    // Email por defecto para testing
    return "facturacion@conjuntotoledo.com";
  }

  // Generar HTML de la factura para email
  generateInvoiceHTML(billing) {
    return `
      <!DOCTYPE html>
      <html lang="es">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Factura Electrónica - Conjunto Toledo</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #f4f4f4;
            }
            .email-container {
              background: white;
              border-radius: 10px;
              overflow: hidden;
              box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            }
            .header {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 30px;
              text-align: center;
            }
            .header h1 {
              margin: 0;
              font-size: 28px;
            }
            .header p {
              margin: 10px 0 0;
              opacity: 0.9;
            }
            .content {
              padding: 30px;
            }
            .invoice-details {
              background: #f8f9fa;
              border-radius: 8px;
              padding: 20px;
              margin: 20px 0;
            }
            .detail-row {
              display: flex;
              justify-content: space-between;
              margin-bottom: 10px;
              padding: 5px 0;
              border-bottom: 1px solid #eee;
            }
            .detail-row:last-child {
              border-bottom: none;
              font-weight: bold;
              font-size: 18px;
              color: #28a745;
            }
            .company-info {
              background: #e3f2fd;
              border-left: 4px solid #2196f3;
              padding: 15px;
              margin: 20px 0;
            }
            .footer {
              background: #f8f9fa;
              padding: 20px;
              text-align: center;
              border-top: 1px solid #eee;
            }
            .btn {
              display: inline-block;
              background: #667eea;
              color: white;
              padding: 12px 24px;
              text-decoration: none;
              border-radius: 5px;
              margin: 10px 0;
            }
            .legal-info {
              font-size: 12px;
              color: #666;
              margin-top: 20px;
              line-height: 1.4;
            }
            .qr-section {
              text-align: center;
              margin: 20px 0;
              padding: 20px;
              background: #f8f9fa;
              border-radius: 8px;
            }
          </style>
        </head>
        <body>
          <div class="email-container">
            <div class="header">
              <h1>🏢 Conjunto Toledo</h1>
              <p>Factura Electrónica de Parqueadero</p>
            </div>
            
            <div class="content">
              <h2>Estimado ${
                billing.billingType === "empresa"
                  ? billing.companyData?.name || "Cliente"
                  : billing.visitorName
              },</h2>
              
              <p>Adjunto encontrará su factura electrónica correspondiente al servicio de parqueadero en el Conjunto Toledo.</p>
              
              <div class="invoice-details">
                <h3>📋 Detalles de la Factura</h3>
                <div class="detail-row">
                  <span>Número de Factura:</span>
                  <span><strong>${billing.facturaNumber}</strong></span>
                </div>
                <div class="detail-row">
                  <span>CUFE:</span>
                  <span><strong>${billing.cufe}</strong></span>
                </div>
                <div class="detail-row">
                  <span>Fecha de Emisión:</span>
                  <span>${billing.exitDate}</span>
                </div>
                <div class="detail-row">
                  <span>Visitante:</span>
                  <span>${billing.visitorName}</span>
                </div>
                <div class="detail-row">
                  <span>Placa del Vehículo:</span>
                  <span><strong>${billing.licensePlate}</strong></span>
                </div>
                <div class="detail-row">
                  <span>Unidad residencial:</span>
                  <span>${billing.apartment}</span>
                </div>
                <div class="detail-row">
                  <span>Hora de Ingreso:</span>
                  <span>${new Date(billing.entryTime).toLocaleString()}</span>
                </div>
                <div class="detail-row">
                  <span>Hora de Salida:</span>
                  <span>${billing.exitDate} ${billing.exitHour}</span>
                </div>
                <div class="detail-row">
                  <span>Tarifa de Parqueadero:</span>
                  <span>$${billing.parkingFee.toLocaleString()}</span>
                </div>
                ${
                  billing.lostTicket
                    ? `
                <div class="detail-row">
                  <span>Multa por Ticket Perdido:</span>
                  <span>$${billing.lostTicketFee.toLocaleString()}</span>
                </div>
                `
                    : ""
                }
                <div class="detail-row">
                  <span>Total Pagado:</span>
                  <span>$${billing.total.toLocaleString()}</span>
                </div>
              </div>

              ${
                billing.billingType === "empresa"
                  ? `
              <div class="company-info">
                <h3>🏢 Información de Facturación</h3>
                <p><strong>Razón Social:</strong> ${
                  billing.companyData?.name || "N/A"
                }</p>
                <p><strong>NIT:</strong> ${
                  billing.companyData?.nit || "N/A"
                }</p>
                <p><strong>Dirección:</strong> ${
                  billing.companyData?.address || "N/A"
                }</p>
              </div>
              `
                  : ""
              }

              <div class="qr-section">
                <h3>📱 Verificación Electrónica</h3>
                <p>Esta factura puede ser verificada en el portal de la DIAN usando el CUFE:</p>
                <code style="background: #eee; padding: 5px 10px; border-radius: 3px;">${
                  billing.cufe
                }</code>
              </div>

              ${
                billing.observations
                  ? `
              <div style="margin: 20px 0; padding: 15px; background: #fff3cd; border-radius: 5px;">
                <h4>📝 Observaciones:</h4>
                <p>${billing.observations}</p>
              </div>
              `
                  : ""
              }
            </div>
            
            <div class="footer">
              <p><strong>¡Gracias por su visita al Conjunto Toledo!</strong></p>
              <p>Este documento constituye una factura electrónica válida ante la DIAN.</p>
              
              <div class="legal-info">
                <p><strong>Conjunto Residencial Toledo</strong></p>
                <p>NIT: 900.123.456-7 | Régimen Común</p>
                <p>Resolución DIAN N° 18760000000000</p>
                <p>Rango autorizado: Del 1 al 5000000</p>
                <p>Vigencia: 2024-01-01 hasta 2025-12-31</p>
                <p>Email: facturacion@conjuntotoledo.com | Tel: (601) 123-4567</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  // Generar PDF de la factura (simulado)
  generateInvoicePDF(billing) {
    // En producción, aquí se usaría una librería como jsPDF o puppeteer
    // Por ahora retornamos un placeholder
    return Buffer.from(
      `PDF Content for Invoice ${billing.facturaNumber}`,
      "utf8"
    );
  }

  // Generar ID único para el email
  generateEmailId() {
    return `email_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Guardar historial de emails enviados
  saveEmailHistory(emailData) {
    const history = JSON.parse(localStorage.getItem("emailHistory")) || [];
    history.push({
      ...emailData,
      sentAt: new Date().toISOString(),
      id: this.generateEmailId(),
    });
    localStorage.setItem("emailHistory", JSON.stringify(history));
  }

  // Obtener historial de emails
  getEmailHistory() {
    return JSON.parse(localStorage.getItem("emailHistory")) || [];
  }

  // Enviar notificación de ticket generado
  async sendTicketNotification(ticketData, recipientEmail) {
    try {
      const emailData = {
        to: recipientEmail,
        subject: `Ticket de Parqueadero Generado - ${ticketData.ticketNumber}`,
        html: this.generateTicketNotificationHTML(ticketData),
        metadata: {
          ticketNumber: ticketData.ticketNumber,
          type: "ticket_notification",
        },
      };

      // Simular envío
      await new Promise((resolve) => setTimeout(resolve, 1000));
      this.saveEmailHistory(emailData);

      return {
        success: true,
        message: "Notificación de ticket enviada",
        emailId: this.generateEmailId(),
      };
    } catch (error) {
      return {
        success: false,
        message: "Error al enviar notificación",
        error: error.message,
      };
    }
  }

  // Generar HTML para notificación de ticket
  generateTicketNotificationHTML(ticketData) {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>Ticket Generado - Conjunto Toledo</title>
          <style>
            body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; }
            .container { background: white; border-radius: 10px; padding: 30px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
            .header { text-align: center; margin-bottom: 30px; }
            .ticket-info { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .warning { background: #fff3cd; border: 1px solid #856404; padding: 15px; border-radius: 5px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎫 Ticket de Parqueadero Generado</h1>
              <p>Conjunto Toledo</p>
            </div>
            
            <p>Se ha generado exitosamente un ticket de parqueadero con los siguientes datos:</p>
            
            <div class="ticket-info">
              <h3>Información del Ticket</h3>
              <p><strong>Número:</strong> ${ticketData.ticketNumber}</p>
              <p><strong>Visitante:</strong> ${ticketData.visitorName}</p>
              <p><strong>Placa:</strong> ${ticketData.licensePlate}</p>
              <p><strong>Unidad residencial:</strong> ${ticketData.apartment}</p>
              <p><strong>Fecha de Ingreso:</strong> ${ticketData.entryDate} - ${ticketData.entryHour}</p>
            </div>
            
            <div class="warning">
              <h4>⚠️ Importante</h4>
              <p>Conserve el ticket físico. La pérdida del mismo generará una multa adicional de $1.000 al momento de la salida.</p>
            </div>
            
            <p>Gracias por visitar el Conjunto Toledo.</p>
          </div>
        </body>
      </html>
    `;
  }

  // Plantillas de email
  getInvoiceTemplate() {
    return {
      subject: "Factura Electrónica - Conjunto Toledo",
      type: "invoice",
    };
  }

  getReceiptTemplate() {
    return {
      subject: "Recibo de Parqueadero - Conjunto Toledo",
      type: "receipt",
    };
  }
}

export default new EmailService();
