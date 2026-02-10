import React from "react";
import { ActionTinyButton } from "@/components/buttons/action-tiny-buttons";
import { useDeleteBannerMutation } from "@/redux/api/admin/banners";
import { ModalDialog } from "@/components/dialog/modal-dialog";
import { useState } from "react";

type BannerCardProps = {
  banner: any;
  onDeleted?: () => void;
  onEdit?: (id: string) => void;
};

export const BannerCard: React.FC<BannerCardProps> = ({ banner, onDeleted, onEdit }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [deleteBanner, { isLoading }] = useDeleteBannerMutation();

  const handleDelete = async () => {
    try {
      await deleteBanner({ id: banner._id }).unwrap();
      onDeleted && onDeleted();
      setIsOpen(false);
    } catch (err) {
      setIsOpen(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 border rounded-lg shadow-sm overflow-hidden">
      <div className="h-48 w-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
        {banner.url ? (
          // image URL may be in banner.image
          <img src={banner.url} alt={banner.alt || "banner"} className="object-cover h-48 w-full" />
        ) : (
          <div className="text-gray-400">No image</div>
        )}
      </div>
      <div className="p-4 space-y-2">
        <div className="text-sm text-gray-600 dark:text-gray-300">{banner.alt || "-"}</div>
        <div className="flex gap-2 mt-2">
          <ActionTinyButton variant="primary" onClick={() => onEdit && onEdit(banner._id)}>
            Update
          </ActionTinyButton>
          <ActionTinyButton variant="danger" onClick={() => setIsOpen(true)}>
            Delete
          </ActionTinyButton>
        </div>
      </div>

      <ModalDialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Delete Banner"
        description="Are you sure you want to delete this banner? This action cannot be undone."
      >
        <div className="mt-4 flex justify-end gap-3">
          <button className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded" onClick={() => setIsOpen(false)}>Cancel</button>
          <button className="px-4 py-2 bg-red-600 text-white rounded" disabled={isLoading} onClick={handleDelete}>
            {isLoading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </ModalDialog>
    </div>
  );
};

export default BannerCard;
