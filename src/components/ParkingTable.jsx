import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaSignOutAlt,
  FaMotorcycle,
  FaCarAlt,
  FaParking,
} from "react-icons/fa";
import ParkingExitModal from "./ParkingExitModal";

const iconByType = {
  car: <FaCarAlt className="text-indigo-500 text-xl mx-auto" />,
  moto: <FaMotorcycle className="text-indigo-500 text-xl mx-auto" />,
  libre: <FaParking className="text-slate-400 text-xl mx-auto" />,
};

const mockParkingData = [
  {
    id: 1,
    spot: 1,
    status: "ocupado",
    type: "car",
    licensePlate: "ABC-123",
    visitorName: "Juan Pérez",
    interior: "Torre 1",
    apartment: "302B",
    entryTime: new Date().setHours(8, 30),
  },
  {
    id: 2,
    spot: 2,
    status: "ocupado",
    type: "moto",
    licensePlate: "XYZ-987",
    visitorName: "Ana Torres",
    interior: "Torre 2",
    apartment: "104A",
    entryTime: new Date().setHours(9, 15),
  },
  {
    id: 3,
    spot: 3,
    status: "libre",
    type: "libre",
    licensePlate: "",
    visitorName: "",
    interior: "",
    apartment: "",
    entryTime: null,
  },
  {
    id: 4,
    spot: 4,
    status: "ocupado",
    type: "car",
    licensePlate: "JKL-456",
    visitorName: "Luis Gómez",
    interior: "Torre 3",
    apartment: "405C",
    entryTime: new Date().setHours(10, 5),
  },
  {
    id: 5,
    spot: 5,
    status: "libre",
    type: "libre",
    licensePlate: "",
    visitorName: "",
    interior: "",
    apartment: "",
    entryTime: null,
  },
];

export default function ParkingTable() {
  const [parkingData, setParkingData] = useState([]);
  const [modalData, setModalData] = useState(null);
  const [loading, setLoading] = useState(false);

  const USE_API = false;

  useEffect(() => {
    setLoading(true);
    if (USE_API) {
      fetch("/api/parking")
        .then((res) => res.json())
        .then((data) => setParkingData(data))
        .finally(() => setLoading(false));
    } else {
      setTimeout(() => {
        setParkingData(mockParkingData);
        setLoading(false);
      }, 800);
    }
  }, []);

  const handleSalida = (vehiculo) => {
    setModalData(vehiculo);
  };

  const handleRegisterExit = (factura) => {
    setParkingData((prev) =>
      prev.map((p) =>
        p.id === factura.id
          ? {
              ...p,
              status: "libre",
              type: "libre",
              licensePlate: "",
              visitorName: "",
              interior: "",
              apartment: "",
              entryTime: null,
            }
          : p
      )
    );
    // setModalData(null);
  };

  const sorted = [...parkingData].sort((a, b) =>
    a.status === "libre" ? 1 : -1
  );

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="rounded-2xl border border-slate-200 shadow-lg bg-white p-4 md:p-6 max-w-5xl mx-auto"
      >
        <h2 className="text-center text-2xl font-bold text-indigo-700 mb-4">
          Parqueaderos
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-slate-700">
            <thead>
              <tr>
                <Th className="bg-indigo-50 text-indigo-700 text-center rounded-tl-2xl">
                  #
                </Th>
                <Th className="bg-indigo-50 text-indigo-700 text-center border-r border-slate-100">
                  Estado
                </Th>
                <Th className="bg-indigo-50 text-indigo-700 text-center border-r border-slate-100">
                  Vehículo
                </Th>
                <Th
                  colSpan={2}
                  className="bg-indigo-50 text-indigo-700 text-center border-r border-slate-100"
                >
                  Visitante / Residente
                </Th>
                <Th className="bg-indigo-50 text-indigo-700 text-center border-r border-slate-100">
                  Ingreso
                </Th>
                <Th className="bg-indigo-50 text-indigo-700 text-center rounded-tr-2xl">
                  Acción
                </Th>
              </tr>
              <tr>
                <Th className="text-center bg-slate-50">N°</Th>
                <Th className="text-center bg-slate-50">Ocupado/Libre</Th>
                <Th className="text-center bg-slate-50">Tipo / Placa</Th>
                <Th className="text-center bg-slate-50">Nombre</Th>
                <Th className="text-center bg-slate-50">Apto / Interior</Th>
                <Th className="text-center bg-slate-50">Hora</Th>
                <Th className="text-center bg-slate-50">—</Th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <Td colSpan={7} className="text-center py-8 text-slate-400">
                    Cargando...
                  </Td>
                </tr>
              ) : sorted.length === 0 ? (
                <tr>
                  <Td colSpan={7} className="text-center py-8 text-slate-400">
                    No hay parqueaderos registrados.
                  </Td>
                </tr>
              ) : (
                sorted.map((v, index) => (
                  <motion.tr
                    key={v.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.04 }}
                    className="hover:bg-indigo-50 transition"
                  >
                    {/* N° */}
                    <Td className="text-center font-bold text-indigo-700">{`#${v.spot}`}</Td>
                    {/* Estado */}
                    <Td className="text-center">
                      {v.status === "ocupado" ? (
                        <span className="inline-block px-2 py-1 text-orange-600 bg-orange-100 rounded-full text-xs font-semibold">
                          Ocupado
                        </span>
                      ) : (
                        <span className="inline-block px-2 py-1 text-green-600 bg-green-100 rounded-full text-xs font-semibold">
                          Libre
                        </span>
                      )}
                    </Td>
                    {/* Vehículo */}
                    <Td className="text-center">
                      <div className="flex flex-col items-center">
                        {iconByType[v.type]}
                        <span className="text-xs">{v.licensePlate || "—"}</span>
                      </div>
                    </Td>
                    {/* Nombre */}
                    <Td className="text-center font-medium">
                      {v.visitorName || "—"}
                    </Td>
                    {/* Apto / Interior */}
                    <Td className="text-center">
                      <div className="text-xs">{v.apartment || "—"}</div>
                      <div className="text-xs text-slate-500">
                        {v.interior || "—"}
                      </div>
                    </Td>
                    {/* Ingreso */}
                    <Td className="text-center">
                      {v.entryTime ? (
                        <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">
                          {new Date(v.entryTime).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </Td>
                    {/* Acción */}
                    <Td className="text-center">
                      {v.status === "ocupado" ? (
                        <button
                          onClick={() => handleSalida(v)}
                          className="flex items-center justify-center gap-1 text-xs text-white bg-indigo-600 hover:bg-indigo-700 px-3 py-1 rounded-full shadow transition"
                        >
                          <FaSignOutAlt />
                          Salida
                        </button>
                      ) : (
                        <span className="text-slate-300">—</span>
                      )}
                    </Td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Modal de salida */}
      {modalData && (
        <ParkingExitModal
          isOpen={!!modalData}
          onClose={() => setModalData(null)}
          onRegisterExit={handleRegisterExit}
          vehiculo={modalData}
        />
      )}
    </>
  );
}

const Th = ({ children, className = "", ...props }) => (
  <th
    className={`px-4 py-3 text-center whitespace-nowrap ${className}`}
    {...props}
  >
    {children}
  </th>
);

const Td = ({ children, className = "", ...props }) => (
  <td
    className={`px-4 py-3 border-t border-slate-100 whitespace-nowrap align-middle ${className}`}
    {...props}
  >
    {children}
  </td>
);
