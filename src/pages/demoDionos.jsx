import Dashboard from "../components/Dashboard";
import PanelGuardia from "../components/PanelGuardia";
import ParkingTable from "../components/ParkingTable";
import VisitorTable from "../components/VisitorTable";
import VisitorModal from "../components/VisitorModal";
import SearchBar from "../components/SearchBar";
import { FaParking, FaUserFriends, FaPlusCircle } from "react-icons/fa";
import React, { useState } from "react";

export default function DemoPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [visitors, setVisitors] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      ...visitor,
      apartment: selectedResident.apartment,
      interior: selectedResident.interior,
      resident: selectedResident,
      date: new Date().toISOString(),
      status: "ingresado",
    };
    onAddVisitor(data);
    onClose();
  };

  return (
    <div className="p-6 space-y-6 max-w-screen-xl mx-auto">
      {/* Encabezado y acciones */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800">
            Panel de Guardia
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Control rápido de visitantes y parqueaderos
          </p>
        </div>
        <div className="flex flex-col md:flex-row items-stretch gap-2 w-full md:w-auto">
          <SearchBar onSearch={(q) => alert("Buscar: " + q)} />
        </div>
      </div>

      {/* Panel de registro rápido */}
      <div className="rounded-2xl bg-white/90 shadow-lg p-4">
        <PanelGuardia
          onNuevoRegistro={() => setModalOpen(true)}
          onSalida={() => alert("Salida registrada")}
        />
      </div>

      {/* Tabla Visitantes */}
      <div className="rounded-2xl bg-white/90 shadow-md p-4">
        <h2 className="text-md font-semibold mb-2 flex items-center gap-2 text-slate-700">
          <FaUserFriends className="text-blue-400" /> Visitantes
        </h2>
        <VisitorTable visitors={visitors} setVisitors={setVisitors} />
      </div>

      {/* Tabla Parqueadero */}
      <div className="rounded-2xl bg-white/90 shadow-md p-4">
        <h2 className="text-md font-semibold mb-2 flex items-center gap-2 text-slate-700">
          <FaParking className="text-green-400" /> Parqueadero
        </h2>
        <ParkingTable />
      </div>



      {/* Modal de visitante */}
      <VisitorModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onAddVisitor={(data) => setVisitors((prev) => [...prev, data])}
      />
    </div>
  );
}
