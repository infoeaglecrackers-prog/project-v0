import { useEffect, useRef, useState } from "react";
import { Copy, Loader2, QrCode, Smartphone, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";
import { paymentService, type UpiIntentResponse } from "../../services/paymentService";
import { formatCurrency } from "../../utils/formatCurrency";

interface Props {
  orderId: string;
  /** Called after the UTR is accepted, so the parent can refetch the order. */
  onSubmitted: () => void;
  /**
   * Arrived from the "Pay with Google Pay" button in the payment email
   * (`?pay=1`) — hand off to the UPI app as soon as the intent loads instead of
   * making the customer tap again.
   */
  autoLaunch?: boolean;
}

/**
 * Only auto-fire the `upi://` intent where an app can actually handle it.
 * On desktop it would raise a useless "no application found" dialog, so there we
 * leave the QR as the path.
 */
const canHandleUpi = () =>
  typeof navigator !== "undefined" &&
  /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

/**
 * Pay-by-UPI panel for an order in AwaitingPayment.
 *
 * There is no payment gateway behind this, so there is no callback telling us
 * the transfer happened: the customer pays into our VPA from their own UPI app,
 * then types back the 12-digit UTR. That claim is unverified — the order only
 * becomes Processing once an admin matches it to the bank statement. The copy
 * below is deliberate about that so nobody expects instant confirmation.
 */
export default function UpiPayPanel({ orderId, onSubmitted, autoLaunch }: Props) {
  const [intent, setIntent] = useState<UpiIntentResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [utr, setUtr] = useState("");
  const [submitting, setSubmitting] = useState(false);
  // Guards against re-firing the intent if this component re-renders or the
  // customer navigates back to the page from the UPI app.
  const launched = useRef(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    paymentService
      .getUpiIntent(orderId)
      .then((r) => {
        if (cancelled) return;
        setIntent(r.data.data);
        if (autoLaunch && !launched.current && canHandleUpi()) {
          launched.current = true;
          window.location.href = r.data.data.upiUri;
        }
      })
      .catch((err: unknown) => {
        const e = err as { response?: { data?: { message?: string } } };
        if (!cancelled) setLoadError(e.response?.data?.message || "Couldn't load payment details.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [orderId, autoLaunch]);

  const copy = async (value: string, label: string) => {
    try {
      await navigator.clipboard.writeText(value);
      toast.success(`${label} copied`);
    } catch {
      toast.error("Couldn't copy — please copy it manually.");
    }
  };

  const handleSubmit = async () => {
    const trimmed = utr.trim();
    if (!/^\d{12}$/.test(trimmed)) {
      toast.error("Enter the 12-digit UTR from your UPI app.");
      return;
    }
    setSubmitting(true);
    try {
      await paymentService.submitUtr(orderId, trimmed);
      toast.success("Payment details received — we'll confirm shortly.");
      onSubmitted();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      toast.error(e.response?.data?.message || "Couldn't submit payment details.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="card p-6 flex items-center justify-center gap-2 text-gray-500 dark:text-gray-400">
        <Loader2 size={16} className="animate-spin" /> Loading payment details…
      </div>
    );
  }

  if (loadError || !intent) {
    return (
      <div className="card p-6 flex items-start gap-3">
        <AlertCircle size={18} className="text-red-500 mt-0.5 flex-shrink-0" />
        <div>
          <p className="font-medium text-red-600 dark:text-red-400">{loadError}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Please refresh the page, or contact support if this keeps happening.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="card p-6 space-y-6">
      <div>
        <h3 className="font-semibold text-dark dark:text-gray-100">Pay {formatCurrency(Number(intent.amount))} by UPI</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Pay from any UPI app, then enter the reference number below so we can confirm it.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Scan — desktop */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
            <QrCode size={13} /> Scan with your phone
          </p>
          {intent.qrDataUrl ? (
            <img
              src={intent.qrDataUrl}
              alt={`UPI QR code to pay ${intent.payeeName} ₹${intent.amount}`}
              className="w-40 h-40 rounded-xl border border-gray-200 dark:border-gray-700 bg-white p-2"
            />
          ) : (
            <div className="w-40 h-40 rounded-xl border border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center text-xs text-gray-400 text-center px-3">
              QR unavailable — use the UPI ID shown here
            </div>
          )}
        </div>

        {/* Tap — mobile */}
        <div className="space-y-3">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
            <Smartphone size={13} /> Or pay on this device
          </p>
          {/* A plain anchor, not fetch/router: the OS has to handle the upi:// scheme. */}
          <a href={intent.upiUri} className="btn-primary w-full flex items-center justify-center gap-2">
            Pay with Google Pay
          </a>
          <p className="text-xs text-gray-400 dark:text-gray-500 -mt-1">
            Opens Google Pay, PhonePe or whichever UPI app you use
          </p>

          <div className="space-y-1.5 text-sm">
            <div className="flex items-center justify-between gap-2">
              <span className="text-gray-500 dark:text-gray-400">UPI ID</span>
              <button
                onClick={() => copy(intent.vpa, "UPI ID")}
                className="font-mono text-xs dark:text-gray-200 flex items-center gap-1 hover:text-primary"
              >
                {intent.vpa} <Copy size={12} />
              </button>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-gray-500 dark:text-gray-400">Amount</span>
              <span className="font-medium dark:text-gray-200">₹{intent.amount}</span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-gray-500 dark:text-gray-400">Reference</span>
              <span className="font-mono text-xs dark:text-gray-200">{intent.refId}</span>
            </div>
          </div>
        </div>
      </div>

      <hr className="border-gray-100 dark:border-gray-700" />

      {/* UTR claim */}
      <div>
        <label htmlFor="utr" className="block font-medium text-sm text-dark dark:text-gray-100">
          Already paid? Enter your UTR
        </label>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 mb-2">
          Your UPI app shows this as “UTR”, “Transaction ID”, or “Reference number” — 12 digits.
        </p>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            id="utr"
            value={utr}
            onChange={(e) => setUtr(e.target.value.replace(/\D/g, "").slice(0, 12))}
            inputMode="numeric"
            placeholder="123456789012"
            className="input-field flex-1 font-mono tracking-wide"
          />
          <button
            onClick={handleSubmit}
            disabled={submitting || utr.length !== 12}
            className="btn-primary sm:w-auto flex items-center justify-center gap-2 disabled:opacity-40"
          >
            {submitting ? <Loader2 size={15} className="animate-spin" /> : null}
            {submitting ? "Submitting…" : "Submit"}
          </button>
        </div>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
          We verify every payment against our bank statement before packing — this usually takes a few hours during business hours.
        </p>
      </div>
    </div>
  );
}
