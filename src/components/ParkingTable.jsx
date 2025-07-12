import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaSignOutAlt,
  FaMotorcycle,
  FaCarAlt,
  FaParking,
} from "react-icons/fa";

const iconByType = {
  car: <FaCarAlt className="text-indigo-500 text-xl mx-auto" />,
  moto: <FaMotorcycle className="text-indigo-500 text-xl mx-auto" />,
  libre: <FaParking className="text-slate-400 text-xl mx-auto" />,
};

export default function ParkingTable({ parking = [], onExit }) {
  const sorted = [...parking].sort((a, b) => (a.status === "libre" ? 1 : -1));
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="rounded-2xl border border-slate-200 shadow-lg bg-white p-4 md:p-6 max-w-5xl mx-auto"
    >
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
            {sorted.length === 0 ? (
              <tr>
                <Td colSpan={7} className="text-center py-8 text-slate-400">
                  No hay parqueaderos registrados.
                </Td>
              </tr>
            ) : (
              sorted.map((v, index) => (
                <motion.tr
                  key={v.id || v.plate || index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.04 }}
                  className="hover:bg-indigo-50 transition"
                >
                  {/* N° */}
                  <Td className="text-center font-bold text-indigo-700">{`#${
                    v.spot || index + 1
                  }`}</Td>
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
                      <span className="text-xs">
                        {v.licensePlate || v.plate || "—"}
                      </span>
                    </div>
                  </Td>
                  {/* Nombre */}
                  <Td className="text-center font-medium">
                    {v.visitorName || v.name || "—"}
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
                        onClick={() => onExit(v)}
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

// Ejemplo de arreglo de parqueaderos ocupados
const parkingDataPrueba = [
  {
    id: 1,
    status: "ocupado",
    type: "car",
    licensePlate: "ABC123",
    visitorName: "Juan Pérez",
    apartment: "302B",
    interior: "Torre 2",
    entryTime: new Date("2024-07-11T08:30:00"),
    spot: 1,
  },
  {
    id: 2,
    status: "ocupado",
    type: "moto",
    licensePlate: "XYZ789",
    visitorName: "Laura Ramírez",
    apartment: "104A",
    interior: "Torre 1",
    entryTime: new Date("2024-07-11T09:15:00"),
    spot: 2,
  },
  {
    id: 3,
    status: "ocupado",
    type: "car",
    licensePlate: "JKL456",
    visitorName: "Carlos Gómez",
    apartment: "405C",
    interior: "Torre 3",
    entryTime: new Date("2024-07-11T10:05:00"),
    spot: 3,
  },
  {
    id: 4,
    status: "ocupado",
    type: "car",
    licensePlate: "MNO321",
    visitorName: "Sandra Martínez",
    apartment: "201B",
    interior: "Torre 2",
    entryTime: new Date("2024-07-11T11:00:00"),
    spot: 4,
  },
  {
    id: 5,
    status: "ocupado",
    type: "moto",
    licensePlate: "QWE654",
    visitorName: "Pedro López",
    apartment: "305A",
    interior: "Torre 1",
    entryTime: new Date("2024-07-11T11:30:00"),
    spot: 5,
  },
];

// Uso del componente ParkingTable con datos de prueba
export function ParkingLot() {
  const [parking, setParking] = useState(parkingDataPrueba);

  const handleParkingExit = (exitingSpot) => {
    setParking((prev) =>
      prev.map((v) =>
        v.id === exitingSpot.id
          ? { ...v, status: "libre", visitorName: "", apartment: "", interior: "", entryTime: null }
          : v
      )
    );
  };

  return <ParkingTable parking={parking} onExit={handleParkingExit} />;
}
