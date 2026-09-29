import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/useAppDispatch";
import { fetchAdminOrders } from "../../store/slices/adminSlice";
import { adminService } from "../../services/adminService";
import OrderTable from "../../components/admin/OrderTable";
import Pagination from "../../components/common/Pagination";
import Loader from "../../components/common/Loader";
import { Plus } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminOrders() {
  const dispatch = useAppDispatch();
  const { orders, loading } = useAppSelector((s) => s.admin);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    dispatch(fetchAdminOrders({ page, limit: 10 })).then((r) => {
      if (fetchAdminOrders.fulfilled.match(r)) {
        setTotalPages(r.payload?.totalPages || 1);
      }
    });
  }, [dispatch, page]);

  const handleStatusChange = async (orderId: string, status: string) => {
    try {
      await adminService.updateOrderStatus(orderId, { status });
      toast.success("Status updated");
      dispatch(fetchAdminOrders({ page, limit: 10 }));
    } catch { toast.error("Failed"); }
  };

  const handlePaymentStatusChange = async (orderId: string, status: string) => {
    try {
      await adminService.updatePaymentStatus(orderId, { status });
      toast.success("Payment status updated");
      dispatch(fetchAdminOrders({ page, limit: 10 }));
    } catch { toast.error("Failed"); }
  };

  if (loading) return <Loader />;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between gap-3 mb-6">
        <h1 className="text-xl font-bold text-dark dark:text-gray-100">Orders</h1>
        <Link to="/admin/orders/create" className="btn-primary flex items-center gap-2 text-sm">
          <Plus size={16} /> New Order
        </Link>
      </div>
      <div className="card overflow-hidden">
        <OrderTable orders={orders} onStatusChange={handleStatusChange} onPaymentStatusChange={handlePaymentStatusChange} />
      </div>
      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
