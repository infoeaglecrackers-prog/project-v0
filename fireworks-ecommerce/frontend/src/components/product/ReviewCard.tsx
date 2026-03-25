import { Trash2, Edit2 } from "lucide-react";
import StarRating from "../common/StarRating";
import { formatDate } from "../../utils/formatDate";
import { useAuth } from "../../hooks/useAuth";
import type { IReview } from "../../types";

interface Props {
  review: IReview;
  onDelete?: (id: string) => void;
  onEdit?: (review: IReview) => void;
}

export default function ReviewCard({ review, onDelete, onEdit }: Props) {
  const { user: authUser } = useAuth();
  const reviewUser = typeof review.user === "object" ? review.user : null;
  const displayName = review.name || reviewUser?.name || "Anonymous";
  const reviewUserId = reviewUser?._id;
  const isOwner = authUser?._id === reviewUserId;

  return (
    <div className="card p-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <img
            src={reviewUser?.avatar?.url || `https://api.dicebear.com/7.x/initials/svg?seed=${displayName}`}
            alt={displayName}
            className="w-9 h-9 rounded-full"
          />
          <div>
            <p className="font-medium text-dark dark:text-gray-100 text-sm">{displayName}</p>
            <p className="text-xs text-gray-400 dark:text-gray-500">{formatDate(review.createdAt || "")}</p>
          </div>
        </div>
        <StarRating rating={review.rating} size={13} />
      </div>
      <p className="mt-3 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{review.comment}</p>
      {isOwner && (
        <div className="flex gap-2 mt-3">
          {onEdit && (
            <button onClick={() => onEdit(review)} className="text-xs text-blue-500 flex items-center gap-1 hover:underline">
              <Edit2 size={12} /> Edit
            </button>
          )}
          {onDelete && (
            <button onClick={() => onDelete(review._id)} className="text-xs text-red-500 flex items-center gap-1 hover:underline">
              <Trash2 size={12} /> Delete
            </button>
          )}
        </div>
      )}
    </div>
  );
}
