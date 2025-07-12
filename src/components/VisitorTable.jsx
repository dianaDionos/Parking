import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FaCarAlt,
  FaMotorcycle,
  FaUser,
  FaSignOutAlt,
  FaRegClock,
  FaPrint,
  FaCheckCircle,
  FaExclamationCircle,
} from "react-icons/fa";
import { apiService } from "../services";

const iconByType = {
  Carro: <FaCarAlt className="text-indigo-400 text-lg mx-auto" />,
  Moto: <FaMotorcycle className="text-indigo-400 text-lg mx-auto" />,
  null: <FaUser className="text-gray-300 text-lg mx-auto" />,
  "": <FaUser className="text-gray-300 text-lg mx-auto" />,
};

const VisitorTable = ({ visitors = [], setVisitors, onExit, onReprint }) => {
  const [backendVisitors, setBackendVisitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    apiService
      .getVisitors()
      .then((res) => {
        if (mounted) {
          if (res.success && Array.isArray(res.data)) {
            setBackendVisitors(res.data);
          } else {
            setBackendVisitors([]);
          }
          setLoading(false);
        }
      })
      .catch(() => {
        setBackendVisitors([]);
        setLoading(false);
        setError("No se pudo conectar con el backend");
      });
    return () => {
      mounted = false;
    };
  }, []);

  const allVisitors =
    backendVisitors.length > 0 ? backendVisitors : [...visitors];
  const filteredVisitors = allVisitors.filter((visitor) => {
    const searchLower = search.toLowerCase();
    return (
      visitor.name.toLowerCase().includes(searchLower) ||
      visitor.plate?.toLowerCase().includes(searchLower) ||
      visitor.resident?.apartment?.toLowerCase().includes(searchLower) ||
      visitor.resident?.interior?.toLowerCase().includes(searchLower)
    );
  });

  const getStayTime = (entry, exit) => {
    if (!entry || !exit) return "";
    const ms = new Date(exit) - new Date(entry.replace(" ", "T"));
    const min = Math.floor(ms / 60000);
    if (min < 60) return `${min} min`;
    return `${Math.floor(min / 60)}h ${min % 60}min`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="rounded-2xl border border-slate-100 shadow bg-white p-4 md:p-6 max-w-5xl mx-auto"
    >
      <div className="mb-4 flex flex-col md:flex-row gap-2 items-center justify-between">
        <input
          type="text"
          className="w-full md:w-72 px-4 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition"
          placeholder="Buscar visitante, placa, apto..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <span className="text-xs text-slate-400">
          {filteredVisitors.length} visitantes
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-slate-700 rounded-2xl overflow-hidden shadow">
          <thead className="sticky top-0 z-10 bg-white/90 backdrop-blur">
            <tr>
              <Th className="text-indigo-700 bg-indigo-50 text-left">
                Visitante
              </Th>
              <Th className="text-indigo-700 bg-indigo-50 text-left">
                Residente
              </Th>
              <Th className="text-indigo-700 bg-indigo-50 text-center">
                Vehículo
              </Th>
              <Th className="text-indigo-700 bg-indigo-50 text-center">
                Ingreso
              </Th>
              <Th className="text-indigo-700 bg-indigo-50 text-center">
                Salida
              </Th>
              <Th className="text-indigo-700 bg-indigo-50 text-center">
                Tiempo
              </Th>
              <Th className="text-indigo-700 bg-indigo-50 text-center">
                Acción
              </Th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <Td colSpan={7} className="text-center text-gray-400 py-6">
                  <FaRegClock className="inline-block mr-2" />
                  Cargando visitantes...
                </Td>
              </tr>
            ) : filteredVisitors.length === 0 ? (
              <tr>
                <Td colSpan={7} className="text-center text-gray-400 py-6">
                  No hay visitantes registrados.
                </Td>
              </tr>
            ) : (
              filteredVisitors.map((visitor, index) => (
                <motion.tr
                  key={index}
                  className={`transition-colors ${
                    index % 2 === 0 ? "bg-white" : "bg-slate-50"
                  } hover:bg-indigo-50`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                >
                  {/* Visitante */}
                  <Td>
                    <div className="font-semibold text-slate-800 flex items-center gap-2">
                      {visitor.status === "salido" ? (
                        <FaCheckCircle className="text-green-400" />
                      ) : (
                        <FaExclamationCircle className="text-orange-400" />
                      )}
                      {visitor.name}
                    </div>
                    <div className="text-xs text-slate-400">
                      {visitor.phone}
                    </div>
                  </Td>
                  {/* Residente */}
                  <Td>
                    <div className="font-medium text-slate-700">
                      {visitor.resident?.name || "—"}
                    </div>
                    <div className="text-xs text-slate-400">
                      {visitor.resident?.apartment || "—"} /{" "}
                      {visitor.resident?.interior || "—"}
                    </div>
                  </Td>
                  {/* Vehículo */}
                  <Td className="text-center">
                    {visitor.hasVehicle ? (
                      <div className="flex flex-col items-center">
                        {iconByType[visitor.vehicleType]}
                        <span className="text-xs text-slate-600">
                          {visitor.plate}
                        </span>
                      </div>
                    ) : (
                      <span className="text-slate-300">—</span>
                    )}
                  </Td>
                  {/* Ingreso */}
                  <Td className="text-center">
                    {visitor.date ? (
                      <span className="text-xs text-slate-600">
                        {new Date(
                          visitor.date.replace(" ", "T")
                        ).toLocaleDateString("es-CO")}{" "}
                        {new Date(
                          visitor.date.replace(" ", "T")
                        ).toLocaleTimeString("es-CO", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    ) : (
                      <span className="text-slate-300">—</span>
                    )}
                  </Td>
                  {/* Salida */}
                  <Td className="text-center">
                    {visitor.status === "salido" && visitor.salida ? (
                      <span className="text-xs text-green-600">
                        {new Date(visitor.salida).toLocaleDateString("es-CO")}{" "}
                        {new Date(visitor.salida).toLocaleTimeString("es-CO", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    ) : (
                      <span className="text-slate-300">—</span>
                    )}
                  </Td>
                  {/* Tiempo */}
                  <Td className="text-center">
                    {visitor.status === "salido" && visitor.salida
                      ? getStayTime(visitor.date, visitor.salida)
                      : visitor.date
                      ? getStayTime(visitor.date, new Date().toISOString())
                      : "—"}
                  </Td>
                  {/* Acción */}
                  <Td className="text-center flex gap-2 justify-center">
                    {visitor.status === "ingresado" ? (
                      <>
                        <button
                          onClick={() => onExit(visitor, index)}
                          className="flex items-center gap-1 text-xs text-white bg-indigo-600 hover:bg-indigo-700 px-3 py-1 rounded-full shadow transition font-semibold"
                          title="Registrar salida"
                        >
                          <FaSignOutAlt />
                          Salida
                        </button>
                        <button
                          onClick={() => onReprint(visitor)}
                          className="flex items-center gap-1 text-xs text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-1 rounded-full shadow transition font-semibold"
                          title="Reimprimir"
                        >
                          <FaPrint />
                          Reimprimir
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => onReprint(visitor)}
                        className="flex items-center gap-1 text-xs text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-1 rounded-full shadow transition font-semibold"
                        title="Reimprimir"
                      >
                        <FaPrint />
                        Reimprimir
                      </button>
                    )}
                  </Td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
        {error && (
          <div className="text-center text-red-400 text-xs mt-2">{error}</div>
        )}
      </div>
    </motion.div>
  );
};

const Th = ({ children, className = "", ...props }) => (
  <th className={`px-4 py-3 whitespace-nowrap ${className}`} {...props}>
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

export default VisitorTable;
