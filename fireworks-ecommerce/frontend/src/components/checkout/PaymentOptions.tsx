import { CreditCard, Smartphone, Building2, Wallet, Clock } from "lucide-react";
import { RAZORPAY_ENABLED } from "../../config/features";

interface Props {
  selected: string;
  onSelect: (method: string) => void;
}

interface Method {
  id: string;
  label: string;
  icon: typeof CreditCard;
  desc: string;
  gpay?: boolean;
}

// The two self-hosted rails. Both settle over UPI into our own VPA — `upi` pays
// straight away, `pay_later` reserves the order and pays within 2 days.
const SELF_HOSTED: Method[] = [
  {
    id: "upi",
    label: "Google Pay / UPI",
    icon: Smartphone,
    desc: "Pay now with GPay, PhonePe, Paytm or any UPI app",
    gpay: true,
  },
  {
    id: "pay_later",
    label: "Pay Later",
    icon: Clock,
    desc: "Place now, pay by UPI within 2 days — packing starts after payment",
  },
];

// Only rendered when VITE_ENABLE_RAZORPAY=true (and the backend flag matches).
const RAZORPAY_METHODS: Method[] = [
  { id: "razorpay_card", label: "Credit / Debit Card", icon: CreditCard, desc: "Visa, Mastercard, RuPay" },
  { id: "razorpay_gpay", label: "Google Pay (Razorpay)", icon: Smartphone, desc: "Pay directly with GPay", gpay: true },
  { id: "razorpay_upi", label: "Other UPI (Razorpay)", icon: Smartphone, desc: "PhonePe, Paytm, any UPI app" },
  { id: "razorpay_nb", label: "Net Banking", icon: Building2, desc: "All major banks" },
  { id: "cod", label: "Cash on Delivery", icon: Wallet, desc: "Pay when you receive" },
];

export default function PaymentOptions({ selected, onSelect }: Props) {
  const methods = RAZORPAY_ENABLED ? [...SELF_HOSTED, ...RAZORPAY_METHODS] : SELF_HOSTED;

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
              {m.gpay ? (
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

      {/* Both self-hosted rails need the manual-verification caveat spelled out —
          there's no gateway to confirm the payment instantly. */}
      {(selected === "upi" || selected === "pay_later") && (
        <div className="mt-3 p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg text-sm text-orange-700 dark:text-orange-300">
          {selected === "pay_later" ? (
            <>
              ⏰ <strong>Pay Later:</strong> your order is reserved, but packing begins <strong>only after payment is received and verified</strong>. You have 2 days to pay by UPI.
            </>
          ) : (
            <>
              📲 <strong>How it works:</strong> we'll show you a UPI QR and a Google Pay button on the next screen. After paying, enter the 12-digit reference number so we can verify it against our bank statement — packing starts once confirmed.
            </>
          )}
        </div>
      )}
    </div>
  );
}
