import { ShoppingBag, Users, Package, TrendingUp, Clock, Loader, Truck, CheckCircle, XCircle } from "lucide-react";
import type { IAdminStats } from "../../types";
import { formatCurrency } from "../../utils/formatCurrency";

interface Props {
  stats: IAdminStats;
}

export default function DashboardStats({ stats }: Props) {
  const cards = [
    { label: "Total Revenue", value: formatCurrency(stats.totalRevenue), icon: TrendingUp, color: "bg-green-100 text-green-600", trend: "+12%" },
    { label: "Total Orders", value: stats.totalOrders, icon: ShoppingBag, color: "bg-blue-100 text-blue-600", trend: "+8%" },
    { label: "Total Users", value: stats.totalUsers, icon: Users, color: "bg-purple-100 text-purple-600", trend: "+5%" },
    { label: "Total Products", value: stats.totalProducts, icon: Package, color: "bg-orange-100 text-orange-600", trend: "" },
  ];

  const orderStatuses = [
    { label: "Pending", value: stats.pendingOrders, icon: Clock, color: "bg-yellow-100 text-yellow-600" },
    { label: "Processing", value: stats.processingOrders, icon: Loader, color: "bg-blue-100 text-blue-600" },
    { label: "Shipped", value: stats.shippedOrders, icon: Truck, color: "bg-purple-100 text-purple-600" },
    { label: "Delivered", value: stats.deliveredOrders, icon: CheckCircle, color: "bg-green-100 text-green-600" },
    { label: "Cancelled", value: stats.cancelledOrders, icon: XCircle, color: "bg-red-100 text-red-600" },
  ];

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {cards.map((c) => (
          <div key={c.label} className="card p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-gray-500 dark:text-gray-400">{c.label}</p>
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${c.color}`}>
                <c.icon size={17} />
              </div>
            </div>
            <p className="text-2xl font-bold text-dark dark:text-gray-100">{c.value}</p>
            {c.trend && <p className="text-xs text-green-500 mt-1">{c.trend} this month</p>}
          </div>
        ))}
      </div>

      <div className="card p-5">
        <h3 className="font-semibold text-dark dark:text-gray-100 mb-4">Order Status Breakdown</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {orderStatuses.map((status) => (
            <div key={status.label} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className={`w-8 h-8 rounded flex items-center justify-center ${status.color}`}>
                <status.icon size={16} />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">{status.label}</p>
                <p className="text-lg font-semibold text-dark dark:text-gray-100">{status.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
