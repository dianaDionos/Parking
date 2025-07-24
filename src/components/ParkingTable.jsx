import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaSignOutAlt,
  FaMotorcycle,
  FaCarAlt,
  FaParking,
  FaSearch,
} from "react-icons/fa";
import Paginator from "./Paginator";

const iconByType = {
  car: <FaCarAlt className="text-green-500 text-xl mx-auto" />,
  moto: <FaMotorcycle className="text-green-500 text-xl mx-auto" />,
  libre: <FaParking className="text-slate-400 text-xl mx-auto" />,
};

export default function ParkingTable({ parking = [], onExit }) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(5);

  // Filtrado por placa, nombre, apto, interior
  const filtered = parking.filter((v) => {
    const s = search.toLowerCase();
    return (
      v.licensePlate?.toLowerCase().includes(s) ||
      v.visitorName?.toLowerCase().includes(s) ||
      v.apartment?.toLowerCase().includes(s) ||
      v.interior?.toLowerCase().includes(s)
    );
  });

  const sorted = [...filtered].sort((a, b) => (a.status === "libre" ? 1 : -1));
  const totalPages = Math.max(1, Math.ceil(sorted.length / perPage));
  const paginated = sorted.slice((page - 1) * perPage, page * perPage);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [perPage, sorted.length, totalPages]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="rounded-2xl border border-green-200 shadow-lg bg-white p-4 md:p-6 max-w-5xl mx-auto"
    >
      <div className="mb-4 flex flex-col md:flex-row gap-2 items-center justify-between">
        <div className="relative w-full md:w-72">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-green-400" />
          <input
            type="text"
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-green-200 bg-green-50 text-green-700 focus:outline-none focus:ring-2 focus:ring-green-100 transition"
            placeholder="Buscar placa, nombre, apto..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <span className="text-xs text-green-400">
          {filtered.length} parqueaderos
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-black">
          <thead>
            <tr>
              <Th className="bg-green-50 text-green-700 text-center rounded-tl-2xl">
                #
              </Th>
              <Th className="bg-green-50 text-green-700 text-center border-r border-slate-100">
                Estado
              </Th>
              <Th className="bg-green-50 text-green-700 text-center border-r border-slate-100">
                Vehículo
              </Th>
              <Th
                colSpan={2}
                className="bg-green-50 text-green-700 text-center border-r border-slate-100"
              >
                Visitante / Residente
              </Th>
              <Th className="bg-green-50 text-green-700 text-center border-r border-slate-100">
                Ingreso
              </Th>
              <Th className="bg-green-50 text-green-700 text-center rounded-tr-2xl">
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
            {paginated.length === 0 ? (
              <tr>
                <Td colSpan={7} className="text-center py-8 text-green-400">
                  No hay parqueaderos registrados.
                </Td>
              </tr>
            ) : (
              paginated.map((v, index) => (
                <motion.tr
                  key={v.id || v.plate || index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.04 }}
                  className={`transition-colors ${
                    index % 2 === 0 ? "bg-white" : "bg-green-50"
                  } hover:bg-green-100`}
                >
                  {/* N° */}
                  <Td className="text-center font-bold text-green-700">{`#${
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
                  <Td className="text-center text-black">
                    <div className="flex flex-col items-center">
                      {iconByType[v.type]}
                      <span className="text-xs text-black">
                        {v.licensePlate || v.plate || "—"}
                      </span>
                    </div>
                  </Td>
                  {/* Nombre */}
                  <Td className="text-center font-medium text-black">
                    {v.visitorName || v.name || "—"}
                  </Td>
                  {/* Apto / Interior */}
                  <Td className="text-center text-black">
                    <div className="text-xs">{v.apartment || "—"}</div>
                    <div className="text-xs text-slate-500">
                      {v.interior || "—"}
                    </div>
                  </Td>
                  {/* Ingreso */}
                  <Td className="text-center text-black">
                    {v.entryTime ? (
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">
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
                        className="flex items-center justify-center gap-1 text-xs text-white bg-green-600 hover:bg-green-700 px-3 py-1 rounded-full shadow transition"
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
      <Paginator
        page={page}
        setPage={setPage}
        totalPages={totalPages}
        perPage={perPage}
        setPerPage={setPerPage}
        totalItems={sorted.length}
        color="green"
      />
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

export function ParkingLot() {
  const [parking, setParking] = useState(parkingDataPrueba);

  const handleParkingExit = (exitingSpot) => {
    setParking((prev) =>
      prev.map((v) =>
        v.id === exitingSpot.id
          ? {
              ...v,
              status: "libre",
              visitorName: "",
              apartment: "",
              interior: "",
              entryTime: null,
            }
          : v
      )
    );
  };

  return <ParkingTable parking={parking} onExit={handleParkingExit} />;
}
