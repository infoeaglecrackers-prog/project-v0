import { useEffect, useState } from "react";
import Loader from "../../components/common/Loader";
import { TrendingUp, Package } from "lucide-react";
import { orderService } from "../../services/orderService";
import toast from "react-hot-toast";

interface ProductSale {
  productId: string;
  productName: string;
  totalSold: number;
  totalRevenue: number;
  lastSoldDate?: string;
}

export default function AdminProductSales() {
  const [salesData, setSalesData] = useState<ProductSale[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchSalesData = async () => {
      setLoading(true);
      try {
        // Fetch all orders with delivered status
        const { data } = await orderService.getAll();
        const deliveredOrders = (data.data?.orders || []).filter(
          (order: any) => order.status === "delivered"
        );

        // Calculate sales by product
        const salesMap = new Map<
          string,
          { productName: string; totalSold: number; totalRevenue: number; lastSoldDate: string }
        >();

        deliveredOrders.forEach((order: any) => {
          order.items?.forEach((item: any) => {
            const productName =
              typeof item.product === "object"
                ? item.product.name
                : item.productName || "Unknown Product";
            const productId = typeof item.product === "object" ? item.product._id : item.productId;

            if (salesMap.has(productId)) {
              const existing = salesMap.get(productId)!;
              existing.totalSold += item.quantity || 1;
              existing.totalRevenue += (item.price || 0) * (item.quantity || 1);
              existing.lastSoldDate = new Date(order.createdAt).toLocaleDateString();
            } else {
              salesMap.set(productId, {
                productName,
                totalSold: item.quantity || 1,
                totalRevenue: (item.price || 0) * (item.quantity || 1),
                lastSoldDate: new Date(order.createdAt).toLocaleDateString(),
              });
            }
          });
        });

        // Convert to array and sort by total sold
        const salesArray: ProductSale[] = Array.from(salesMap.entries()).map(
          ([productId, data]) => ({
            productId,
            ...data,
          })
        );

        salesArray.sort((a, b) => b.totalSold - a.totalSold);
        setSalesData(salesArray);
        setTotalRevenue(salesArray.reduce((sum, item) => sum + item.totalRevenue, 0));
      } catch (error) {
        console.error("Failed to fetch sales data:", error);
        toast.error("Failed to load sales data");
      } finally {
        setLoading(false);
      }
    };

    fetchSalesData();
  }, []);

  const filteredData = salesData.filter((item) =>
    item.productName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <Loader />;

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-dark dark:text-gray-100">Product Sales Report</h1>
        <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-1">
          Products sold from delivered orders only
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card p-4 md:p-5 bg-gradient-to-br from-primary/10 to-transparent border border-primary/20">
          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1">Total Unique Products Sold</p>
          <p className="text-2xl md:text-3xl font-bold text-primary">{salesData.length}</p>
        </div>
        <div className="card p-4 md:p-5 bg-gradient-to-br from-blue-500/10 to-transparent border border-blue-500/20">
          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1">Total Units Sold</p>
          <p className="text-2xl md:text-3xl font-bold text-blue-600 dark:text-blue-400">
            {salesData.reduce((sum, item) => sum + item.totalSold, 0).toLocaleString("en-IN")}
          </p>
        </div>
        <div className="card p-4 md:p-5 bg-gradient-to-br from-green-500/10 to-transparent border border-green-500/20">
          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1">Total Revenue</p>
          <p className="text-2xl md:text-3xl font-bold text-green-600 dark:text-green-400">
            ₹{totalRevenue.toLocaleString("en-IN")}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="card p-4">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-dark dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Mobile View */}
      <div className="lg:hidden space-y-3">
        {filteredData.length === 0 ? (
          <div className="card p-6 text-center text-gray-500 dark:text-gray-400">
            <Package size={32} className="mx-auto mb-2 opacity-50" />
            <p>No products sold yet</p>
          </div>
        ) : (
          filteredData.map((item, index) => (
            <div key={item.productId} className="card p-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white text-xs font-bold">
                      {index + 1}
                    </span>
                    <p className="font-semibold text-dark dark:text-gray-100">{item.productName}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Units Sold:</span>
                  <span className="font-semibold text-dark dark:text-gray-100">{item.totalSold}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Revenue:</span>
                  <span className="font-semibold text-green-600 dark:text-green-400">
                    ₹{item.totalRevenue.toLocaleString("en-IN")}
                  </span>
                </div>
                {item.lastSoldDate && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Last Sold:</span>
                    <span className="text-xs text-gray-600 dark:text-gray-400">{item.lastSoldDate}</span>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:block card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300">#</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300">Product Name</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-300">Units Sold</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-300">Revenue</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300">Last Sold</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                    <Package size={32} className="mx-auto mb-2 opacity-50" />
                    <p>No products sold yet</p>
                  </td>
                </tr>
              ) : (
                filteredData.map((item, index) => (
                  <tr
                    key={item.productId}
                    className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-primary/10 text-primary font-bold text-sm">
                        {index + 1}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-dark dark:text-gray-100">{item.productName}</p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <TrendingUp size={14} className="text-blue-600" />
                        <span className="font-semibold text-dark dark:text-gray-100">{item.totalSold}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="font-semibold text-green-600 dark:text-green-400">
                        ₹{item.totalRevenue.toLocaleString("en-IN")}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {item.lastSoldDate || "—"}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Info Box */}
      <div className="card p-4 bg-amber-50 dark:bg-amber-500/5 border border-amber-200 dark:border-amber-500/20">
        <h3 className="text-sm font-semibold text-amber-900 dark:text-amber-100 mb-2">Note</h3>
        <p className="text-xs text-amber-800 dark:text-amber-300">
          This report shows sales data only for orders with <span className="font-medium">"Delivered"</span> status. 
          Products are ranked by total units sold. Revenue is calculated as (Unit Price × Quantity).
        </p>
      </div>
    </div>
  );
}
