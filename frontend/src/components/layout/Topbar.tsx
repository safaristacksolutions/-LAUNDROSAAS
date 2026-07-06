import { useAuth } from "../../hooks/useAuth";

export function Topbar() {
  const { user, logout } = useAuth();

  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 z-20">
      <div className="flex items-center gap-3">
        <img src="https://img.icons8.com/fluency/48/laundry.png" alt="" className="w-7 h-7" />
        <div>
          <p className="font-medium text-sm">{(user?.first_name && user?.last_name) ? `${user.first_name} ${user.last_name}` : user?.username || "User"}</p>
          <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
        </div>
      </div>
      <button onClick={logout} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 px-3 py-2 rounded-xl hover:bg-gray-50 transition-all">
        <img src="https://img.icons8.com/fluency/48/exit.png" alt="" className="w-5 h-5" />
        Logout
      </button>
    </header>
  );
}
