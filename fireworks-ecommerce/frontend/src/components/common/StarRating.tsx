import { Star } from "lucide-react";

interface Props {
  rating: number;
  max?: number;
  size?: number;
  interactive?: boolean;
  onRate?: (rating: number) => void;
}

export default function StarRating({ rating, max = 5, size = 14, interactive = false, onRate }: Props) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }).map((_, i) => {
        const filled = i + 1 <= Math.round(rating);
        return (
          <Star
            key={i}
            size={size}
            onClick={() => interactive && onRate?.(i + 1)}
            className={`${filled ? "fill-secondary text-secondary" : "text-gray-300"} ${
              interactive ? "cursor-pointer hover:text-secondary" : ""
            }`}
          />
        );
      })}
    </div>
  );
}
