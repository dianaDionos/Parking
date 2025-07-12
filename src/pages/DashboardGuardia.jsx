import PanelGuardia from "../components/PanelGuardia";
import ParkingTable from "../components/ParkingTable";
import VisitorTable from "../components/VisitorTable";
import VisitorModal from "../components/VisitorModal";
import PaqueteriaTable from "../components/PackageTable";
import SearchBar from "../components/SearchBar";
import {
  FaParking,
  FaUserFriends,
  FaPlusCircle,
  FaBoxOpen,
} from "react-icons/fa";
import React, { useState } from "react";
import parkingService from "../services/parkingService";
import FacturaVisual from "../components/FacturaVisual";
import ReciboSalida from "../components/ReciboSalida";
import TicketVisual from "../components/TicketVisual";
import PaqueteriaModal from "../components/PaqueteriaModal";
import ExitModal from "../components/ExitModal";

// DATOS DE PRUEBA PARA VISITANTES
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
    date: "2025-07-11 10:15",
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
    date: "2025-07-11 11:05",
    status: "ingresado",
  },
];

// DATOS DE PRUEBA PARA PARQUEADERO
const parkingDataPrueba = [
  {
    id: 1,
    status: "ocupado",
    type: "car",
    licensePlate: "ABC-111",
    visitorName: "Pedro López",
    apartment: "302B",
    interior: "Torre 2",
    entryTime: new Date("2025-07-11T10:15:00"),
    spot: 1,
  },
  {
    id: 2,
    status: "ocupado",
    type: "moto",
    licensePlate: "XYZ-222",
    visitorName: "Laura Ramírez",
    apartment: "104A",
    interior: "Torre 1",
    entryTime: new Date("2025-07-11T09:15:00"),
    spot: 2,
  },
];

