import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaBoxOpen, FaCheckCircle, FaSearch } from "react-icons/fa";
import Paginator from "./Paginator";

export default function PackageTable({ paqueteria = [], onEntregar }) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(5);

  const filtered = paqueteria.filter((r) => {
    const s = search.toLowerCase();
    return (
      r.nombre?.toLowerCase().includes(s) ||
      r.apto?.toLowerCase().includes(s) ||
      r.interior?.toLowerCase().includes(s) ||
      r.paquetes?.some((p) => p.descripcion?.toLowerCase().includes(s))
    );
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [perPage, filtered.length, totalPages]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="rounded-2xl border border-yellow-200 shadow-lg bg-white p-4 md:p-6 max-w-5xl mx-auto"
    >
      <div className="mb-4 flex flex-col md:flex-row gap-2 items-center justify-between">
        <div className="relative w-full md:w-72">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-yellow-400" />
          <input
            type="text"
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-yellow-200 bg-yellow-50 text-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-100 transition"
            placeholder="Buscar residente, apto, detalle..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <span className="text-xs text-yellow-500">
          {filtered.length} paquetes
        </span>
      </div>
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
            {paginated.length === 0 ? (
              <tr>
                <Td colSpan={6} className="text-center py-8 text-slate-400">
                  No hay paquetes pendientes de entrega.
                </Td>
              </tr>
            ) : (
              paginated.map((registro, idx) => (
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
      <Paginator
        page={page}
        setPage={setPage}
        totalPages={totalPages}
        perPage={perPage}
        setPerPage={setPerPage}
        totalItems={paqueteria.length}
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
