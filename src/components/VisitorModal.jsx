import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

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
  });

  const filteredResidents = mockResidents.filter((r) =>
    `${r.name} ${r.apartment} ${r.interior}`
      .toLowerCase()
      .includes(residentSearch.toLowerCase())
  );

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      ...visitor,
      resident: selectedResident,
      apartment: selectedResident.apartment,
      interior: selectedResident.interior,
      date: new Date().toISOString(),
      status: "ingresado",
    };
    onAddVisitor(data);
    onClose();
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
          className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-md grid place-items-center px-4"
          onClick={onClose}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="w-full max-w-2xl bg-white rounded-xl shadow-xl border border-slate-200 p-6 space-y-4"
          >
            <h2 className="text-xl font-semibold text-indigo-700 text-center">
              Registro de visitante
            </h2>

            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div
                className="bg-indigo-500 h-2 transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <p className="text-xs text-right text-slate-500">
              Paso {step} de {totalSteps}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Paso 1: Residente */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <label className="block text-sm font-medium text-slate-600 mb-1">
                    Buscar residente
                  </label>
                  <input
                    type="text"
                    placeholder="Nombre, apartamento o interior"
                    value={residentSearch}
                    onChange={(e) => setResidentSearch(e.target.value)}
                    className="w-full border rounded px-3 py-2 text-sm text-slate-800"
                  />
                  <div className="max-h-40 overflow-y-auto mt-2 border rounded">
                    <table className="min-w-full text-sm">
                      <tbody>
                        {filteredResidents.map((r, idx) => (
                          <tr
                            key={idx}
                            onClick={() => setSelectedResident(r)}
                            className={`cursor-pointer hover:bg-indigo-50 ${
                              selectedResident?.apartment === r.apartment
                                ? "bg-indigo-100"
                                : ""
                            }`}
                          >
                            <td className="p-2">{r.name}</td>
                            <td className="p-2">{r.apartment}</td>
                            <td className="p-2">{r.interior}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {selectedResident && (
                    <p className="text-sm text-green-600 mt-1">
                      Seleccionado: <strong>{selectedResident.name}</strong>
                    </p>
                  )}
                  <div className="flex justify-end pt-4">
                    <button
                      type="button"
                      disabled={!selectedResident}
                      className="px-4 py-2 rounded bg-indigo-600 text-white font-medium hover:opacity-90 transition disabled:opacity-40"
                      onClick={handleNext}
                    >
                      Siguiente
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Paso 2: Datos del visitante */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Input
                    label="Nombre completo"
                    value={visitor.name}
                    setValue={(v) => setVisitor({ ...visitor, name: v })}
                  />
                  <Input
                    label="Teléfono"
                    value={visitor.phone}
                    setValue={(v) => setVisitor({ ...visitor, phone: v })}
                  />
                  <Input
                    label="Cédula"
                    value={visitor.id}
                    setValue={(v) => setVisitor({ ...visitor, id: v })}
                  />
                  <Input
                    label="Correo electrónico"
                    value={visitor.email}
                    type="email"
                    setValue={(v) => setVisitor({ ...visitor, email: v })}
                  />
                  <div className="flex items-center gap-2 mt-2">
                    <input
                      type="checkbox"
                      checked={visitor.hasVehicle}
                      onChange={(e) =>
                        setVisitor({ ...visitor, hasVehicle: e.target.checked })
                      }
                      className="accent-indigo-600"
                    />
                    <span className="text-sm text-slate-700">
                      ¿Trae vehículo?
                    </span>
                  </div>
                  <div className="flex justify-between pt-4">
                    <button
                      type="button"
                      onClick={handleBack}
                      className="text-sm text-slate-500 hover:underline"
                    >
                      Atrás
                    </button>
                    <button
                      type="button"
                      className="px-4 py-2 rounded bg-indigo-600 text-white font-medium hover:opacity-90"
                      onClick={visitor.hasVehicle ? handleNext : handleSubmit}
                    >
                      {visitor.hasVehicle ? "Siguiente" : "Registrar"}
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Paso 3: Vehículo */}
              {step === 3 && visitor.hasVehicle && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Input
                    label="Placa del vehículo"
                    value={visitor.plate}
                    setValue={(v) => setVisitor({ ...visitor, plate: v })}
                  />
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">
                      Tipo de vehículo
                    </label>
                    <select
                      value={visitor.vehicleType}
                      onChange={(e) =>
                        setVisitor({ ...visitor, vehicleType: e.target.value })
                      }
                      className="w-full border rounded px-3 py-2 text-sm text-slate-800"
                      required
                    >
                      <option value="">Seleccione...</option>
                      <option value="Carro">Carro</option>
                      <option value="Moto">Moto</option>
                    </select>
                  </div>
                  <div className="flex justify-between pt-4">
                    <button
                      type="button"
                      onClick={handleBack}
                      className="text-sm text-slate-500 hover:underline"
                    >
                      Atrás
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded bg-indigo-600 text-white font-medium hover:opacity-90"
                    >
                      Registrar
                    </button>
                  </div>
                </motion.div>
              )}
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const Input = ({ label, value, setValue, type = "text" }) => (
  <div>
    <label className="block text-sm font-medium text-slate-600 mb-1">
      {label}
    </label>
    <input
      type={type}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      className="w-full border rounded px-3 py-2 text-sm text-slate-800"
      required
    />
  </div>
);

export default VisitorModal;