export default function DemoPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [visitors, setVisitors] = useState(mockVisitors);
  const [parking, setParking] = useState(parkingDataPrueba);
  const [printData, setPrintData] = useState(null);
  const [paqueteriaModalOpen, setPaqueteriaModalOpen] = useState(false);
  const [paqueteria, setPaqueteria] = useState([
    {
      nombre: "Laura Ramírez",
      apto: "302B",
      interior: "Torre 2",
      paquetes: [
        {
          remitente: "Amazon",
          descripcion: "Caja mediana",
          fecha: "2025-07-11T10:00:00",
        },
        {
          remitente: "Servientrega",
          descripcion: "Sobre documento",
          fecha: "2025-07-11T10:05:00",
        },
      ],
      entregado: false,
    },
    {
      nombre: "Carlos Gómez",
      apto: "104A",
      interior: "Torre 1",
      paquetes: [
        {
          remitente: "Falabella",
          descripcion: "Bolsa pequeña",
          fecha: "2025-07-11T09:30:00",
        },
      ],
      entregado: false,
    },
  ]);
  const [exitModalOpen, setExitModalOpen] = useState(false);
  const [exitData, setExitData] = useState(null);

  // Cargar parqueadero real
  const loadParking = () => {
    setParking(parkingService.getVehicles());
  };

  // Agregar visitante (usa ParkingService si tiene vehículo)
  const handleAddVisitor = async (visitorData) => {
    setVisitors((prev) => [...prev, visitorData]);
    if (visitorData.hasVehicle) {
      // Genera ticket y agrega a parking
      const ticket = await parkingService.generateTicket(visitorData, {
        plate: visitorData.plate,
        vehicleType: visitorData.vehicleType === "Carro" ? "car" : "moto",
      });
      setParking((prev) => [...prev, ticket]);
      setPrintData({ type: "ticket", data: ticket });
    }
    setModalOpen(false);
  };

  // Registrar salida desde Visitantes
  const handleVisitorExit = (visitor, idx) => {
    setExitData({ ...visitor, idx, source: "visitor" });
    setExitModalOpen(true);
  };

  const handleParkingExit = (vehicle) => {
    setExitData({ ...vehicle, source: "parking" });
    setExitModalOpen(true);
  };

  const handleExitConfirm = (registro, facturaData = null) => {
    if (registro.source === "visitor") {
      // Actualiza visitante
      setVisitors((prev) =>
        prev.map((v, i) =>
          i === registro.idx
            ? { ...v, status: "salido", salida: new Date().toISOString() }
            : v
        )
      );
      // Si tiene vehículo, elimina de parqueadero
      if (registro.hasVehicle && registro.plate) {
        setParking((prev) =>
          prev.filter((p) => p.licensePlate !== registro.plate)
        );
      }
      // Si hay factura, muestra el resumen
      if (facturaData) setPrintData({ type: "factura", data: facturaData });
      else setPrintData({ type: "salida", data: registro });
    } else if (registro.source === "parking") {
      // Elimina de parqueadero
      setParking((prev) => prev.filter((p) => p.id !== registro.id));
      // Busca y actualiza visitante relacionado
      setVisitors((prev) =>
        prev.map((v) =>
          v.plate === registro.licensePlate
            ? { ...v, status: "salido", salida: new Date().toISOString() }
            : v
        )
      );
      // Si hay factura, muestra el resumen
      if (facturaData) setPrintData({ type: "factura", data: facturaData });
      else setPrintData({ type: "salida", data: registro });
    }
    setExitModalOpen(false);
  };

  // Reimprimir ticket/factura
  const handleReprint = (visitor) => {
    if (!visitor.hasVehicle) {
      setPrintData({ type: "salida", data: visitor });
    } else if (visitor.status === "salido") {
      // Buscar última factura
      const ticket = parkingService
        .getTickets()
        .find((t) => t.licensePlate === visitor.plate);
      if (ticket && ticket.billing) {
        setPrintData({ type: "factura", data: ticket.billing });
      }
    } else {
      setPrintData({ type: "ticket", data: visitor });
    }
  };

  // Registrar llegada de paquetería
  const handleRegisterPaqueteria = (data) => {
    setPaqueteria((prev) => [...prev, { ...data, entregado: false }]);
    setPaqueteriaModalOpen(false);
  };

  const handleEntregar = (registro) => {
    setPaqueteria((prev) =>
      prev.map((p) => (p === registro ? { ...p, entregado: true } : p))
    );
  };

  // Cargar parqueadero al inicio y cuando cambie
  React.useEffect(() => {
    loadParking();
  }, []);

  return (
    <div className="p-6 space-y-6 max-w-screen-xl mx-auto">
      {/* Encabezado y acciones */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800">
            Panel de Ingresos
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Control rápido de visitantes, paqueteria y parqueaderos
          </p>
        </div>
        <div className="flex flex-col md:flex-row items-stretch gap-2 w-full md:w-auto">
          <SearchBar
            onSearch={(q) => alert("Buscar: " + q)}
            onAddVisitor={handleAddVisitor}
          />
        </div>
      </div>

      {/* Panel de registro rápido */}
      <div className="rounded-2xl bg-white shadow p-4 border border-slate-100">
        <PanelGuardia
          onNuevoRegistro={() => setModalOpen(true)}
          onNotificarPaqueteria={() => setPaqueteriaModalOpen(true)}
        />
      </div>

      {/* Tabla Visitantes */}
      <div className="rounded-2xl bg-white shadow border border-blue-100 p-0 overflow-hidden">
        <div className="flex items-center justify-between px-4 pt-4 pb-2">
          <h2 className="text-md font-semibold flex items-center gap-2 text-blue-700">
            <FaUserFriends className="text-blue-400" /> Visitantes
          </h2>
          <span className="hidden md:inline-block bg-blue-50 text-blue-700 text-xs font-medium px-3 py-1 rounded-full border border-blue-100">
            Tarifa parqueadero: $5.000 | Multa: $1.000
          </span>
        </div>
        <div className="p-4 pt-0">
          <VisitorTable
            visitors={visitors}
            setVisitors={setVisitors}
            onExit={handleVisitorExit}
            onReprint={handleReprint}
          />
        </div>
      </div>

      {/* Tabla Parqueadero */}
      <div className="rounded-2xl bg-white shadow border border-green-100 p-0 overflow-hidden">
        <div className="flex items-center justify-between px-4 pt-4 pb-2">
          <h2 className="text-md font-semibold flex items-center gap-2 text-green-700">
            <FaParking className="text-green-400" /> Parqueadero
          </h2>
          <span className="hidden md:inline-block bg-green-50 text-green-700 text-xs font-medium px-3 py-1 rounded-full border border-green-100">
            Tarifa parqueadero: $5.000 | Multa: $1.000
          </span>
        </div>
        <div className="p-4 pt-0">
          <ParkingTable parking={parking} onExit={handleParkingExit} />
        </div>
      </div>

      {/* Tabla Paquetería */}
      <div className="rounded-2xl bg-white shadow border border-yellow-100 p-0 overflow-hidden">
        <div className="flex items-center justify-between px-4 pt-4 pb-2">
          <h2 className="text-md font-semibold flex items-center gap-2 text-yellow-700">
            <FaBoxOpen className="text-yellow-400" /> Paquetería pendiente
          </h2>
        </div>
        <div className="p-4 pt-0">
          <PaqueteriaTable
            paqueteria={paqueteria}
            onEntregar={handleEntregar}
          />
        </div>
      </div>

      {/* Modal de visitante */}
      <VisitorModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onAddVisitor={handleAddVisitor}
      />
      {/* Modal de impresión (ticket/factura/salida) */}
      {printData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-2xl shadow-lg p-6 max-w-md w-full relative">
            <button
              className="absolute top-2 right-2 text-slate-400 hover:text-slate-700"
              onClick={() => setPrintData(null)}
            >
              ×
            </button>
            {printData.type === "ticket" && (
              <div>
                <h3 className="text-lg font-bold mb-2 text-indigo-700">
                  Ticket de Entrada
                </h3>
                <TicketVisual ticket={printData.data} />
              </div>
            )}
            {printData.type === "factura" && (
              <div>
                <h3 className="text-lg font-bold mb-2 text-green-700">
                  Factura/Recibo de Salida
                </h3>
                <FacturaVisual billing={printData.data} />
              </div>
            )}
            {printData.type === "salida" && (
              <div>
                <h3 className="text-lg font-bold mb-2 text-slate-700">
                  Salida registrada
                </h3>
                <ReciboSalida visitor={printData.data} />
              </div>
            )}
            <button
              className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg transition"
              onClick={() => window.print()}
            >
              Reimprimir
            </button>
          </div>
        </div>
      )}
      {/* Modal de confirmación de salida */}
      {exitModalOpen && exitData && (
        <ExitModal
          isOpen={exitModalOpen}
          onClose={() => setExitModalOpen(false)}
          parkingData={exitData}
          onExitConfirm={handleExitConfirm}
        />
      )}
      <PaqueteriaModal
        isOpen={paqueteriaModalOpen}
        onClose={() => setPaqueteriaModalOpen(false)}
        onRegister={handleRegisterPaqueteria}
      />
    </div>
  );
}
