import { CheckCircle, Clock, Package, Truck, XCircle } from "lucide-react";

const steps = [
  { key: "pending", label: "Order Placed", icon: Clock },
  { key: "confirmed", label: "Confirmed", icon: CheckCircle },
  { key: "processing", label: "Processing", icon: Package },
  { key: "shipped", label: "Shipped", icon: Truck },
  { key: "delivered", label: "Delivered", icon: CheckCircle },
];

const ORDER = ["pending", "confirmed", "processing", "shipped", "delivered"];

interface Props {
  status: string;
}

export default function OrderTimeline({ status }: Props) {
  const normalizedStatus = status?.toLowerCase();

  if (normalizedStatus === "cancelled") {
    return (
      <div className="flex items-center gap-3 text-red-500 py-4">
        <XCircle size={20} /> <span className="font-medium">Order Cancelled</span>
      </div>
    );
  }

  const currentIdx = ORDER.indexOf(normalizedStatus);

  return (
    <div className="flex items-center gap-0">
      {steps.map((step, i) => {
        const done = i <= currentIdx;
        const Icon = step.icon;
        return (
          <div key={step.key} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                done ? "bg-primary text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500"
              }`}>
                <Icon size={14} />
              </div>
              <p className={`text-xs mt-1.5 text-center whitespace-nowrap ${done ? "text-primary font-medium" : "text-gray-400 dark:text-gray-500"}`}>
                {step.label}
              </p>
            </div>
            {i < steps.length - 1 && (
              <div className={`flex-1 h-0.5 mb-5 transition-colors ${i < currentIdx ? "bg-primary" : "bg-gray-200 dark:bg-gray-700"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
