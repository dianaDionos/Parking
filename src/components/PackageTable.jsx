import React from "react";
import { motion } from "framer-motion";
import { FaBoxOpen, FaCheckCircle } from "react-icons/fa";

export default function PackageTable({ paqueteria = [], onEntregar }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="rounded-2xl border border-yellow-200 shadow-lg bg-white p-4 md:p-6 max-w-5xl mx-auto"
    >
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-slate-700">
          <thead>
            <tr>
              <Th className="bg-yellow-50 text-yellow-700 text-center rounded-tl-2xl">
                #
              </Th>
              <Th className="bg-yellow-50 text-yellow-700 text-center border-r border-slate-100">
                Residente
              </Th>
              <Th className="bg-yellow-50 text-yellow-700 text-center border-r border-slate-100">
                Apto / Interior
              </Th>
              <Th className="bg-yellow-50 text-yellow-700 text-center border-r border-slate-100">
                Cantidad
              </Th>
              <Th className="bg-yellow-50 text-yellow-700 text-center border-r border-slate-100">
                Detalle
              </Th>
              <Th className="bg-yellow-50 text-yellow-700 text-center rounded-tr-2xl">
                Acción
              </Th>
            </tr>
          </thead>
          <tbody>
            {paqueteria.length === 0 ? (
              <tr>
                <Td colSpan={6} className="text-center py-8 text-slate-400">
                  No hay paquetes pendientes de entrega.
                </Td>
              </tr>
            ) : (
              paqueteria.map((registro, idx) => (
                <motion.tr
                  key={idx}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.04 }}
                  className="hover:bg-yellow-50 transition"
                >
                  <Td className="text-center font-bold text-yellow-700">
                    {idx + 1}
                  </Td>
                  <Td className="text-center font-medium">{registro.nombre}</Td>
                  <Td className="text-center">
                    <div className="text-xs">{registro.apto}</div>
                    <div className="text-xs text-slate-500">
                      {registro.interior}
                    </div>
                  </Td>
                  <Td className="text-center">
                    <span className="inline-flex items-center gap-1 bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs font-semibold">
                      <FaBoxOpen /> {registro.paquetes.length}
                    </span>
                  </Td>
                  <Td className="text-center">
                    <ul className="list-disc list-inside text-xs text-slate-700">
                      {registro.paquetes.map((p, i) => (
                        <li key={i}>
                          <span className="font-semibold">{p.descripcion}</span>
                          {p.remitente && (
                            <span className="text-slate-500">
                              {" "}
                              ({p.remitente})
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </Td>
                  <Td className="text-center">
                    {registro.entregado ? (
                      <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-semibold">
                        <FaCheckCircle /> Entregado
                      </span>
                    ) : (
                      <button
                        onClick={() => onEntregar && onEntregar(registro)}
                        className="flex items-center justify-center gap-1 text-xs text-white bg-yellow-500 hover:bg-yellow-600 px-3 py-1 rounded-full shadow transition"
                      >
                        <FaCheckCircle />
                        Entregar
                      </button>
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
