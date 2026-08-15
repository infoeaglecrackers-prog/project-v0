import { CreditCard, Smartphone, Building2, Wallet, Clock } from "lucide-react";

interface Props {
  selected: string;
  onSelect: (method: string) => void;
}

const methods = [
  { id: "razorpay_card", label: "Credit / Debit Card", icon: CreditCard, desc: "Visa, Mastercard, RuPay" },
  { id: "razorpay_gpay", label: "Google Pay", icon: Smartphone, desc: "Pay directly with GPay app", gpay: true },
  { id: "razorpay_upi", label: "Other UPI", icon: Smartphone, desc: "PhonePe, Paytm, any UPI app" },
  { id: "razorpay_nb", label: "Net Banking", icon: Building2, desc: "All major banks" },
  { id: "cod", label: "Cash on Delivery", icon: Wallet, desc: "Pay when you receive" },
  { id: "pay_later", label: "Pay Later", icon: Clock, desc: "Place now, pay within 2 days — packing starts after payment" },
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
              {"gpay" in m ? (
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Google_Pay_Logo.svg/120px-Google_Pay_Logo.svg.png" alt="GPay" className="w-6 h-6 object-contain" />
              ) : (
                <m.icon size={18} />
              )}
            </div>
            <div className="flex-1">
              <p className="font-medium text-dark dark:text-gray-100 text-sm">{m.label}</p>
              <p className="text-xs text-gray-400 dark:text-gray-500">{m.desc}</p>
            </div>
            {m.id === "pay_later" && (
              <span className="text-xs bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 px-2 py-0.5 rounded-full font-medium">2-Day Window</span>
            )}
            <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${selected === m.id ? "border-primary bg-primary" : "border-gray-300 dark:border-gray-500"}`} />
          </div>
        ))}
      </div>
      {selected === "pay_later" && (
        <div className="mt-3 p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg text-sm text-orange-700 dark:text-orange-300">
          ⏰ <strong>Pay Later Notice:</strong> Your order will be reserved but packing will begin <strong>only after payment is received</strong>. You have 2 days from order placement to complete payment.
        </div>
      )}
    </div>
  );
}
