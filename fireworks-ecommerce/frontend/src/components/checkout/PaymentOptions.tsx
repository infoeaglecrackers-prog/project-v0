import { CreditCard, Smartphone, Building2, Wallet } from "lucide-react";

interface Props {
  selected: string;
  onSelect: (method: string) => void;
}

const methods = [
  { id: "razorpay_card", label: "Credit / Debit Card", icon: CreditCard, desc: "Visa, Mastercard, RuPay" },
  { id: "razorpay_upi", label: "UPI", icon: Smartphone, desc: "GPay, PhonePe, Paytm" },
  { id: "razorpay_nb", label: "Net Banking", icon: Building2, desc: "All major banks" },
  { id: "cod", label: "Cash on Delivery", icon: Wallet, desc: "Pay when you receive" },
];

export default function PaymentOptions({ selected, onSelect }: Props) {
  return (
    <div>
      <h3 className="font-semibold text-dark dark:text-gray-100 mb-4">Payment Method</h3>
      <div className="space-y-3">
        {methods.map((m) => (
          <div
            key={m.id}
            onClick={() => onSelect(m.id)}
            className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-colors ${
              selected === m.id ? "border-primary bg-primary/5 dark:bg-primary/10" : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
            }`}
          >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${selected === m.id ? "bg-primary text-white" : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"}`}>
              <m.icon size={18} />
            </div>
            <div className="flex-1">
              <p className="font-medium text-dark dark:text-gray-100 text-sm">{m.label}</p>
              <p className="text-xs text-gray-400 dark:text-gray-500">{m.desc}</p>
            </div>
            <div className={`w-4 h-4 rounded-full border-2 ${selected === m.id ? "border-primary bg-primary" : "border-gray-300 dark:border-gray-500"}`} />
          </div>
        ))}
      </div>
    </div>
  );
}
