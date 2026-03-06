"use client";

import { useState } from "react";

type Appointment = {
  id: string;
  scheduledAt: Date | string;
  user: { name: string | null; email: string };
  status: string;
  doctor: string | null;
};

export function AppointmentCalendar({ appointments }: { appointments: Appointment[] }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedAppointments, setSelectedAppointments] = useState<Appointment[]>([]);

  // Get first day of month and total days
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();

  // Month names
  const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

  // Group appointments by date
  const appointmentsByDate: Record<string, Appointment[]> = {};
  appointments.forEach((apt) => {
    const date = new Date(apt.scheduledAt);
    const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    if (!appointmentsByDate[dateKey]) {
      appointmentsByDate[dateKey] = [];
    }
    appointmentsByDate[dateKey].push(apt);
  });

  // Navigation functions
  const previousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const today = () => {
    setCurrentDate(new Date());
  };

  // Generate calendar days
  const calendarDays = [];

  // Empty cells for days before month starts
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(<div key={`empty-${i}`} className="h-24 border border-gray-200 bg-gray-50"></div>);
  }

  // Days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const dateKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const dayAppointments = appointmentsByDate[dateKey] || [];
    const isToday = new Date().toDateString() === new Date(year, month, day).toDateString();

    calendarDays.push(
      <div
        key={day}
        className="relative min-h-[120px] border border-gray-200 p-2 hover:bg-gray-50 cursor-pointer transition bg-white"
        onClick={() => {
          if (dayAppointments.length > 0) {
            setSelectedDate(dateKey);
            setSelectedAppointments(dayAppointments);
          }
        }}
      >
        <div className="flex items-center justify-center mb-2">
          <div
            className={`text-sm font-semibold flex items-center justify-center ${isToday ? "bg-teal-500 text-white w-7 h-7 rounded-full" : dayAppointments.length > 0 ? "bg-gray-100 text-gray-900 w-7 h-7 rounded-full" : "text-gray-700"}`}
          >
            {day}
          </div>
        </div>

        {/* Display appointments in the cell */}
        {dayAppointments.length > 0 && (
          <div className="space-y-1.5">
            {dayAppointments.slice(0, 3).map((apt) => (
              <div
                key={apt.id}
                className={`text-xs px-2 py-1.5 rounded-md border ${
                  apt.status === "PENDING" ? "bg-yellow-50 border-yellow-200 text-yellow-900" : apt.status === "CONFIRMED" ? "bg-green-50 border-green-200 text-green-900" : "bg-red-50 border-red-200 text-red-900"
                }`}
              >
                <div className="font-medium truncate">{apt.user.name || "Pasien"}</div>
                <div className="text-[10px] opacity-75">
                  {new Date(apt.scheduledAt).toLocaleTimeString("id-ID", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            ))}
            {dayAppointments.length > 3 && <div className="text-xs text-gray-500 text-center font-medium">+{dayAppointments.length - 3} lagi</div>}
          </div>
        )}
      </div>,
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">
          {monthNames[month]} {year}
        </h2>
        <div className="flex gap-2">
          <button onClick={today} className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">
            Hari Ini
          </button>
          <button onClick={previousMonth} className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">
            ←
          </button>
          <button onClick={nextMonth} className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">
            →
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-0">
        {/* Day headers */}
        {["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"].map((day) => (
          <div key={day} className="text-center text-sm font-semibold text-gray-700 py-2 bg-gray-50 border border-gray-200">
            {day}
          </div>
        ))}

        {/* Calendar days */}
        {calendarDays}
      </div>

      {/* Legend */}
      <div className="mt-6 flex gap-4 text-xs text-gray-600">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-yellow-100 border border-yellow-200"></div>
          <span>Pending</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-green-100 border border-green-200"></div>
          <span>Confirmed</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-red-100 border border-red-200"></div>
          <span>Cancelled</span>
        </div>
      </div>

      {/* Modal Popup for Selected Date */}
      {selectedDate && selectedAppointments.length > 0 && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => {
            setSelectedDate(null);
            setSelectedAppointments([]);
          }}
        >
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold">Detail Booking</h3>
                  <p className="text-blue-100 mt-1">
                    {new Date(selectedDate).toLocaleDateString("id-ID", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSelectedDate(null);
                    setSelectedAppointments([]);
                  }}
                  className="text-white hover:bg-white/20 rounded-full p-2 transition"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="mt-4 text-sm text-blue-100">Total: {selectedAppointments.length} Pasien</div>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(80vh-200px)]">
              <div className="space-y-4">
                {selectedAppointments.map((apt, index) => {
                  const statusConfig = {
                    PENDING: {
                      bg: "bg-yellow-50",
                      border: "border-yellow-200",
                      text: "text-yellow-800",
                      badge: "bg-yellow-100 text-yellow-800",
                      label: "Menunggu Konfirmasi",
                    },
                    CONFIRMED: {
                      bg: "bg-green-50",
                      border: "border-green-200",
                      text: "text-green-800",
                      badge: "bg-green-100 text-green-800",
                      label: "Dikonfirmasi",
                    },
                    CANCELLED: {
                      bg: "bg-red-50",
                      border: "border-red-200",
                      text: "text-red-800",
                      badge: "bg-red-100 text-red-800",
                      label: "Dibatalkan",
                    },
                  };

                  const config = statusConfig[apt.status as keyof typeof statusConfig] || statusConfig.PENDING;

                  return (
                    <div key={apt.id} className={`border-2 ${config.border} ${config.bg} rounded-lg p-4 transition hover:shadow-md`}>
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">{(apt.user.name || apt.user.email).charAt(0).toUpperCase()}</div>
                          <div>
                            <h4 className="font-bold text-gray-900 text-lg">{apt.user.name || "Pasien Anonim"}</h4>
                            <p className="text-sm text-gray-600">{apt.user.email}</p>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${config.badge}`}>{config.label}</span>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div className="flex items-center gap-2 text-sm">
                          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <div>
                            <div className="text-xs text-gray-500">Jam</div>
                            <div className="font-semibold text-gray-900">
                              {new Date(apt.scheduledAt).toLocaleTimeString("id-ID", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </div>
                          </div>
                        </div>

                        {apt.doctor && (
                          <div className="flex items-center gap-2 text-sm">
                            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <div>
                              <div className="text-xs text-gray-500">Dokter</div>
                              <div className="font-semibold text-gray-900 capitalize">{apt.doctor.replace("-", " ")}</div>
                            </div>
                          </div>
                        )}

                        <div className="flex items-center gap-2 text-sm">
                          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                          </svg>
                          <div>
                            <div className="text-xs text-gray-500">ID</div>
                            <div className="font-mono text-xs text-gray-900">{apt.id.substring(0, 8)}...</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
