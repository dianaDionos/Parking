import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaCar,
  FaSignOutAlt,
  FaPrint,
  FaCheckCircle,
  FaTimes,
  FaIdCard,
  FaHome,
  FaClock,
  FaReceipt,
} from "react-icons/fa";

const ParkingExitModal = ({ isOpen, onClose, onRegisterExit, vehiculo }) => {
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptData, setReceiptData] = useState(null);

  if (!vehiculo) return null;

  const handleConfirmExit = () => {
    const exitData = {
      ...vehiculo,
      exitTime: new Date().toISOString(),
      total: 5000,
      ticketNumber: Math.floor(Math.random() * 100000) + 1,
      exitDate: new Date().toLocaleDateString(),
      exitHour: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setReceiptData(exitData);
    setShowReceipt(true);
    onRegisterExit(exitData);
  };

  const handlePrintAndClose = () => {
    onClose();
    setShowReceipt(false);
    setReceiptData(null);
  };

  // Componente del recibo
  const ReceiptComponent = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-8 max-w-md mx-auto print:shadow-none print:p-4 print:border-none"
    >
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl mb-4">
          <FaReceipt className="text-white text-2xl" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Conjunto Toledo
        </h2>
        <div className="text-sm text-gray-600 font-medium mb-1">
          FACTURA DE PARQUEADERO
        </div>
        <div className="text-xs text-gray-500">
          Factura N°: {receiptData?.ticketNumber.toString().padStart(6, "0")}
        </div>
        <div className="text-xs text-gray-500">
          {receiptData?.exitDate} - {receiptData?.exitHour}
        </div>
      </div>

      {/* Información del Vehículo */}
      <div className="space-y-4 mb-8">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wide font-medium">
              Visitante
            </label>
            <p className="font-bold text-gray-800 mt-1">
              {receiptData?.visitorName}
            </p>
          </div>
          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wide font-medium">
              Placa
            </label>
            <p className="font-bold text-gray-800 mt-1 text-lg">
              {receiptData?.licensePlate}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wide font-medium">
              Unidad residencial
            </label>
            <p className="font-bold text-gray-800 mt-1">
              {receiptData?.apartment}
            </p>
          </div>
          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wide font-medium">
              Interior
            </label>
            <p className="font-bold text-gray-800 mt-1">
              {receiptData?.interior}
            </p>
          </div>
        </div>
      </div>

      {/* Horarios */}
      <div className="bg-gray-50 rounded-xl p-4 mb-8">
        <h3 className="font-bold text-gray-800 mb-3">Horarios</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Ingreso:</span>
            <p className="font-semibold text-gray-800">
              {receiptData?.entryTime
                ? new Date(receiptData.entryTime).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "—"}
            </p>
          </div>
          <div>
            <span className="text-gray-600">Salida:</span>
            <p className="font-semibold text-gray-800">
              {receiptData?.exitHour}
            </p>
          </div>
        </div>
      </div>

      {/* Total */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 mb-8 border border-green-200">
        <div className="flex justify-between items-center">
          <span className="font-bold text-lg text-gray-800">Total Pagado:</span>
          <span className="text-3xl font-black text-green-600">
            ${receiptData?.total.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Información DIAN */}
      <div className="text-xs text-gray-500 space-y-1 mb-8 p-4 bg-gray-50 rounded-xl">
        <div>Resolución DIAN: 18760000000000</div>
        <div>CUFE: 1234567890-FAKE-CUFE-2025</div>
        <div>Factura electrónica válida para la DIAN</div>
      </div>

      {/* Mensaje */}
      <div className="text-center mb-8">
        <div className="text-green-700 font-bold mb-2 text-lg">
          ¡Gracias por su visita!
        </div>
        <div className="text-sm text-gray-600">
          Conserve este recibo para cualquier consulta
        </div>
      </div>

      {/* Botones */}
      <div className="flex gap-3 print:hidden">
        <motion.button
          onClick={() => window.print()}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 shadow-lg flex items-center justify-center gap-2"
        >
          <FaPrint />
          Imprimir
        </motion.button>
        <motion.button
          onClick={handlePrintAndClose}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-lg flex items-center justify-center gap-2"
        >
          <FaCheckCircle />
          Finalizar
        </motion.button>
      </div>
    </motion.div>
  );

  if (showReceipt) {
    return (
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm grid place-items-center px-4 py-8"
          >
            <ReceiptComponent />
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      {isOpen && (
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
            className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    Confirmar Salida de Vehículo
                  </h2>
                  <p className="text-blue-100 text-sm mt-1">
                    Revisar información antes de generar factura
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="text-white/80 hover:text-white text-2xl font-light transition-colors"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="p-8">
              {/* Información del vehículo */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 mb-8">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FaCar className="text-blue-600 text-sm" />
                  </div>
                  Información del Vehículo
                </h3>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs text-gray-500 uppercase tracking-wide font-medium">
                      Placa
                    </label>
                    <p className="font-bold text-gray-800 mt-1 text-lg">
                      {vehiculo.licensePlate}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 uppercase tracking-wide font-medium">
                      Visitante
                    </label>
                    <p className="font-semibold text-gray-800 mt-1">
                      {vehiculo.visitorName}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 uppercase tracking-wide font-medium">
                      Unidad residencial
                    </label>
                    <p className="font-semibold text-gray-800 mt-1">
                      {vehiculo.apartment}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 uppercase tracking-wide font-medium">
                      Interior
                    </label>
                    <p className="font-semibold text-gray-800 mt-1">
                      {vehiculo.interior}
                    </p>
                  </div>
                </div>
              </div>

              {/* Horarios */}
              <div className="bg-blue-50 rounded-xl p-6 mb-8 border border-blue-200">
                <h3 className="font-bold text-gray-800 mb-4">
                  Tiempo de Estadía
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <FaClock className="text-blue-500" />
                    <div>
                      <label className="text-xs text-gray-500 uppercase tracking-wide font-medium">
                        Hora de Ingreso
                      </label>
                      <p className="font-semibold text-gray-800">
                        {vehiculo.entryTime
                          ? new Date(vehiculo.entryTime).toLocaleTimeString(
                              [],
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )
                          : "—"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <FaSignOutAlt className="text-red-500" />
                    <div>
                      <label className="text-xs text-gray-500 uppercase tracking-wide font-medium">
                        Hora de Salida
                      </label>
                      <p className="font-semibold text-gray-800">
                        {new Date().toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Total a pagar */}
              <div className="bg-green-50 rounded-xl p-6 mb-8 border border-green-200">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-lg text-gray-800">
                    Total a Pagar:
                  </span>
                  <span className="text-3xl font-black text-green-600">
                    $5.000
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Tarifa estándar de parqueadero para visitantes
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-100 px-8 py-6 bg-gray-50 flex justify-between">
              <motion.button
                onClick={onClose}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-200"
              >
                Cancelar
              </motion.button>
              <motion.button
                onClick={handleConfirmExit}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-lg flex items-center gap-2"
              >
                <FaReceipt />
                Generar Factura
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ParkingExitModal;
