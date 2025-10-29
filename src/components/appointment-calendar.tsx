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
  const [hoveredDate, setHoveredDate] = useState<string | null>(null);

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
      <div key={day} className="relative h-24 border border-gray-200 p-2 hover:bg-gray-50 cursor-pointer transition" onMouseEnter={() => setHoveredDate(dateKey)} onMouseLeave={() => setHoveredDate(null)}>
        <div className={`text-sm font-medium ${isToday ? "bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center" : "text-gray-700"}`}>{day}</div>

        {dayAppointments.length > 0 && (
          <div className="mt-1">
            <div className="flex gap-1 flex-wrap">
              {dayAppointments.slice(0, 3).map((apt) => (
                <div key={apt.id} className={`w-2 h-2 rounded-full ${apt.status === "PENDING" ? "bg-yellow-500" : apt.status === "CONFIRMED" ? "bg-green-500" : "bg-red-500"}`} title={apt.user.name || apt.user.email} />
              ))}
            </div>
            {dayAppointments.length > 3 && <div className="text-xs text-gray-500 mt-1">+{dayAppointments.length - 3} lainnya</div>}
          </div>
        )}

        {/* Hover popup */}
        {hoveredDate === dateKey && dayAppointments.length > 0 && (
          <div className="absolute z-10 left-0 top-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-3 w-64 max-h-64 overflow-y-auto">
            <p className="text-xs font-semibold text-gray-700 mb-2">{dayAppointments.length} Janji Temu</p>
            <div className="space-y-2">
              {dayAppointments.map((apt) => (
                <div key={apt.id} className="text-xs border-b border-gray-100 pb-2 last:border-0">
                  <p className="font-medium text-gray-900">{apt.user.name || apt.user.email}</p>
                  <p className="text-gray-500">
                    {new Date(apt.scheduledAt).toLocaleTimeString("id-ID", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                  <span className={`inline-block px-2 py-0.5 rounded text-xs ${apt.status === "PENDING" ? "bg-yellow-100 text-yellow-800" : apt.status === "CONFIRMED" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                    {apt.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
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
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <span>Pending</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span>Confirmed</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <span>Cancelled</span>
        </div>
      </div>
    </div>
  );
}
