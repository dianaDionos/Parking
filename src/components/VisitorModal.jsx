import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ParkingTicket from "./ParkingTicket";
import parkingService from "../services/parkingService";
import ticketService from "../services/ticketService";
import ModernInput from "./ModernInput";

const VisitorModal = ({ isOpen, onClose, onAddVisitor }) => {
  const mockResidents = [
    { name: "Laura Ramírez", apartment: "302B", interior: "Torre 2" },
    { name: "Carlos Gómez", apartment: "104A", interior: "Torre 1" },
    { name: "Sandra Martínez", apartment: "405C", interior: "Torre 3" },
  ];

  const [step, setStep] = useState(1);
  const [selectedResident, setSelectedResident] = useState(null);
  const [residentSearch, setResidentSearch] = useState("");
  const [visitor, setVisitor] = useState({
    name: "",
    phone: "",
    id: "",
    email: "",
    hasVehicle: false,
    plate: "",
    vehicleType: "",
    electronicBilling: false,
    billingName: "",
    billingId: "",
    billingEmail: "",
    billingType: "",
  });
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [generatedTicket, setGeneratedTicket] = useState(null);
  const [showFacturaModal, setShowFacturaModal] = useState(false);

  const filteredResidents = mockResidents.filter((r) =>
    `${r.name} ${r.apartment} ${r.interior}`
      .toLowerCase()
      .includes(residentSearch.toLowerCase())
  );

  const handleNext = () => {
    // Si paso 2 y trae vehículo, ir a paso 3
    if (step === 2 && visitor.hasVehicle) {
      setStep(3);
    } else if (step === 3 && visitor.hasVehicle && visitor.electronicBilling) {
      setStep(4); // Paso de facturación electrónica
    } else {
      setStep(step + 1);
    }
  };
  const handleBack = () => {
    if (step === 4) {
      setStep(3);
    } else if (step === 3 && visitor.hasVehicle) {
      setStep(2);
    } else {
      setStep(step - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const now = new Date();
    const visitorData = {
      ...visitor,
      resident: selectedResident,
      apartment: selectedResident?.apartment,
      interior: selectedResident?.interior,
      date:
        now.toISOString().split("T")[0] + " " + now.toTimeString().slice(0, 5),
      status: "ingresado",
      id: visitor.id,
    };

    // Si tiene vehículo, generar ticket de parqueadero
    if (visitor.hasVehicle && visitor.plate) {
      try {
        const vehicleData = {
          plate: visitor.plate,
          vehicleType: visitor.vehicleType,
        };
        const ticket = await parkingService.generateTicket(
          visitorData,
          vehicleData
        );
        setGeneratedTicket({ visitorData, vehicleData, ticket });
        setShowTicketModal(true);
        visitorData.parkingTicket = ticket.ticketNumber;
        visitorData.parkingSpot = ticket.spot;
        // Si pide factura electrónica, mostrar modal de factura
        if (visitor.electronicBilling) {
          setShowFacturaModal(true);
          return;
        }
      } catch (error) {
        console.error("Error generando ticket de parqueadero:", error);
        alert(
          "Error al generar el ticket de parqueadero. El visitante será registrado sin ticket."
        );
      }
    }
    onAddVisitor(visitorData);
    if (!visitor.hasVehicle) {
      handleClose();
    }
  };

  const handleFacturaSubmit = () => {
    // Aquí puedes llamar a la lógica de facturación electrónica real
    setShowFacturaModal(false);
    setShowTicketModal(false);
    onAddVisitor({ ...visitor, status: "ingresado" });
    handleClose();
  };

  const handleClose = () => {
    setStep(1);
    setSelectedResident(null);
    setResidentSearch("");
    setVisitor({
      name: "",
      phone: "",
      id: "",
      email: "",
      hasVehicle: false,
      plate: "",
      vehicleType: "",
    });
    setShowTicketModal(false);
    setGeneratedTicket(null);
    onClose();
  };

  const handleTicketClose = () => {
    setShowTicketModal(false);
    handleClose(); // Cerrar el modal principal después del ticket
  };

  const totalSteps = visitor.hasVehicle ? 3 : 2;
  const progressPercent = (step / totalSteps) * 100;

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
            className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    Registro de Visitante
                  </h2>
                  <p className="text-indigo-100 text-sm mt-1">
                    Completa la información del visitante
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="text-white/80 hover:text-white text-2xl font-light transition-colors"
                >
                  ×
                </button>
              </div>

              {/* Progress Bar */}
              <div className="mt-6">
                <div className="flex items-center justify-between text-sm text-indigo-100 mb-2">
                  <span>
                    Paso {step} de {totalSteps}
                  </span>
                  <span>{Math.round(progressPercent)}% completado</span>
                </div>
                <div className="w-full bg-indigo-400/30 rounded-full h-2">
                  <motion.div
                    className="bg-white h-2 rounded-full shadow-sm"
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                  />
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Paso 1: Residente */}
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
                        <svg
                          className="w-8 h-8 text-indigo-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                          />
                        </svg>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        Seleccionar Residente
                      </h3>
                      <p className="text-gray-600 text-sm">
                        Busca y selecciona al residente que será visitado
                      </p>
                    </div>

                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg
                          className="h-5 w-5 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                          />
                        </svg>
                      </div>
                      <input
                        type="text"
                        placeholder="Buscar por nombre, Unidad residencial o torre..."
                        value={residentSearch}
                        onChange={(e) => setResidentSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      />
                    </div>

                    <div className="bg-gray-50 rounded-xl overflow-hidden border border-gray-200">
                      <div className="max-h-60 overflow-y-auto">
                        {filteredResidents.length === 0 ? (
                          <div className="p-6 text-center text-gray-500">
                            No se encontraron residentes
                          </div>
                        ) : (
                          filteredResidents.map((r, idx) => (
                            <motion.div
                              key={idx}
                              whileHover={{ backgroundColor: "#f3f4f6" }}
                              onClick={() => setSelectedResident(r)}
                              className={`p-4 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors ${
                                selectedResident?.apartment === r.apartment
                                  ? "bg-indigo-50 border-indigo-200"
                                  : ""
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <h4 className="font-medium text-gray-900">
                                    {r.name}
                                  </h4>
                                  <p className="text-sm text-gray-600">
                                    {r.apartment} - {r.interior}
                                  </p>
                                </div>
                                {selectedResident?.apartment ===
                                  r.apartment && (
                                  <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center">
                                    <svg
                                      className="w-4 h-4 text-white"
                                      fill="currentColor"
                                      viewBox="0 0 20 20"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                  </div>
                                )}
                              </div>
                            </motion.div>
                          ))
                        )}
                      </div>
                    </div>

                    {selectedResident && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-green-50 border border-green-200 rounded-xl p-4"
                      >
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                            <svg
                              className="w-5 h-5 text-green-600"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-green-800">
                              Residente seleccionado
                            </p>
                            <p className="text-green-700">
                              <strong>{selectedResident.name}</strong> -{" "}
                              {selectedResident.apartment},{" "}
                              {selectedResident.interior}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    <div className="flex justify-end pt-4">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="button"
                        disabled={!selectedResident}
                        className="px-8 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                        onClick={handleNext}
                      >
                        Continuar →
                      </motion.button>
                    </div>
                  </motion.div>
                )}

                {/* Paso 2: Datos del visitante */}
                {step === 2 && (
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
                        <svg
                          className="w-8 h-8 text-indigo-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        Información del Visitante
                      </h3>
                      <p className="text-gray-600 text-sm">
                        Completa los datos personales del visitante
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <ModernInput
                        label="Nombre completo"
                        value={visitor.name}
                        setValue={(v) => setVisitor({ ...visitor, name: v })}
                        icon={
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                        }
                      />
                      <ModernInput
                        label="Teléfono"
                        value={visitor.phone}
                        setValue={(v) => setVisitor({ ...visitor, phone: v })}
                        icon={
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                            />
                          </svg>
                        }
                      />
                      <ModernInput
                        label="Cédula"
                        value={visitor.id}
                        setValue={(v) => setVisitor({ ...visitor, id: v })}
                        icon={
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V4a2 2 0 114 0v2m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"
                            />
                          </svg>
                        }
                      />
                      <ModernInput
                        label="Correo electrónico"
                        value={visitor.email}
                        type="email"
                        setValue={(v) => setVisitor({ ...visitor, email: v })}
                        icon={
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            />
                          </svg>
                        }
                      />
                    </div>

                    <div className="flex items-center gap-4 mt-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={visitor.hasVehicle}
                          onChange={(e) =>
                            setVisitor({
                              ...visitor,
                              hasVehicle: e.target.checked,
                            })
                          }
                          className="form-checkbox h-5 w-5 text-indigo-600"
                        />
                        <span className="font-medium text-indigo-800">
                          ¿El visitante trae vehículo?
                        </span>
                      </label>
                    </div>

                    <div className="flex justify-between pt-4">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="button"
                        onClick={handleBack}
                        className="px-6 py-3 rounded-xl text-gray-600 hover:text-gray-800 font-medium transition-colors"
                      >
                        ← Atrás
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="button"
                        className="px-8 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold hover:shadow-lg transition-all"
                        onClick={() => {
                          if (visitor.hasVehicle) setStep(3);
                          else handleSubmit({ preventDefault: () => {} });
                        }}
                      >
                        {visitor.hasVehicle
                          ? "Continuar →"
                          : "Registrar Visitante"}
                      </motion.button>
                    </div>
                  </motion.div>
                )}

                {/* Paso 3: Datos del vehículo y facturación electrónica */}
                {step === 3 && visitor.hasVehicle && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div className="text-center">
                      <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg
                          className="w-8 h-8 text-indigo-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"
                          />
                        </svg>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        Información del Vehículo
                      </h3>
                      <p className="text-gray-600 text-sm">
                        Completa los datos del vehículo del visitante
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <ModernInput
                        label="Placa del vehículo"
                        value={visitor.plate}
                        setValue={(v) => setVisitor({ ...visitor, plate: v })}
                        placeholder="ABC-123"
                        icon={
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                            />
                          </svg>
                        }
                      />
                      <ModernInput
                        label="Tipo de vehículo"
                        value={visitor.vehicleType}
                        setValue={(v) =>
                          setVisitor({ ...visitor, vehicleType: v })
                        }
                        icon={
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                        }
                      />
                    </div>

                    {/* Cierre de grid y paso 3 */}
                    
                    <div className="flex justify-between pt-4">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="button"
                        onClick={handleBack}
                        className="px-6 py-3 rounded-xl text-gray-600 hover:text-gray-800 font-medium transition-colors"
                      >
                        ← Atrás
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        className="px-8 py-3 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold hover:shadow-lg transition-all"
                      >
                        🎉 Registrar Visitante
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
      {/* Modal de ticket de parqueadero */}
      {showTicketModal && generatedTicket && (
        <ParkingTicket
          isOpen={showTicketModal}
          onClose={handleTicketClose}
          visitorData={generatedTicket.visitorData}
          vehicleData={generatedTicket.vehicleData}
        />
      )}
    </AnimatePresence>
  );
};

export default VisitorModal;
