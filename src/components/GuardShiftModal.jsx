import React, { useState } from "react";
import {
  FaUserShield,
  FaClock,
  FaExclamationCircle,
  FaUserCheck,
} from "react-icons/fa";

const GUARDS = [
  { name: "Juan Pérez", shift: "Mañana" },
  { name: "Ana Torres", shift: "Tarde" },
  { name: "Luis Ríos", shift: "Noche" },
];

export default function GuardShiftModal({
  isOpen,
  onClose,
  onRegister,
  late,
  previousNotOut,
}) {
  const [selectedGuard, setSelectedGuard] = useState("");
  const [relevoGuard, setRelevoGuard] = useState("");
  const [observations, setObservations] = useState("");
  const [isSubstitute, setIsSubstitute] = useState(false);
  const [physicallyPresent, setPhysicallyPresent] = useState(false);
  const now = new Date();
  const hour = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  if (!isOpen) return null;

  const canSubmit =
    selectedGuard && physicallyPresent && selectedGuard !== relevoGuard;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full relative border border-slate-100">
        <button
          className="absolute top-3 right-3 text-slate-400 hover:text-slate-700 text-2xl"
          onClick={onClose}
        >
          ×
        </button>
        <div className="flex flex-col items-center mb-6">
          <FaUserShield className="text-4xl text-indigo-300 mb-2" />
          <h2 className="text-2xl font-semibold text-slate-800 mb-1">
            Registro de Turno
          </h2>
          <p className="text-sm text-slate-500">
            Registra tu ingreso y el relevo de turno
          </p>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (canSubmit) {
              onRegister({
                guard: selectedGuard,
                relevo: relevoGuard,
                hour,
                observations,
                isSubstitute,
                physicallyPresent,
                late,
                previousNotOut,
              });
            }
          }}
          className="space-y-4"
        >
          <div>
            <label className="block text-slate-600 text-sm mb-1">
              Guardia que ingresa
            </label>
            <select
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-200 transition"
              value={selectedGuard}
              onChange={(e) => setSelectedGuard(e.target.value)}
              required
            >
              <option value="">Selecciona tu nombre</option>
              {GUARDS.map((g) => (
                <option key={g.name} value={g.name}>
                  {g.name} - Turno: {g.shift}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-slate-600 text-sm mb-1">
              Guardia que entrega (relevo)
            </label>
            <select
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-200 transition"
              value={relevoGuard}
              onChange={(e) => setRelevoGuard(e.target.value)}
              required
            >
              <option value="">Selecciona relevo</option>
              {GUARDS.filter((g) => g.name !== selectedGuard).map((g) => (
                <option key={g.name} value={g.name}>
                  {g.name} - Turno: {g.shift}
                </option>
              ))}
              <option value="Otro">Otro / No presente</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <FaClock className="text-indigo-300" />
            <span
              className={`text-lg font-mono ${
                late ? "text-red-500" : "text-slate-700"
              }`}
            >
              {hour}
            </span>
            {late && (
              <span className="ml-2 flex items-center text-xs text-red-500 bg-red-50 px-2 py-0.5 rounded-full">
                <FaExclamationCircle className="mr-1" /> Llegada tarde
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isSubstitute"
              checked={isSubstitute}
              onChange={(e) => setIsSubstitute(e.target.checked)}
              className="accent-indigo-500 w-4 h-4"
            />
            <label htmlFor="isSubstitute" className="text-slate-600 text-sm">
              Estoy cubriendo turno de otro guardia
            </label>
          </div>
          {previousNotOut && (
            <div className="flex items-center text-xs text-yellow-700 bg-yellow-50 px-3 py-2 rounded-xl mb-2">
              <FaExclamationCircle className="mr-2" />
              El relevo anterior no ha registrado salida. Por favor deja una
              observación.
            </div>
          )}
          <div>
            <label className="block text-slate-600 text-sm mb-1">
              Observaciones
            </label>
            <textarea
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-200 transition min-h-[60px]"
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
              placeholder="Ej: Llegué tarde por tráfico, relevo no presente, cubro turno, etc."
              required={
                previousNotOut || isSubstitute || late || relevoGuard === "Otro"
              }
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="physicallyPresent"
              checked={physicallyPresent}
              onChange={(e) => setPhysicallyPresent(e.target.checked)}
              className="accent-green-500 w-4 h-4"
              required
            />
            <label
              htmlFor="physicallyPresent"
              className="text-slate-600 text-sm flex items-center gap-1"
            >
              <FaUserCheck className="text-green-400" /> Confirmo que estoy
              presente y firmo mi ingreso
            </label>
          </div>
          <button
            type="submit"
            className={`w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl text-lg shadow transition mt-2 ${
              !canSubmit ? "opacity-60 cursor-not-allowed" : ""
            }`}
            disabled={!canSubmit}
          >
            Registrar entrada
          </button>
        </form>
      </div>
    </div>
  );
}
