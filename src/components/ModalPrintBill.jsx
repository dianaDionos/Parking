import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

const DIAN_MOCK_CUFE = "1234567890-FAKE-CUFE-2025";
const DIAN_MOCK_RESOL = "18760000000000";
const DIAN_MOCK_FECHA = new Date().toLocaleDateString();

const Factura = ({ vehiculo, factura, onClose }) => {
  useEffect(() => {
    setTimeout(() => window.print(), 300);
  }, []);

  return (
    <div className="w-full max-w-md bg-white rounded-xl shadow-xl border border-slate-200 p-6 space-y-4 print:p-2 print:shadow-none print:border-none">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h2 className="text-lg font-bold text-indigo-700">
            Factura de Parqueadero
          </h2>
          <div className="text-xs text-slate-400">Conjunto Residencial</div>
        </div>
        <div className="text-right">
          <div className="text-xs text-slate-400">Fecha: {DIAN_MOCK_FECHA}</div>
          <div className="text-xs text-slate-400">
            Factura N°: {factura.numero || "0001"}
          </div>
        </div>
      </div>
      <hr />
      <div className="space-y-1 text-sm text-slate-700">
        <p>
          <strong>Placa:</strong> {vehiculo.licensePlate}
        </p>
        <p>
          <strong>Visitante:</strong> {vehiculo.visitorName}
        </p>
        <p>
          <strong>Apartamento:</strong> {vehiculo.apartment}
        </p>
        <p>
          <strong>Interior:</strong> {vehiculo.interior}
        </p>
        <p>
          <strong>Hora ingreso:</strong>{" "}
          {vehiculo.entryTime
            ? new Date(vehiculo.entryTime).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            : "—"}
        </p>
        <p>
          <strong>Hora salida:</strong>{" "}
          {factura.exitTime
            ? new Date(factura.exitTime).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            : "—"}
        </p>
      </div>
      <div className="my-4 flex items-center justify-between">
        <span className="font-bold text-lg text-slate-700">Total a pagar:</span>
        <span className="font-extrabold text-2xl text-green-600">
          {factura.total}
        </span>
      </div>
      <hr />
      <div className="text-xs text-slate-500 space-y-1">
        <div>Resolución DIAN: {DIAN_MOCK_RESOL}</div>
        <div>CUFE: {DIAN_MOCK_CUFE}</div>
        <div>Factura electrónica válida para la DIAN</div>
      </div>
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
      {/* Aquí puedes agregar un QR o firma digital en el futuro */}
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
    onRegisterExit(facturaData); // Aquí puedes enviar al backend si lo deseas
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-md grid place-items-center px-4"
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
            className="w-full max-w-md"
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
                    <strong>Apartamento:</strong> {vehiculo.apartment}
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
              <Factura
                vehiculo={vehiculo}
                factura={factura}
                onClose={onClose}
              />
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ParkingExitModal;
