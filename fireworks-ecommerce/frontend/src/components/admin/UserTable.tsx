import { formatDate } from "../../utils/formatDate";
import { Shield, ShieldOff, Trash2 } from "lucide-react";
import Badge from "../common/Badge";
import type { IUser } from "../../types";

interface Props {
  users: IUser[];
  onRoleChange?: (userId: string, role: string) => void;
  onDelete?: (userId: string) => void;
}

export default function UserTable({ users, onRoleChange, onDelete }: Props) {
  if (!users.length) {
    return <div className="py-12 text-center text-gray-400 dark:text-gray-500">No users found</div>;
  }

  return (
    <>
      {/* ── Desktop table ──────────────────────────────── */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 dark:border-gray-700">
              {["User", "Email", "Mobile", "Joined", "Role", "Actions"].map((h) => (
                <th key={h} className="py-3 px-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="border-b border-gray-50 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <img src={u.avatar?.url || "/default-avatar.svg"} alt={u.name} className="w-8 h-8 rounded-full" />
                    <span className="font-medium text-dark dark:text-gray-100">{u.name}</span>
                  </div>
                </td>
                <td className="py-3 px-4 text-gray-500 dark:text-gray-400">{u.email}</td>
                <td className="py-3 px-4 text-gray-500 dark:text-gray-400">{u.phone || "—"}</td>
                <td className="py-3 px-4 text-gray-500 dark:text-gray-400">{formatDate(u.createdAt || "")}</td>
                <td className="py-3 px-4">
                  <Badge label={u.role} color={u.role === "admin" ? "purple" : "gray"} />
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    {onRoleChange && (
                      <button
                        onClick={() => onRoleChange(u._id, u.role === "admin" ? "user" : "admin")}
                        className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-500 dark:text-gray-400"
                        title={u.role === "admin" ? "Remove admin" : "Make admin"}
                      >
                        {u.role === "admin" ? <ShieldOff size={14} /> : <Shield size={14} />}
                      </button>
                    )}
                    {onDelete && (
                      <button onClick={() => onDelete(u._id)} className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded text-red-400">
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Mobile cards ───────────────────────────────── */}
      <div className="md:hidden divide-y divide-gray-100 dark:divide-gray-700">
        {users.map((u) => (
          <div key={u._id} className="p-4 flex items-start gap-3">
            <img src={u.avatar?.url || "/default-avatar.svg"} alt={u.name} className="w-10 h-10 rounded-full shrink-0" />
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-medium text-dark dark:text-gray-100 truncate">{u.name}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 truncate">{u.email}</p>
                </div>
                <Badge label={u.role} color={u.role === "admin" ? "purple" : "gray"} />
              </div>
              <div className="flex items-center justify-between gap-2 mt-2">
                <div className="text-xs text-gray-400 dark:text-gray-500 space-y-0.5">
                  <p>{u.phone || "—"}</p>
                  <p>Joined {formatDate(u.createdAt || "")}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  {onRoleChange && (
                    <button
                      onClick={() => onRoleChange(u._id, u.role === "admin" ? "user" : "admin")}
                      className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-500 dark:text-gray-400"
                      title={u.role === "admin" ? "Remove admin" : "Make admin"}
                    >
                      {u.role === "admin" ? <ShieldOff size={14} /> : <Shield size={14} />}
                    </button>
                  )}
                  {onDelete && (
                    <button onClick={() => onDelete(u._id)} className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded text-red-400">
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

