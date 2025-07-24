import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ModernInput from "./ModernInput";
import TicketVisual from "./TicketVisual";
import ParkingTicket from "./ParkingTicket";
import {
  FaSignOutAlt,
  FaCarAlt,
  FaMoneyBillWave,
  FaFileInvoice,
  FaArrowLeft,
  FaPrint,
  FaQrcode,
  FaIdCard,
  FaHome,
  FaClock,
  FaExclamationTriangle,
  FaUser,
  FaEnvelope,
} from "react-icons/fa";
import ticketService from "../services/ticketService"; // <--- AGREGA ESTA LÍNEA

const ExitModal = ({ isOpen, onClose, parkingData, onExitConfirm }) => {
  const [step, setStep] = useState(1);
  const [wantsInvoice, setWantsInvoice] = useState(false);
  const [invoiceType, setInvoiceType] = useState("");
  const [billingName, setBillingName] = useState("");
  const [billingId, setBillingId] = useState("");
  const [billingEmail, setBillingEmail] = useState("");

  React.useEffect(() => {
    if (!isOpen) {
      setStep(1);
      setWantsInvoice(false);
      setInvoiceType("");
      setBillingName("");
      setBillingId("");
      setBillingEmail("");
    }
  }, [isOpen]);

  if (!parkingData) return null;

  const isVehicle = parkingData.type === "car" || parkingData.type === "moto";

  // Construir el objeto ticket para TicketVisual
  const ticket = {
    ticketNumber: parkingData.id,
    licensePlate: parkingData.licensePlate,
    vehicleType: parkingData.type,
    visitorName: parkingData.visitorName,
    apartment: parkingData.apartment,
    interior: parkingData.interior,
    entryDate: new Date(parkingData.entryTime).toLocaleDateString(),
    entryHour: new Date(parkingData.entryTime).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
    parkingFee: 5000,
  };

  const handleConfirm = () => {
    onExitConfirm(
      parkingData,
      wantsInvoice
        ? {
            type: invoiceType,
            name: billingName,
            id: billingId,
            email: billingEmail,
          }
        : null
    );
    onClose();
  };

  function buildTicketData() {
    // Si es vehículo, usa los datos de parqueadero
    if (isVehicle) {
      return {
        ticketNumber: parkingData.id,
        entryTime: parkingData.entryTime,
        visitorName: parkingData.visitorName,
        apartment: parkingData.apartment,
        interior: parkingData.interior,
        licensePlate: parkingData.licensePlate,
        vehicleType: parkingData.type === "car" ? "Carro" : "Moto",
      };
    }
    // Si es solo visitante, muestra un resumen simple
    return {
      ticketNumber: parkingData.id || "VISITA",
      entryTime: parkingData.entryTime || new Date().toISOString(),
      visitorName: parkingData.visitorName || parkingData.name,
      apartment: parkingData.apartment,
      interior: parkingData.interior,
      licensePlate: parkingData.licensePlate || "-",
      vehicleType: "-",
    };
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
            className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-indigo-100 overflow-hidden flex flex-col"
            style={{ maxHeight: "90vh" }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FaSignOutAlt className="text-3xl text-white" />
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      Registrar salida
                    </h2>
                    <p className="text-indigo-100 text-sm mt-1">
                      {isVehicle
                        ? "Confirma la salida y realiza el proceso de pago y facturación si aplica."
                        : "Confirma la salida del visitante."}
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="text-white/80 hover:text-white text-2xl font-light transition-colors"
                >
                  ×
                </button>
              </div>
              {/* Barra de progreso */}
              <div className="mt-6">
                <div className="flex items-center justify-between text-sm text-indigo-100 mb-2">
                  <span>
                    Paso {step} de {isVehicle ? 3 : 1}
                  </span>
                  <span>
                    {Math.round((step / (isVehicle ? 3 : 1)) * 100)}% completado
                  </span>
                </div>
                <div className="w-full bg-indigo-300/30 rounded-full h-2">
                  <motion.div
                    className="bg-white h-2 rounded-full shadow-sm"
                    initial={{ width: 0 }}
                    animate={{
                      width: `${(step / (isVehicle ? 3 : 1)) * 100}%`,
                    }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                  />
                </div>
              </div>
            </div>
            {/* Content con scroll interno */}
            <div className="flex-1 overflow-y-auto p-8">
              {/* Paso 1: Confirmación de salida */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="text-center">
                    <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      {isVehicle ? (
                        <FaCarAlt className="text-3xl text-indigo-600" />
                      ) : (
                        <FaSignOutAlt className="text-3xl text-indigo-600" />
                      )}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {isVehicle
                        ? "Salida de vehículo y visitante"
                        : "Salida de visitante"}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {isVehicle
                        ? `Placa: ${
                            parkingData.licensePlate || parkingData.plate || "—"
                          }`
                        : `Visitante: ${
                            parkingData.visitorName || parkingData.name || "—"
                          }`}
                    </p>
                  </div>
                  {isVehicle && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-center gap-3">
                      <FaMoneyBillWave className="text-2xl text-yellow-500" />
                      <div>
                        <p className="font-medium text-yellow-800">
                          Ticket de pago generado
                        </p>
                        <p className="text-yellow-700 text-sm">
                          Por favor, realice el cobro correspondiente antes de
                          registrar la salida.
                        </p>
                      </div>
                    </div>
                  )}
                  <div className="flex flex-col gap-4 md:flex-row justify-end pt-4">
                    <button
                      onClick={onClose}
                      className="px-6 py-3 rounded-xl text-gray-600 hover:text-gray-800 font-medium transition-colors border border-gray-200"
                    >
                      Cancelar
                    </button>
                    {isVehicle ? (
                      <button
                        onClick={() => setStep(2)}
                        className="px-8 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold hover:shadow-lg transition-all"
                      >
                        Continuar →
                      </button>
                    ) : (
                      <button
                        onClick={handleConfirm}
                        className="px-8 py-3 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold hover:shadow-lg transition-all"
                      >
                        Registrar salida
                      </button>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Paso 2: Facturación electrónica */}
              {step === 2 && isVehicle && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="text-center">
                    <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FaFileInvoice className="text-3xl text-indigo-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      ¿Desea factura electrónica?
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Si el visitante requiere factura, complete los datos a
                      continuación.
                    </p>
                  </div>
                  <div className="flex items-center gap-4 justify-center">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={wantsInvoice}
                        onChange={(e) => setWantsInvoice(e.target.checked)}
                        className="form-checkbox h-5 w-5 text-indigo-600"
                      />
                      <span className="font-medium text-indigo-800">
                        Solicitar factura electrónica
                      </span>
                    </label>
                  </div>
                  {wantsInvoice && (
                    <div className="bg-indigo-50 rounded-xl p-6 border border-indigo-200 mt-4 space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 text-center">
                          Tipo de facturación
                        </label>
                        <select
                          value={invoiceType}
                          onChange={(e) => setInvoiceType(e.target.value)}
                          className="w-full border border-gray-300 rounded-xl px-3 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-center"
                        >
                          <option value="">Seleccione...</option>
                          <option value="personal">Persona natural</option>
                          <option value="empresa">Empresa</option>
                        </select>
                      </div>
                      <ModernInput
                        label={
                          invoiceType === "empresa"
                            ? "Razón social"
                            : "Nombre completo"
                        }
                        value={billingName}
                        setValue={setBillingName}
                        icon={
                          invoiceType === "empresa" ? (
                            <FaFileInvoice />
                          ) : (
                            <FaUser />
                          )
                        }
                        placeholder={
                          invoiceType === "empresa"
                            ? "Ej: Inversiones S.A.S."
                            : "Ej: Juan Pérez"
                        }
                      />
                      <ModernInput
                        label={invoiceType === "empresa" ? "NIT" : "Cédula"}
                        value={billingId}
                        setValue={setBillingId}
                        icon={<FaIdCard />}
                        placeholder={
                          invoiceType === "empresa"
                            ? "Ej: 900123456-7"
                            : "Ej: 12345678"
                        }
                      />
                      <ModernInput
                        label="Correo electrónico"
                        value={billingEmail}
                        setValue={setBillingEmail}
                        type="email"
                        icon={<FaEnvelope />}
                        placeholder="Ej: correo@ejemplo.com"
                      />
                    </div>
                  )}
                  <div className="flex justify-between pt-4">
                    <button
                      onClick={() => setStep(1)}
                      className="px-6 py-3 rounded-xl text-gray-600 hover:text-gray-800 font-medium transition-colors"
                      type="button"
                    >
                      ← Atrás
                    </button>
                    <button
                      onClick={() => setStep(3)}
                      className="px-8 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold hover:shadow-lg transition-all"
                      disabled={
                        wantsInvoice &&
                        (!invoiceType ||
                          !billingName ||
                          !billingId ||
                          !billingEmail)
                      }
                      type="button"
                    >
                      Ver resumen
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Paso 3: Resumen visual del ticket */}
              {step === 3 && isVehicle && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="max-h-[60vh] overflow-y-auto rounded-xl border border-gray-100 shadow bg-white mx-auto">
                    {/* Ticket visual integrado */}
                    <div className="w-full max-w-md mx-auto bg-white rounded-2xl overflow-hidden">
                      {/* Content */}
                      <div className="p-8 space-y-8">
                        {/* Ticket Number & QR */}
                        <div className="text-center pb-6 border-b border-gray-100">
                          <div className="text-3xl font-black text-gray-800 mb-2">
                            #{String(parkingData.id).padStart(6, "0")}
                          </div>
                          <div className="text-sm text-gray-600 mb-4">
                            {new Date(
                              parkingData.entryTime
                            ).toLocaleDateString()}{" "}
                            -{" "}
                            {new Date(parkingData.entryTime).toLocaleTimeString(
                              [],
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </div>
                          {/* QR Code Mockup */}
                          <div className="inline-flex items-center justify-center w-32 h-32 bg-gray-100 rounded-xl border-2 border-dashed border-gray-300 mx-auto">
                            <FaQrcode className="text-gray-400 text-4xl" />
                          </div>
                          <p className="text-xs text-gray-500 mt-2">
                            Código QR del ticket
                          </p>
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
                                  {parkingData.visitorName}
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
                                  {parkingData.apartment}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center gap-3">
                              <FaCarAlt className="text-indigo-500 flex-shrink-0" />
                              <div className="min-w-0">
                                <p className="text-xs text-gray-500 uppercase tracking-wide">
                                  Placa
                                </p>
                                <p className="font-bold text-gray-800 text-lg">
                                  {parkingData.licensePlate}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <FaClock className="text-orange-500 flex-shrink-0" />
                              <div className="min-w-0">
                                <p className="text-xs text-gray-500 uppercase tracking-wide">
                                  Ingreso
                                </p>
                                <p className="font-semibold text-gray-800">
                                  {new Date(
                                    parkingData.entryTime
                                  ).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <FaCarAlt className="text-purple-500 flex-shrink-0" />
                            <div className="min-w-0">
                              <p className="text-xs text-gray-500 uppercase tracking-wide">
                                Tipo de Vehículo
                              </p>
                              <p className="font-semibold text-gray-800 capitalize">
                                {parkingData.type === "car" ? "Carro" : "Moto"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Botones de acción */}
                  <div className="flex justify-between pt-4">
                    <button
                      onClick={() => setStep(2)}
                      className="px-6 py-3 rounded-xl text-gray-600 hover:text-gray-800 font-medium transition-colors"
                      type="button"
                    >
                      <FaArrowLeft /> Editar datos
                    </button>
                    <button
                      onClick={async () => {
                        await ticketService.printTicket(buildTicketData());
                        handleConfirm();
                      }}
                      className="px-8 py-3 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold hover:shadow-lg transition-all flex items-center gap-2"
                      type="button"
                    >
                      <FaPrint /> Imprimir ticket y registrar salida
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const ParkingExit = () => {
  const [exitModalOpen, setExitModalOpen] = useState(false);
  const [exitData, setExitData] = useState(null);

  const handleParkingExit = (parkingObj) => {
    setExitData({ ...parkingObj, source: "parking" });
    setExitModalOpen(true);
  };

  return (
    <div>
      {/* Otros componentes y lógica del módulo de parqueo */}
      <ExitModal
        isOpen={exitModalOpen}
        onClose={() => setExitModalOpen(false)}
        parkingData={exitData}
        onExitConfirm={(data, invoiceData) => {
           console.log("Salida confirmada:", data, invoiceData);
          setExitModalOpen(false);
        }}
      />
    </div>
  );
};

export default ExitModal;
