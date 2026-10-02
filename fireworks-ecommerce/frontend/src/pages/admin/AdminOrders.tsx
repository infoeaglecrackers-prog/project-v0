import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/useAppDispatch";
import { fetchAdminOrders } from "../../store/slices/adminSlice";
import { adminService } from "../../services/adminService";
import OrderTable from "../../components/admin/OrderTable";
import Loader from "../../components/common/Loader";
import { Plus } from "lucide-react";
import toast from "react-hot-toast";

// Large enough to return every order in one page — admin wants a single unpaginated list.
const ALL_ORDERS_LIMIT = 100000;

export default function AdminOrders() {
  const dispatch = useAppDispatch();
  const { orders, loading } = useAppSelector((s) => s.admin);

  useEffect(() => {
    void dispatch(fetchAdminOrders({ limit: ALL_ORDERS_LIMIT }));
  }, [dispatch]);

  const handleStatusChange = async (orderId: string, status: string) => {
    try {
      await adminService.updateOrderStatus(orderId, { status });
      toast.success("Status updated");
      void dispatch(fetchAdminOrders({ limit: ALL_ORDERS_LIMIT }));
    } catch { toast.error("Failed"); }
  };

  const handlePaymentStatusChange = async (orderId: string, status: string) => {
    try {
      await adminService.updatePaymentStatus(orderId, { status });
      toast.success("Payment status updated");
      void dispatch(fetchAdminOrders({ limit: ALL_ORDERS_LIMIT }));
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
    </div>
  );
}
