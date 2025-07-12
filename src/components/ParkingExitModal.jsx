import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const DIAN_MOCK_CUFE = "1234567890-FAKE-CUFE-2025";
const DIAN_MOCK_RESOL = "18760000000000";
const DIAN_MOCK_FECHA = new Date().toLocaleDateString();

const Factura = ({ vehiculo, factura, onClose }) => {
  React.useEffect(() => {
    setTimeout(() => window.print(), 300);
  }, []);

  return (
    <div className="factura-print w-full max-w-sm mx-auto bg-white rounded-xl shadow-lg border border-slate-300 p-6 space-y-5 print:p-4 print:shadow-none print:border-none print:rounded-none font-mono">
      {/* Logo y nombre re quioere o no fatcura electronica y calculadora de valor que reste el valor totalizado, exacto*/}
      <div className="flex flex-col items-center mb-2">
        <span className="inline-block bg-indigo-100 rounded-full p-3 mb-2">
          {/* Puedes reemplazar este SVG por el logo real de Toledo */}
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" fill="#6366f1" />
            <path
              d="M8 17v-2a4 4 0 1 1 8 0v2"
              stroke="#fff"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <circle cx="12" cy="9" r="2" fill="#fff" />
          </svg>
        </span>
        <h2 className="text-2xl font-extrabold text-indigo-700 tracking-wide">
          Conjunto Toledo
        </h2>
        <div className="text-xs text-slate-500 font-semibold tracking-widest uppercase">
          Factura de Parqueadero
        </div>
      </div>
      <hr className="border-indigo-200" />

      {/* Info principal */}
      <div className="flex justify-between text-xs text-slate-500 mb-2">
        <span>
          Fecha:{" "}
          <span className="font-bold text-slate-700">{DIAN_MOCK_FECHA}</span>
        </span>
        <span>
          Factura N°:{" "}
          <span className="font-bold text-indigo-700">
            {factura.numero || "0001"}
          </span>
        </span>
      </div>

      {/* Datos del vehículo y visitante */}
      <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-sm text-slate-700">
        <div>
          <span className="font-semibold">Placa:</span> {vehiculo.licensePlate}
        </div>
        <div>
          <span className="font-semibold">Tipo:</span>{" "}
          {vehiculo.type === "car"
            ? "Carro"
            : vehiculo.type === "moto"
            ? "Moto"
            : "Otro"}
        </div>
        <div>
          <span className="font-semibold">Visitante:</span>{" "}
          {vehiculo.visitorName}
        </div>
        <div>
          <span className="font-semibold">Apto:</span> {vehiculo.apartment}
        </div>
        <div>
          <span className="font-semibold">Interior:</span> {vehiculo.interior}
        </div>
        <div>
          <span className="font-semibold">Ingreso:</span>{" "}
          {vehiculo.entryTime
            ? new Date(vehiculo.entryTime).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            : "—"}
        </div>
        <div>
          <span className="font-semibold">Salida:</span>{" "}
          {factura.exitTime
            ? new Date(factura.exitTime).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            : "—"}
        </div>
      </div>

      {/* Total a pagar */}
      <div className="flex items-center justify-between bg-indigo-50 rounded-xl px-4 py-3 my-2 border border-indigo-100">
        <span className="font-bold text-lg text-slate-700">Total a pagar:</span>
        <span className="font-extrabold text-2xl text-green-600">
          {factura.total}
        </span>
      </div>

      {/* Mensaje de agradecimiento */}
      <div className="bg-green-50 rounded-xl px-4 py-3 text-center border border-green-100">
        <div className="text-green-700 font-bold text-lg mb-1">
          ¡Gracias por su visita a Toledo!
        </div>
        <div className="text-green-600 text-sm">
          Esperamos verlo pronto de nuevo.
          <br />
          Su experiencia es importante para nosotros.
          <br />
          <span className="text-xs text-slate-400">#ViveToledo</span>
        </div>
      </div>

      <hr className="border-indigo-200" />

      {/* Datos DIAN */}
      <div className="text-xs text-slate-500 space-y-1 text-center">
        <div>Resolución DIAN: {DIAN_MOCK_RESOL}</div>
        <div>CUFE: {DIAN_MOCK_CUFE}</div>
        <div>Factura electrónica válida para la DIAN</div>
      </div>

      {/* Botones solo en pantalla, no impresión */}
      <div className="flex justify-between mt-4 print:hidden">
        <button
          onClick={() => window.print()}
          className="bg-indigo-600 text-white px-4 py-2 rounded font-medium hover:bg-indigo-700 transition"
        >
          Imprimir
        </button>
        <button
          onClick={onClose}
          className="bg-slate-200 text-slate-700 px-4 py-2 rounded font-medium hover:bg-slate-300 transition"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};

const ParkingExitModal = ({ isOpen, onClose, onRegisterExit, vehiculo }) => {
  const [factura, setFactura] = useState(null);

  if (!vehiculo) return null;

  const handleExit = () => {
    const facturaData = {
      ...vehiculo,
      exitTime: new Date().toISOString(),
      total: "$5.000", // Mock
      numero: Math.floor(Math.random() * 10000) + 1,
    };
    setFactura(facturaData);
    onRegisterExit(facturaData); // Actualiza la tabla
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-md grid place-items-center px-4 print:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="w-full max-w-md print:hidden"
          >
            {!factura ? (
              <div className="bg-white rounded-xl shadow-xl border border-slate-200 p-6 space-y-4">
                <h2 className="text-xl font-semibold text-indigo-700 text-center">
                  Registrar salida
                </h2>
                <div className="space-y-2 text-sm text-slate-700">
                  <p>
                    <strong>Placa:</strong> {vehiculo.licensePlate}
                  </p>
                  <p>
                    <strong>Visitante:</strong> {vehiculo.visitorName}
                  </p>
                  <p>
                    <strong>Unidad residencial:</strong> {vehiculo.apartment}
                  </p>
                  <p>
                    <strong>Interior:</strong> {vehiculo.interior}
                  </p>
                  <p>
                    <strong>Hora de ingreso:</strong>{" "}
                    {vehiculo.entryTime
                      ? new Date(vehiculo.entryTime).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "—"}
                  </p>
                </div>
                <button
                  onClick={handleExit}
                  className="mt-4 w-full bg-green-600 text-white py-2 rounded hover:opacity-90 font-medium"
                >
                  Confirmar salida y generar factura
                </button>
              </div>
            ) : (
              <div className="print:block print:relative">
                <Factura
                  vehiculo={vehiculo}
                  factura={factura}
                  onClose={onClose}
                />
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ParkingExitModal;
