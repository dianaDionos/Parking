import React from "react";
import { motion } from "framer-motion";

const mockResidents = [
  {
    name: "Laura Ramírez",
    apartment: "302B",
    interior: "Torre 2",
    phone: "3157894321",
    parking: true,
    isOwner: true,
    vehicleType: "Carro",
    licensePlate: "ABC-123",
  },
  {
    name: "Carlos Gómez",
    apartment: "104A",
    interior: "Torre 1",
    phone: "3001234567",
    parking: false,
    isOwner: false,
    vehicleType: null,
    licensePlate: null,
  },
  {
    name: "Sandra Martínez",
    apartment: "405C",
    interior: "Torre 3",
    phone: "3126547890",
    parking: true,
    isOwner: true,
    vehicleType: "Moto",
    licensePlate: "XYZ-987",
  },
];

const ResidentTable = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="overflow-x-auto rounded-xl border border-slate-200 shadow-md bg-white"
    >
      <table className="min-w-full text-sm text-slate-700">
        <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
          <tr>
            <Th>Nombre</Th>
            <Th>Apartamento</Th>
            <Th>Interior</Th>
            <Th>Teléfono</Th>
            <Th>Parqueadero</Th>
            <Th>Propietario/Arrendatario</Th>
            <Th>Vehículo</Th>
            <Th>Placa</Th>
          </tr>
        </thead>
        <tbody>
          {mockResidents.map((resident, index) => (
            <motion.tr
              key={index}
              className="hover:bg-indigo-50 transition-colors"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              <Td>{resident.name}</Td>
              <Td>{resident.apartment}</Td>
              <Td>{resident.interior}</Td>
              <Td>{resident.phone}</Td>
              <Td>{resident.parking ? "Sí" : "No"}</Td>
              <Td>{resident.isOwner ? "Propietario" : "Arrendatario"}</Td>
              <Td>{resident.vehicleType || "N/A"}</Td>
              <Td>{resident.licensePlate || "N/A"}</Td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
};

const Th = ({ children }) => (
  <th className="px-4 py-3 text-left whitespace-nowrap">{children}</th>
);

const Td = ({ children }) => (
  <td className="px-4 py-3 border-t border-slate-100 whitespace-nowrap">{children}</td>
);

export default ResidentTable;
