import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import FacturaVisual from "./FacturaVisual";
import ReciboSalida from "./ReciboSalida";

const VisitorExitModal = ({
  isOpen,
  onClose,
  visitor,
  onRegisterExit,
}) => {
  const [askFactura, setAskFactura] = useState(false);
  const [facturaData, setFacturaData] = useState({
    billingName: "",
    billingId: "",
    billingEmail: "",
    billingType: "",
  });
  const [showFactura, setShowFactura] = useState(false);

  if (!visitor) return null;

  const handleExit = () => {
    const salidaData = {
      ...visitor,
      salida: new Date().toISOString(),
      facturaElectronica: askFactura ? facturaData : null,
    };
    onRegisterExit(salidaData);
    if (visitor.hasVehicle) {
      setShowFactura(true);
    } else {
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
            className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden"
          >
            {!showFactura ? (
              <div className="p-8">
                <h2 className="text-2xl font-bold text-indigo-700 mb-4">
                  Registrar salida de visitante
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <div className="font-semibold text-slate-700 mb-1">
                      Nombre:
                    </div>
                    <div>{visitor.name}</div>
                  </div>
                  <div>
                    <div className="font-semibold text-slate-700 mb-1">
                      Apto / Interior:
                    </div>
                    <div>
                      {visitor.resident?.apartment} / {visitor.resident?.interior}
                    </div>
                  </div>
                  <div>
                    <div className="font-semibold text-slate-700 mb-1">
                      Ingreso:
                    </div>
                    <div>
                      {visitor.date
                        ? new Date(visitor.date.replace(" ", "T")).toLocaleString()
                        : "-"}
                    </div>
                  </div>
                  <div>
                    <div className="font-semibold text-slate-700 mb-1">
                      Salida:
                    </div>
                    <div>{new Date().toLocaleString()}</div>
                  </div>
                  {visitor.hasVehicle && (
                    <>
                      <div>
                        <div className="font-semibold text-slate-700 mb-1">
                          Placa:
                        </div>
                        <div>{visitor.plate}</div>
                      </div>
                      <div>
                        <div className="font-semibold text-slate-700 mb-1">
                          Tipo de vehículo:
                        </div>
                        <div>{visitor.vehicleType}</div>
                      </div>
                    </>
                  )}
                </div>
                {visitor.hasVehicle && (
                  <div className="mb-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={askFactura}
                        onChange={(e) => setAskFactura(e.target.checked)}
                        className="form-checkbox h-5 w-5 text-yellow-600"
                      />
                      <span className="font-medium text-yellow-800">
                        ¿Desea factura electrónica?
                      </span>
                    </label>
                    {askFactura && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <input
                          type="text"
                          className="border rounded-xl px-3 py-2"
                          placeholder="Nombre o Razón Social"
                          value={facturaData.billingName}
                          onChange={(e) =>
                            setFacturaData({
                              ...facturaData,
                              billingName: e.target.value,
                            })
                          }
                        />
                        <input
                          type="text"
                          className="border rounded-xl px-3 py-2"
                          placeholder="Cédula o NIT"
                          value={facturaData.billingId}
                          onChange={(e) =>
                            setFacturaData({
                              ...facturaData,
                              billingId: e.target.value,
                            })
                          }
                        />
                        <input
                          type="email"
                          className="border rounded-xl px-3 py-2"
                          placeholder="Correo electrónico"
                          value={facturaData.billingEmail}
                          onChange={(e) =>
                            setFacturaData({
                              ...facturaData,
                              billingEmail: e.target.value,
                            })
                          }
                        />
                        <select
                          className="border rounded-xl px-3 py-2"
                          value={facturaData.billingType}
                          onChange={(e) =>
                            setFacturaData({
                              ...facturaData,
                              billingType: e.target.value,
                            })
                          }
                        >
                          <option value="">Tipo de facturación</option>
                          <option value="personal">Personal</option>
                          <option value="empresa">Empresa</option>
                        </select>
                      </div>
                    )}
                  </div>
                )}
                <div className="flex justify-end gap-4 mt-8">
                  <button
                    onClick={onClose}
                    className="px-6 py-3 rounded-xl text-gray-600 hover:text-gray-800 font-medium transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleExit}
                    className="px-8 py-3 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold hover:shadow-lg transition-all"
                  >
                    Registrar salida
                  </button>
                </div>
              </div>
            ) : (
              visitor.hasVehicle ? (
                <FacturaVisual
                  billing={{
                    facturaNumber: Math.floor(Math.random() * 100000) + 1,
                    cufe: "1234567890-FAKE-CUFE-2025",
                    visitorName: visitor.name,
                    licensePlate: visitor.plate,
                    apartment: visitor.resident?.apartment,
                    interior: visitor.resident?.interior,
                    entryTime: visitor.date,
                    exitTime: new Date().toISOString(),
                    parkingFee: 5000,
                    lostTicketFee: 0,
                    total: 5000,
                  }}
                />
              ) : (
                <ReciboSalida visitor={{ ...visitor, salida: new Date().toISOString() }} />
              )
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default VisitorExitModal;