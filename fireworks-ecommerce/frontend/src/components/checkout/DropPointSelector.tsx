import { useEffect, useState, useRef } from "react";
import { MapPin, Package, Clock, Phone, ChevronDown, ChevronUp, Sparkles, Home } from "lucide-react";
import { dropPointService } from "../../services/dropPointService";
import type { IDropPoint } from "../../services/dropPointService";

interface Props {
  selectedId: string | null;
  onSelect: (dp: IDropPoint | null) => void;
  pincode?: string;   // from the selected delivery address
  city?: string;      // from the selected delivery address
}

interface GroupedPoints {
  nearby: IDropPoint[];
  sameCity: IDropPoint[];
  others: IDropPoint[];
}

function DropPointCard({
  dp,
  isSelected,
  badge,
  onClick,
}: {
  dp: IDropPoint;
  isSelected: boolean;
  badge?: { label: string; color: string };
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={`flex items-start gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
        isSelected
          ? "border-primary bg-primary/5 dark:bg-primary/10 shadow-sm"
          : "border-gray-200 dark:border-gray-600 hover:border-primary/40 hover:bg-gray-50 dark:hover:bg-gray-800/50"
      }`}
    >
      <Package
        size={16}
        className={`mt-0.5 flex-shrink-0 ${isSelected ? "text-primary" : "text-gray-400"}`}
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-sm font-semibold text-dark dark:text-gray-100">{dp.name}</p>
          {badge && (
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${badge.color}`}>
              {badge.label}
            </span>
          )}
          {isSelected && (
            <span className="text-[10px] font-bold bg-primary text-white px-1.5 py-0.5 rounded-full">
              Selected
            </span>
          )}
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
          {dp.addressLine1}{dp.addressLine2 ? `, ${dp.addressLine2}` : ""}, {dp.city} – {dp.pincode}
        </p>
        {dp.landmark && (
          <p className="text-xs text-gray-400 dark:text-gray-500">📍 {dp.landmark}</p>
        )}
        <div className="flex flex-wrap gap-3 mt-1">
          {dp.workingHours && (
            <span className="flex items-center gap-1 text-[11px] text-gray-400 dark:text-gray-500">
              <Clock size={10} /> {dp.workingHours}
            </span>
          )}
          {dp.contactPhone && (
            <span className="flex items-center gap-1 text-[11px] text-gray-400 dark:text-gray-500">
              <Phone size={10} /> {dp.contactPhone}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default function DropPointSelector({ selectedId, onSelect, pincode, city }: Props) {
  const [grouped, setGrouped] = useState<GroupedPoints>({ nearby: [], sameCity: [], others: [] });
  const [allPoints, setAllPoints] = useState<IDropPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [showOthers, setShowOthers] = useState(false);
  const prevPinRef = useRef<string | undefined>(undefined);

  const hasAddress = !!(pincode && pincode.length === 6);

  useEffect(() => {
    // Refetch when pincode changes (only when 6 digits)
    if (pincode === prevPinRef.current) return;
    prevPinRef.current = pincode;

    setLoading(true);
    const params = hasAddress ? { pincode, city } : undefined;
    dropPointService
      .getActive(params)
      .then((r) => {
        const { nearby = [], sameCity = [], others = [], dropPoints = [] } = r.data.data || {};
        setGrouped({ nearby, sameCity, others });
        setAllPoints(dropPoints);
        // If currently selected point is no longer in nearby, keep it selected but show a note
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [pincode, city, hasAddress]);

  if (loading || allPoints.length === 0) return null;

  const selectedPoint = allPoints.find((d) => d._id === selectedId) || null;
  const hasRecommendations = grouped.nearby.length > 0 || grouped.sameCity.length > 0;

  return (
    <div className="mt-5 border-t dark:border-gray-700 pt-4">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <Package size={15} className="text-primary" />
        <h4 className="text-sm font-semibold text-dark dark:text-gray-100">
          Parcel Drop Point
          {hasAddress && hasRecommendations && (
            <span className="ml-2 text-xs font-normal text-primary bg-primary/10 px-1.5 py-0.5 rounded-full">
              {grouped.nearby.length + grouped.sameCity.length} near {pincode}
            </span>
          )}
        </h4>
      </div>
      <p className="text-xs text-gray-400 dark:text-gray-500 mb-3">
        {hasAddress && hasRecommendations
          ? "Pick up your order at a nearby location. Packing & dispatch will be to the drop point."
          : "Select a convenient pickup location near you."}
      </p>

      {/* Home delivery option */}
      <div
        onClick={() => onSelect(null)}
        className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all mb-2 ${
          !selectedId
            ? "border-primary bg-primary/5 dark:bg-primary/10"
            : "border-gray-200 dark:border-gray-600 hover:border-gray-300"
        }`}
      >
        <Home size={15} className={!selectedId ? "text-primary" : "text-gray-400"} />
        <div>
          <p className="text-sm font-medium text-dark dark:text-gray-100">Home Delivery</p>
          <p className="text-xs text-gray-400 dark:text-gray-500">Deliver to my selected address</p>
        </div>
        {!selectedId && (
          <span className="ml-auto text-[10px] font-bold bg-primary text-white px-1.5 py-0.5 rounded-full">
            Selected
          </span>
        )}
      </div>

      {/* ── NEARBY (same pincode) ── */}
      {grouped.nearby.length > 0 && (
        <div className="mb-3">
          <div className="flex items-center gap-1.5 mb-1.5">
            <Sparkles size={12} className="text-amber-500" />
            <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wide">
              Nearest to your pincode ({pincode})
            </span>
          </div>
          <div className="space-y-2">
            {grouped.nearby.map((dp) => (
              <DropPointCard
                key={dp._id}
                dp={dp}
                isSelected={selectedId === dp._id}
                badge={{ label: "📍 Nearest", color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" }}
                onClick={() => onSelect(selectedId === dp._id ? null : dp)}
              />
            ))}
          </div>
        </div>
      )}

      {/* ── SAME CITY ── */}
      {grouped.sameCity.length > 0 && (
        <div className="mb-3">
          <div className="flex items-center gap-1.5 mb-1.5">
            <MapPin size={12} className="text-blue-500" />
            <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide">
              In {city || "your city"}
            </span>
          </div>
          <div className="space-y-2">
            {grouped.sameCity.map((dp) => (
              <DropPointCard
                key={dp._id}
                dp={dp}
                isSelected={selectedId === dp._id}
                badge={{ label: "🏙️ Same City", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" }}
                onClick={() => onSelect(selectedId === dp._id ? null : dp)}
              />
            ))}
          </div>
        </div>
      )}

      {/* ── OTHER LOCATIONS (collapsible) ── */}
      {grouped.others.length > 0 && (
        <div>
          <button
            type="button"
            onClick={() => setShowOthers((p) => !p)}
            className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors mb-2"
          >
            {showOthers ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
            {showOthers ? "Hide" : "See"} other locations ({grouped.others.length})
          </button>
          {showOthers && (
            <div className="space-y-2 border-t dark:border-gray-700 pt-2">
              {grouped.others.map((dp) => (
                <DropPointCard
                  key={dp._id}
                  dp={dp}
                  isSelected={selectedId === dp._id}
                  onClick={() => onSelect(selectedId === dp._id ? null : dp)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* No drop points at all */}
      {allPoints.length === 0 && !loading && (
        <p className="text-xs text-gray-400 dark:text-gray-500 text-center py-3">
          No drop points available currently.
        </p>
      )}

      {/* Selected summary strip */}
      {selectedPoint && (
        <div className="mt-3 flex items-center gap-2 bg-primary/5 dark:bg-primary/10 border border-primary/20 rounded-lg px-3 py-2 text-xs text-primary">
          <Package size={12} />
          <span>
            Pickup at: <strong>{selectedPoint.name}</strong> — {selectedPoint.city}, {selectedPoint.pincode}
          </span>
          <button
            type="button"
            onClick={() => onSelect(null)}
            className="ml-auto text-gray-400 hover:text-red-400 transition-colors"
            title="Remove drop point"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
