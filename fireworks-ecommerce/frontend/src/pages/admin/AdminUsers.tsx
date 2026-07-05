import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/useAppDispatch";
import { fetchAdminUsers } from "../../store/slices/adminSlice";
import { adminService } from "../../services/adminService";
import UserTable from "../../components/admin/UserTable";
import Pagination from "../../components/common/Pagination";
import Loader from "../../components/common/Loader";
import toast from "react-hot-toast";

export default function AdminUsers() {
  const dispatch = useAppDispatch();
  const { users, pagination, loading } = useAppSelector((s) => s.admin);
  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(fetchAdminUsers({ page, limit: 10 }));
  }, [dispatch, page]);

  const handleRoleChange = async (userId: string, role: string) => {
    try {
      await adminService.changeUserRole(userId, role);
      toast.success("Role updated");
      dispatch(fetchAdminUsers({ page, limit: 10 }));
    } catch { toast.error("Failed"); }
  };

  const handleDelete = async (userId: string) => {
    if (!confirm("Delete this user?")) return;
    try {
      await adminService.deleteUser(userId);
      toast.success("User deleted");
      dispatch(fetchAdminUsers({ page, limit: 10 }));
    } catch { toast.error("Failed"); }
  };

  if (loading) return <Loader />;

  const totalPages = pagination?.totalPages || 1;
  const totalUsers = pagination?.totalUsers || 0;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl font-bold text-dark dark:text-gray-100">Users</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Total users: {totalUsers}</p>
        </div>
      </div>
      <div className="card overflow-hidden">
        <UserTable users={users} onRoleChange={handleRoleChange} onDelete={handleDelete} />
      </div>
      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
