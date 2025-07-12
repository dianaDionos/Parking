import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FaParking,
  FaUserFriends,
  FaCarAlt,
  FaBell,
  FaTicketAlt,
  FaPrint,
  FaReceipt,
  FaPlus,
  FaBoxOpen,
} from "react-icons/fa";
import ParkingTicket from "./ParkingTicket";
import parkingService from "../services/parkingService";
import ticketService from "../services/ticketService";
import PaqueteriaModal from "../components/PaqueteriaModal";

const resumen = [
  {
    label: "Parqueaderos libres",
    value: 12,
    icon: <FaParking className="text-green-500" size={32} />,
    accent: "bg-green-50 border-green-200 text-green-700",
  },
  {
    label: "Parqueaderos ocupados",
    value: 8,
    icon: <FaCarAlt className="text-indigo-500" size={32} />,
    accent: "bg-indigo-50 border-indigo-200 text-indigo-700",
  },
  {
    label: "Visitantes en conjunto",
    value: 5,
    icon: <FaUserFriends className="text-blue-500" size={32} />,
    accent: "bg-blue-50 border-blue-200 text-blue-700",
  },
  {
    label: "Alertas activas",
    value: 1,
    icon: <FaBell className="text-red-500" size={32} />,
    accent: "bg-red-50 border-red-200 text-red-700",
  },
];

export default function PanelGuardia({
  onNuevoRegistro,
  onNotificarPaqueteria,
}) {
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [currentTicketData, setCurrentTicketData] = useState(null);
  const [ticketGenerated, setTicketGenerated] = useState(false);
  const [paqueteriaModalOpen, setPaqueteriaModalOpen] = useState(false);
  const [paqueteria, setPaqueteria] = useState([]);

  // Función para generar ticket de parqueadero
  const handleGenerateTicket = async (visitorData, vehicleData) => {
    try {
      const ticket = await parkingService.generateTicket(
        visitorData,
        vehicleData
      );
      setCurrentTicketData({ visitorData, vehicleData, ticket });
      setShowTicketModal(true);
      setTicketGenerated(true);
    } catch (error) {
      console.error("Error generando ticket:", error);
      alert("Error al generar el ticket de parqueadero");
    }
  };

  // Función de ejemplo para generar ticket rápido
  const handleQuickTicket = () => {
    const mockVisitorData = {
      name: "Juan Pérez",
      id: "12345678",
      apartment: "302B",
      interior: "Torre 1",
    };

    const mockVehicleData = {
      plate: "ABC-123",
      vehicleType: "car",
    };

    handleGenerateTicket(mockVisitorData, mockVehicleData);
  };

  // Función para imprimir ticket
  const handlePrintTicket = async () => {
    if (currentTicketData) {
      try {
        await ticketService.printTicket(currentTicketData.ticket);
      } catch (error) {
        console.error("Error imprimiendo ticket:", error);
        alert("Error al imprimir el ticket");
      }
    }
  };
  // Registrar llegada de paquetería
  const handleRegisterPaqueteria = (data) => {
    setPaqueteria((prev) => [...prev, data]);
    setPaqueteriaModalOpen(false);
  };
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {resumen.map((item) => (
          <div
            key={item.label}
            className={`rounded-2xl border shadow-sm p-5 flex flex-col items-center justify-center min-h-[120px] transition hover:shadow-md ${item.accent}`}
          >
            <div className="mb-2">{item.icon}</div>
            <span
              className={`text-3xl font-semibold ${item.accent
                .split(" ")
                .pop()}`}
            >
              {item.value}
            </span>
            <span className="text-xs mt-1 text-gray-600 text-center font-normal tracking-wide">
              {item.label}
            </span>
          </div>
        ))}
      </div>

      {/* Panel de acciones rápidas con acentos */}
      <div className="bg-white rounded-2xl shadow border border-slate-100 p-6">
        <h2 className="text-xl font-semibold text-slate-800 mb-5 flex items-center gap-2">
          <FaTicketAlt className="text-indigo-400" /> Acciones rápidas
        </h2>
        <div className="flex flex-col md:flex-row gap-4">
          {/* Nuevo Visitante */}
          <button
            onClick={onNuevoRegistro}
            className="flex-1 flex flex-col items-center justify-center gap-2 bg-blue-50 border border-blue-200 rounded-xl py-5 px-2 shadow-sm hover:bg-blue-100 transition"
          >
            <FaPlus className="text-2xl text-blue-400" />
            <span className="font-medium text-blue-800">Nuevo visitante</span>
            <span className="text-xs text-blue-500">Registrar visitante</span>
          </button>
          {/* Generar Ticket Rápido */}
          <button
            onClick={handleQuickTicket}
            className="flex-1 flex flex-col items-center justify-center gap-2 bg-indigo-50 border border-indigo-200 rounded-xl py-5 px-2 shadow-sm hover:bg-indigo-100 transition"
          >
            <FaTicketAlt className="text-2xl text-indigo-400" />
            <span className="font-medium text-indigo-800">Ticket rápido</span>
            <span className="text-xs text-indigo-500">
              Generar ticket de parqueadero
            </span>
          </button>
          {/* Notificar Paquetería */}
          <button
            onClick={onNotificarPaqueteria}
            className="flex-1 flex flex-col items-center justify-center gap-2 bg-yellow-50 border border-yellow-200 rounded-xl py-5 px-2 shadow-sm hover:bg-yellow-100 transition"
          >
            <FaBoxOpen className="text-2xl text-yellow-500" />
            <span className="font-medium text-yellow-800">
              Notificar paquetería
            </span>
            <span className="text-xs text-yellow-500">
              Registrar llegada de paquetes
            </span>
          </button>
        </div>
        {/* Información adicional para tickets */}
        {ticketGenerated && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 bg-green-50 border border-green-100 rounded-xl"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FaTicketAlt className="text-green-500" />
                <span className="text-green-700 font-medium">
                  Ticket generado exitosamente
                </span>
              </div>
              <button
                onClick={handlePrintTicket}
                className="bg-white border border-green-200 text-green-700 px-4 py-2 rounded-lg font-medium hover:bg-green-50 transition-colors flex items-center gap-2 shadow-sm"
              >
                <FaPrint />
                Reimprimir
              </button>
            </div>
          </motion.div>
        )}
      </div>
      <PaqueteriaModal
        isOpen={paqueteriaModalOpen}
        onClose={() => setPaqueteriaModalOpen(false)}
        onRegister={handleRegisterPaqueteria}
      />
    </div>
  );
}
