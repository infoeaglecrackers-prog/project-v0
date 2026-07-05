import { useState } from "react";
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import type { IProductImage } from "../../types";

interface Props {
  images: IProductImage[];
  name: string;
}

export default function ProductImageGallery({ images, name }: Props) {
  const [current, setCurrent] = useState(0);
  const [zoomed, setZoomed] = useState(false);

  const list = images.length ? images : [{ url: "https://placehold.co/600x600?text=No+Image", publicId: "" }];

  return (
    <div>
      {/* Main image */}
      <div className="relative rounded-2xl overflow-hidden aspect-square bg-gray-50 group cursor-zoom-in" onClick={() => setZoomed(true)}>
        <img src={list[current].url} alt={name} className="w-full h-full object-contain" />
        <button className="absolute top-3 right-3 p-2 bg-white/80 rounded-lg opacity-0 group-hover:opacity-100">
          <ZoomIn size={16} />
        </button>
        {list.length > 1 && (
          <>
            <button onClick={(e) => { e.stopPropagation(); setCurrent((c) => (c - 1 + list.length) % list.length); }}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 bg-white/80 rounded-full shadow">
              <ChevronLeft size={16} />
            </button>
            <button onClick={(e) => { e.stopPropagation(); setCurrent((c) => (c + 1) % list.length); }}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-white/80 rounded-full shadow">
              <ChevronRight size={16} />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {list.length > 1 && (
        <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
          {list.map((img, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                current === i ? "border-primary" : "border-transparent"
              }`}
            >
              <img src={img.url} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Zoom Modal */}
      {zoomed && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" onClick={() => setZoomed(false)}>
          <img src={list[current].url} alt={name} className="max-w-full max-h-full object-contain" />
        </div>
      )}
    </div>
  );
}
