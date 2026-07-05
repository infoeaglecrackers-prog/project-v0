import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/useAppDispatch";
import { fetchDashboard } from "../../store/slices/adminSlice";
import DashboardStats from "../../components/admin/DashboardStats";
import RevenueChart from "../../components/admin/RevenueChart";
import OrderTable from "../../components/admin/OrderTable";
import Loader from "../../components/common/Loader";

export default function AdminDashboard() {
  const dispatch = useAppDispatch();
  const { stats, recentOrders, topProducts, loading } = useAppSelector((s) => s.admin);

  useEffect(() => {
    dispatch(fetchDashboard());
  }, [dispatch]);

  if (loading || !stats) return <Loader />;

  const revenueData = recentOrders?.map((o: { createdAt: string; totalAmount: number }) => ({
    month: new Date(o.createdAt).toLocaleString("default", { month: "short" }),
    revenue: o.totalAmount,
  })) || [];

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-xl font-bold text-dark dark:text-gray-100">Dashboard</h1>
      <DashboardStats stats={stats} />
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <RevenueChart data={revenueData} />
        </div>
        <div className="card p-5">
          <h3 className="font-semibold text-dark dark:text-gray-100 mb-4">Top Products</h3>
          <div className="space-y-3">
            {topProducts?.map((p: { name: string; sold: number; _id: string }) => (
              <div key={p._id} className="flex justify-between items-center">
                <span className="text-sm dark:text-gray-300 truncate">{p.name}</span>
                <span className="text-sm font-medium text-primary">{p.sold} sold</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="card p-5">
        <h3 className="font-semibold text-dark dark:text-gray-100 mb-4">Recent Orders</h3>
        <OrderTable orders={recentOrders.slice(0, 5)} />
      </div>
    </div>
  );
}
