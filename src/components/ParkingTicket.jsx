import React from "react";
import { motion } from "framer-motion";
import {
  FaCar,
  FaQrcode,
  FaExclamationTriangle,
  FaClock,
  FaIdCard,
  FaHome,
  FaPrint,
  FaTimes,
} from "react-icons/fa";

const ParkingTicket = ({ isOpen, onClose, visitorData, vehicleData }) => {
  if (!isOpen || !visitorData || !vehicleData) return null;

  const ticketNumber = Math.floor(Math.random() * 100000) + 1;
  const currentTime = new Date();
  const entryTime = currentTime.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  const entryDate = currentTime.toLocaleDateString();

  const handlePrint = () => {
    window.print();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm grid place-items-center px-4 py-8"
      onClick={onClose}
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 400 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden print:shadow-none print:border-none"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 print:bg-none print:border-b print:border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <FaCar className="text-white text-lg" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white print:text-gray-800">
                  Ticket de Parqueadero
                </h2>
                <p className="text-blue-100 text-sm print:text-gray-600">
                  Conjunto Toledo
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white text-xl transition-colors print:hidden"
            >
              <FaTimes />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 space-y-8">
          {/* Ticket Number & QR */}
          <div className="text-center pb-6 border-b border-gray-100">
            <div className="text-3xl font-black text-gray-800 mb-2">
              #{ticketNumber.toString().padStart(6, "0")}
            </div>
            <div className="text-sm text-gray-600 mb-4">
              {entryDate} - {entryTime}
            </div>
            {/* QR Code Mockup */}
            <div className="inline-flex items-center justify-center w-32 h-32 bg-gray-100 rounded-xl border-2 border-dashed border-gray-300 mx-auto">
              <FaQrcode className="text-gray-400 text-4xl" />
            </div>
            <p className="text-xs text-gray-500 mt-2">Código QR del ticket</p>
          </div>

          {/* Visitor & Vehicle Info */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <FaIdCard className="text-blue-500 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-gray-500 uppercase tracking-wide">
                    Visitante
                  </p>
                  <p className="font-semibold text-gray-800 truncate">
                    {visitorData.name}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FaHome className="text-green-500 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-gray-500 uppercase tracking-wide">
                    Unidad residencial
                  </p>
                  <p className="font-semibold text-gray-800">
                    {visitorData.apartment}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <FaCar className="text-indigo-500 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-gray-500 uppercase tracking-wide">
                    Placa
                  </p>
                  <p className="font-bold text-gray-800 text-lg">
                    {vehicleData.plate}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FaClock className="text-orange-500 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-gray-500 uppercase tracking-wide">
                    Ingreso
                  </p>
                  <p className="font-semibold text-gray-800">{entryTime}</p>
                </div>
              </div>
            </div>

            {vehicleData.vehicleType && (
              <div className="flex items-center gap-3">
                <FaCar className="text-purple-500 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-gray-500 uppercase tracking-wide">
                    Tipo de Vehículo
                  </p>
                  <p className="font-semibold text-gray-800 capitalize">
                    {vehicleData.vehicleType}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Warning */}
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <FaExclamationTriangle className="text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-red-800 text-sm mb-1">
                  ⚠️ IMPORTANTE
                </h4>
                <p className="text-red-700 text-xs leading-relaxed">
                  <strong>Conserve este ticket.</strong> La pérdida del mismo
                  generará una multa adicional de <strong>$1.000</strong> al
                  momento de la salida. Tarifa de parqueadero:{" "}
                  <strong>$5.000</strong>
                </p>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4 print:hidden">
            <motion.button
              onClick={handlePrint}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 shadow-lg flex items-center justify-center gap-2"
            >
              <FaPrint />
              Imprimir Ticket
            </motion.button>
            <motion.button
              onClick={onClose}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-200"
            >
              Cerrar
            </motion.button>
          </div>
        </div>

        {/* Footer for print */}
        <div className="hidden print:block text-center py-4 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Sistema de Control de Visitantes - Conjunto Toledo
          </p>
          <p className="text-xs text-gray-400">
            Generado el {entryDate} a las {entryTime}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ParkingTicket;
