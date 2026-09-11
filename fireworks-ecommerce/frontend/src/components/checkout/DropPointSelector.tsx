import { useEffect, useState, useMemo } from "react";
import { Package } from "lucide-react";
import { dropPointService } from "../../services/dropPointService";
import type { IDropPoint } from "../../services/dropPointService";

interface Props {
  selectedId: string | null;
  onSelect: (dp: IDropPoint | null) => void;
  pincode?: string;
  city?: string;
}

export default function DropPointSelector({ selectedId, onSelect }: Props) {
  const [allPoints, setAllPoints] = useState<IDropPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedState, setSelectedState] = useState<string>("");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");
  const [selectedPlace, setSelectedPlace] = useState<string>("");

  // Fetch all droppoints once
  useEffect(() => {
    setLoading(true);
    dropPointService
      .getActive()
      .then((r: any) => {
        const points = r.data?.data?.dropPoints ||
                      r.data?.dropPoints ||
                      r.data?.data ||
                      [];
        const validPoints = Array.isArray(points) ? points : [];
        setAllPoints(validPoints);
        if (validPoints.length === 0) {
          console.warn("No drop points returned from API");
        }
      })
      .catch((err) => {
        console.error("Failed to fetch drop points:", err);
        setAllPoints([]);
      })
      .finally(() => setLoading(false));
  }, []);

  // Extract unique states
  const states = useMemo(() => {
    const unique = [...new Set(allPoints.map((p) => p.state))].sort();
    return unique;
  }, [allPoints]);

  // Extract unique districts for selected state (excluding null/empty)
  const districts = useMemo(() => {
    if (!selectedState) return [];
    const statePoints = allPoints.filter((p) => p.state === selectedState);
    const unique = [
      ...new Set(
        statePoints
          .map((p) => p.district)
          .filter((d) => d && d.trim() !== "")
      ),
    ].sort();
    return unique;
  }, [selectedState, allPoints]);

  // Extract unique places for selected state & district
  const places = useMemo(() => {
    let filtered = allPoints;

    if (selectedState) {
      filtered = filtered.filter((p) => p.state === selectedState);
    }
    if (selectedDistrict) {
      filtered = filtered.filter((p) => p.district === selectedDistrict);
    }

    const unique = [...new Set(filtered.map((p) => p.name))].sort();
    return unique;
  }, [selectedState, selectedDistrict, allPoints]);

  // Get the selected drop point object
  const selectedPoint = allPoints.find((p) => p._id === selectedId) || null;

  // Handle selection change
  const handlePlaceSelect = (placeName: string) => {
    const point = allPoints.find(
      (p) =>
        p.state === selectedState &&
        p.district === selectedDistrict &&
        p.name === placeName
    );
    if (point) {
      setSelectedPlace(placeName);
      onSelect(point);
    }
  };

  // Reset dependent dropdowns when state changes
  const handleStateChange = (state: string) => {
    setSelectedState(state);
    setSelectedDistrict("");
    setSelectedPlace("");
    onSelect(null);
  };

  // Reset place when district changes
  const handleDistrictChange = (district: string) => {
    setSelectedDistrict(district);
    setSelectedPlace("");
    onSelect(null);
  };

  if (loading) return null;

  return (
    <div className="mt-4 sm:mt-5 border-t dark:border-gray-700 pt-4 sm:pt-5">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4 sm:mb-5">
        <Package size={16} className="text-primary flex-shrink-0" />
        <h4 className="text-sm sm:text-base font-semibold text-dark dark:text-gray-100">
          Pick Up Point
        </h4>
      </div>
      <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-4 sm:mb-5">
        Select your preferred pickup location.
      </p>

      {/* ── STATE DROPDOWN ── */}
      <div className="mb-4 sm:mb-5">
        <label className="text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-400 block mb-2 sm:mb-2.5">
          State *
        </label>
        <select
          value={selectedState}
          onChange={(e) => handleStateChange(e.target.value)}
          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-primary transition-all"
        >
          <option value="">Choose State</option>
          {states.length > 0 ? (
            states.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))
          ) : (
            <option disabled>No states available</option>
          )}
        </select>
      </div>

      {/* ── DISTRICT DROPDOWN (if districts exist) ── */}
      {selectedState && districts.length > 0 && (
        <div className="mb-4 sm:mb-5">
          <label className="text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-400 block mb-2 sm:mb-2.5">
            District (Optional)
          </label>
          <select
            value={selectedDistrict}
            onChange={(e) => handleDistrictChange(e.target.value)}
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-primary transition-all"
          >
            <option value="">All Districts ({districts.length})</option>
            {districts.map((dist) => (
              <option key={dist} value={dist}>
                {dist}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* ── PLACE/LOCATION DROPDOWN ── */}
      {selectedState && places.length > 0 && (
        <div className="mb-4 sm:mb-5">
          <label className="text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-400 block mb-2 sm:mb-2.5">
            Pick Up Location * ({places.length})
          </label>
          <select
            value={selectedPlace}
            onChange={(e) => handlePlaceSelect(e.target.value)}
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-primary transition-all"
          >
            <option value="">Choose Location</option>
            {places.map((place) => (
              <option key={place} value={place}>
                {place}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Show message if no places found */}
      {selectedState && places.length === 0 && (
        <p className="text-xs sm:text-sm text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 p-3 sm:p-4 rounded-lg mb-4">
          No pickup locations available {selectedDistrict ? `in ${selectedDistrict}` : "in this state"}.
        </p>
      )}

      {/* Selected summary */}
      {selectedPoint && (
        <div className="mt-4 sm:mt-6 bg-primary/5 dark:bg-primary/10 border border-primary/20 rounded-lg p-3 sm:p-4 space-y-3">
          <div className="flex items-start gap-3">
            <Package size={16} className="text-primary mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm sm:text-base font-semibold text-dark dark:text-gray-100 break-words">
                {selectedPoint.name}
              </p>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-2 break-words">
                {selectedPoint.addressLine1}
                {selectedPoint.addressLine2 && ` • ${selectedPoint.addressLine2}`}
              </p>
              {selectedPoint.contactPhone && (
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-2">
                  📞 {selectedPoint.contactPhone}
                </p>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              handleStateChange("");
              onSelect(null);
            }}
            className="text-xs sm:text-sm text-primary hover:text-red-500 font-medium transition-colors block"
          >
            ✕ Change location
          </button>
        </div>
      )}
    </div>
  );
}
