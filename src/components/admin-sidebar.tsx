"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminSidebar() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === "/admin") return pathname === "/admin";
    return pathname.startsWith(path);
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
        <p className="text-sm text-gray-500 mt-1">My Klinik</p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        <NavLink href="/admin" icon="📊" active={isActive("/admin")}>
          Dashboard
        </NavLink>
        <NavLink href="/admin/appointments" icon="🗓️" active={isActive("/admin/appointments")}>
          Janji Temu
        </NavLink>
        <NavLink href="/admin/chat" icon="💬" active={isActive("/admin/chat")}>
          Pesan Chat
        </NavLink>
        <NavLink href="/admin/patients" icon="👥" active={isActive("/admin/patients")}>
          Pasien
        </NavLink>
        <NavLink href="/admin/settings" icon="⚙️" active={isActive("/admin/settings")}>
          Pengaturan
        </NavLink>
      </nav>

      <div className="p-4 border-t border-gray-200">
        <button onClick={() => (window.location.href = "/api/auth/signout")} className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition">
          Logout
        </button>
      </div>
    </aside>
  );
}

function NavLink({ href, icon, children, active }: { href: string; icon: string; children: React.ReactNode; active: boolean }) {
  return (
    <Link href={href} className={`flex items-center gap-3 px-3 py-2 text-sm rounded-md transition ${active ? "bg-blue-50 text-blue-700 font-medium" : "text-gray-700 hover:bg-gray-100"}`}>
      <span className="text-lg">{icon}</span>
      <span>{children}</span>
    </Link>
  );
}
