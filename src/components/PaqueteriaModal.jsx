import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FaBoxOpen } from "react-icons/fa";

const mockResidents = [
  { name: "Laura Ramírez", apartment: "302B", interior: "Torre 2" },
  { name: "Carlos Gómez", apartment: "104A", interior: "Torre 1" },
  { name: "Sandra Martínez", apartment: "405C", interior: "Torre 3" },
];

const PaqueteriaModal = ({ isOpen, onClose, onRegister }) => {
  const [step, setStep] = useState(1);
  const [residentSearch, setResidentSearch] = useState("");
  const [selectedResident, setSelectedResident] = useState(null);
  const [paquetes, setPaquetes] = useState([
    { remitente: "", descripcion: "" },
  ]);

  const filteredResidents = mockResidents.filter((r) =>
    `${r.name} ${r.apartment} ${r.interior}`
      .toLowerCase()
      .includes(residentSearch.toLowerCase())
  );

  const handlePaqueteChange = (idx, field, value) => {
    setPaquetes((prev) =>
      prev.map((p, i) => (i === idx ? { ...p, [field]: value } : p))
    );
  };

  const handleAddPaquete = () => {
    setPaquetes((prev) => [...prev, { remitente: "", descripcion: "" }]);
  };

  const handleRemovePaquete = (idx) => {
    setPaquetes((prev) => prev.filter((_, i) => i !== idx));
  };

  const canSubmit =
    selectedResident && paquetes.every((p) => p.remitente && p.descripcion);

  const totalSteps = 2;
  const progressPercent = (step / totalSteps) * 100;

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (canSubmit) {
      onRegister({
        apto: selectedResident.apartment,
        nombre: selectedResident.name,
        interior: selectedResident.interior,
        paquetes: paquetes.map((p) => ({
          ...p,
          fecha: new Date().toISOString(),
        })),
      });
      setStep(1);
      setSelectedResident(null);
      setResidentSearch("");
      setPaquetes([{ remitente: "", descripcion: "" }]);
      onClose();
    }
  };

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
            className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-yellow-100 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 px-8 py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FaBoxOpen className="text-3xl text-white" />
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      Registro de Paquetería
                    </h2>
                    <p className="text-yellow-50 text-sm mt-1">
                      Notifica la llegada de uno o varios paquetes a un
                      residente
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
              {/* Progress Bar */}
              <div className="mt-6">
                <div className="flex items-center justify-between text-sm text-yellow-50 mb-2">
                  <span>
                    Paso {step} de {totalSteps}
                  </span>
                  <span>{Math.round(progressPercent)}% completado</span>
                </div>
                <div className="w-full bg-yellow-300/30 rounded-full h-2">
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
            <div className="flex flex-col" style={{ maxHeight: "80vh" }}>
              <form
                onSubmit={handleSubmit}
                className="flex-1 flex flex-col overflow-y-auto space-y-6 p-4 md:p-8"
                style={{ maxHeight: "80vh" }}
              >
                {/* Paso 1: Selección de residente */}
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
                      <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FaBoxOpen className="text-3xl text-yellow-500" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        Seleccionar Residente
                      </h3>
                      <p className="text-gray-600 text-sm">
                        Busca y selecciona al residente destinatario
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
                        placeholder="Buscar por nombre, apto o torre..."
                        value={residentSearch}
                        onChange={(e) => setResidentSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-yellow-200 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                      />
                    </div>
                    <div className="bg-yellow-50 rounded-xl overflow-hidden border border-yellow-200">
                      <div className="max-h-60 overflow-y-auto">
                        {filteredResidents.length === 0 ? (
                          <div className="p-6 text-center text-gray-500">
                            No se encontraron residentes
                          </div>
                        ) : (
                          filteredResidents.map((r, idx) => (
                            <motion.div
                              key={idx}
                              whileHover={{ backgroundColor: "#FEF9C3" }}
                              onClick={() => setSelectedResident(r)}
                              className={`p-4 cursor-pointer border-b border-yellow-100 last:border-b-0 transition-colors ${
                                selectedResident?.apartment === r.apartment
                                  ? "bg-yellow-100 border-yellow-300"
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
                                  <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
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
                        className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mt-2"
                      >
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center mr-3">
                            <FaBoxOpen className="text-xl text-yellow-500" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-yellow-800">
                              Residente seleccionado
                            </p>
                            <p className="text-yellow-700">
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
                        className="px-8 py-3 rounded-xl bg-gradient-to-r from-yellow-400 to-yellow-500 text-white font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                        onClick={handleNext}
                      >
                        Continuar →
                      </motion.button>
                    </div>
                  </motion.div>
                )}
                {/* Paso 2: Datos de paquetes */}
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
                      <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FaBoxOpen className="text-3xl text-yellow-500" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        Información de Paquetes
                      </h3>
                      <p className="text-gray-600 text-sm">
                        Completa los datos de cada paquete recibido
                      </p>
                    </div>
                    <div className="space-y-4">
                      {paquetes.map((p, idx) => (
                        <div
                          key={idx}
                          className="rounded-xl border border-yellow-100 bg-yellow-50 p-4 relative"
                        >
                          <div className="flex gap-2 items-center mb-2">
                            <span className="text-yellow-600 font-semibold">
                              Paquete {idx + 1}
                            </span>
                            {paquetes.length > 1 && (
                              <button
                                type="button"
                                className="ml-auto text-xs text-yellow-400 hover:text-red-500"
                                onClick={() => handleRemovePaquete(idx)}
                              >
                                Quitar
                              </button>
                            )}
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-slate-600 text-xs mb-1 font-medium">
                                Remitente
                              </label>
                              <input
                                className="w-full rounded-xl border border-yellow-200 bg-white px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-yellow-300 transition"
                                value={p.remitente}
                                onChange={(e) =>
                                  handlePaqueteChange(
                                    idx,
                                    "remitente",
                                    e.target.value
                                  )
                                }
                                placeholder="Ej: Amazon, Servientrega, Juan Pérez..."
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-slate-600 text-xs mb-1 font-medium">
                                Descripción
                              </label>
                              <input
                                className="w-full rounded-xl border border-yellow-200 bg-white px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-yellow-300 transition"
                                value={p.descripcion}
                                onChange={(e) =>
                                  handlePaqueteChange(
                                    idx,
                                    "descripcion",
                                    e.target.value
                                  )
                                }
                                placeholder="Ej: Caja pequeña, documento, etc."
                                required
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                      <button
                        type="button"
                        className="w-full bg-yellow-100 hover:bg-yellow-200 text-yellow-700 font-semibold py-2 rounded-xl text-md shadow transition border border-yellow-200"
                        onClick={handleAddPaquete}
                      >
                        + Agregar otro paquete
                      </button>
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
                        type="submit"
                        className="px-8 py-3 rounded-xl bg-gradient-to-r from-yellow-400 to-yellow-500 text-white font-semibold hover:shadow-lg transition-all"
                        disabled={!canSubmit}
                      >
                        Notificar llegada
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PaqueteriaModal;
