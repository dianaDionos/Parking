import React from "react";
import { motion } from "framer-motion";
import { FaCarAlt, FaMotorcycle, FaUser, FaSignOutAlt } from "react-icons/fa";

const mockVisitors = [
  {
    name: "Pedro López",
    phone: "3123456789",
    id: "12345678",
    email: "pedro@email.com",
    hasVehicle: true,
    plate: "ABC-111",
    vehicleType: "Carro",
    resident: { name: "Laura Ramírez", apartment: "302B", interior: "Torre 2" },
    date: "2025-06-19 10:15",
    status: "ingresado",
  },
  {
    name: "María Ruiz",
    phone: "3119876543",
    id: "87654321",
    email: "maria@email.com",
    hasVehicle: false,
    plate: "",
    vehicleType: "",
    resident: { name: "Carlos Gómez", apartment: "104A", interior: "Torre 1" },
    date: "2025-06-19 11:05",
    status: "ingresado",
  },
];

const iconByType = {
  Carro: <FaCarAlt className="text-indigo-500 text-lg mx-auto" />,
  Moto: <FaMotorcycle className="text-indigo-500 text-lg mx-auto" />,
  null: <FaUser className="text-slate-400 text-lg mx-auto" />,
  "": <FaUser className="text-slate-400 text-lg mx-auto" />,
};

const VisitorTable = ({ visitors = [], setVisitors }) => {
  const handleSalida = (index) => {
    setVisitors((prev) =>
      prev.map((v, i) =>
        i === index
          ? {
              ...v,
              status: "salido",
              salida: new Date().toISOString(),
            }
          : v
      )
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="rounded-2xl border border-slate-200 shadow-lg bg-white p-4 md:p-6 max-w-5xl mx-auto"
    >
      <h2 className="text-center text-2xl font-bold text-indigo-700 mb-4">
        Visitantes
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-slate-700">
          <thead>
            <tr>
              <Th
                colSpan={2}
                className="bg-indigo-50 text-indigo-700 text-center border-r border-slate-100 rounded-tl-2xl"
              >
                Visitante
              </Th>
              <Th
                colSpan={2}
                className="bg-indigo-50 text-indigo-700 text-center border-r border-slate-100"
              >
                Residente Visitado
              </Th>
              <Th className="bg-indigo-50 text-indigo-700 text-center border-r border-slate-100">
                Vehículo
              </Th>
              <Th className="bg-indigo-50 text-indigo-700 text-center border-r border-slate-100">
                Ingreso
              </Th>
              <Th className="bg-indigo-50 text-indigo-700 text-center border-r border-slate-100">
                Salida
              </Th>
              <Th className="bg-indigo-50 text-indigo-700 text-center rounded-tr-2xl">
                Acción
              </Th>
            </tr>
            <tr>
              <Th className="text-center bg-slate-50">Nombre</Th>
              <Th className="text-center bg-slate-50">Contacto</Th>
              <Th className="text-center bg-slate-50">Nombre</Th>
              <Th className="text-center bg-slate-50">Apto / Interior</Th>
              <Th className="text-center bg-slate-50">Tipo / Placa</Th>
              <Th className="text-center bg-slate-50">Fecha y hora</Th>
              <Th className="text-center bg-slate-50">Fecha y hora</Th>
              <Th className="text-center bg-slate-50">—</Th>
            </tr>
          </thead>
          <tbody>
            {visitors.length === 0 ? (
              <tr>
                <Td colSpan={8} className="text-center text-gray-400 py-6">
                  No hay visitantes registrados.
                </Td>
              </tr>
            ) : (
              visitors.map((visitor, index) => (
                <motion.tr
                  key={index}
                  className="hover:bg-indigo-50 transition-colors"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                >
                  {/* Visitante */}
                  <Td className="text-center font-semibold">{visitor.name}</Td>
                  <Td className="text-center">
                    <div className="text-xs text-slate-700">
                      {visitor.phone}
                    </div>
                    <div className="text-xs text-slate-500">
                      {visitor.email}
                    </div>
                    <div className="text-xs text-slate-400">
                      CC: {visitor.id}
                    </div>
                  </Td>
                  {/* Residente */}
                  <Td className="text-center font-medium">
                    {visitor.resident?.name || "—"}
                  </Td>
                  <Td className="text-center">
                    <div className="text-xs">
                      {visitor.resident?.apartment || "—"}
                    </div>
                    <div className="text-xs text-slate-500">
                      {visitor.resident?.interior || "—"}
                    </div>
                  </Td>
                  {/* Vehículo */}
                  <Td className="text-center">
                    {visitor.hasVehicle ? (
                      <div className="flex flex-col items-center">
                        {iconByType[visitor.vehicleType]}
                        <span className="text-xs">{visitor.plate}</span>
                      </div>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </Td>
                  {/* Ingreso */}
                  <Td className="text-center">
                    {visitor.date ? (
                      <span className="inline-block bg-slate-100 text-slate-700 px-2 py-1 rounded leading-tight">
                        {new Date(
                          visitor.date.replace(" ", "T")
                        ).toLocaleDateString("es-CO")}
                        <br />
                        <span className="text-xs text-slate-500">
                          {new Date(
                            visitor.date.replace(" ", "T")
                          ).toLocaleTimeString("es-CO", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </span>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </Td>
                  {/* Salida */}
                  <Td className="text-center">
                    {visitor.status === "salido" && visitor.salida ? (
                      <span className="inline-block bg-green-100 text-green-700 px-2 py-1 rounded leading-tight">
                        {new Date(visitor.salida).toLocaleDateString("es-CO")}
                        <br />
                        <span className="text-xs text-slate-500">
                          {new Date(visitor.salida).toLocaleTimeString(
                            "es-CO",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </span>
                      </span>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </Td>
                  {/* Acción */}
                  <Td className="text-center">
                    {visitor.status === "ingresado" ? (
                      <button
                        onClick={() => handleSalida(index)}
                        className="flex items-center justify-center gap-1 text-xs text-white bg-indigo-600 hover:bg-indigo-700 px-3 py-1 rounded-full shadow transition"
                      >
                        <FaSignOutAlt />
                        Salida
                      </button>
                    ) : (
                      <span className="text-green-400 font-bold">✓</span>
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
};

const Th = ({ children, className = "", ...props }) => (
  <th className={`px-4 py-2 whitespace-nowrap ${className}`} {...props}>
    {children}
  </th>
);

const Td = ({ children, className = "", ...props }) => (
  <td
    className={`px-4 py-2 border-t border-slate-100 whitespace-nowrap align-middle ${className}`}
    {...props}
  >
    {children}
  </td>
);

export default VisitorTable;
