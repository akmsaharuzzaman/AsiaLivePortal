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
      // Handle error (you can use toast or any notification system)
      console.error("Failed to delete banner:", err);
    }
  };
    return (
      <div className="bg-white dark:bg-gray-800 border rounded-lg shadow-sm overflow-hidden hover:shadow-md transition">
        <div className="relative h-48 w-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
          {banner.url ? (
            <img src={banner.url} alt={banner.alt || "banner"} className="object-cover h-48 w-full" />
          ) : (
            <div className="text-gray-400">No image</div>
          )}
          <div className="absolute left-3 top-3 bg-white/80 dark:bg-black/40 rounded-md px-2 py-1 text-xs">{banner.alt || "Banner"}</div>
        </div>
        <div className="p-4 space-y-2">
          <div className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{banner.alt || "-"}</div>
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
            <ActionTinyButton variant="secondary" onClick={() => setIsOpen(false)}>Cancel</ActionTinyButton>
            <ActionTinyButton variant="danger" disabled={isLoading} onClick={handleDelete}>{isLoading ? "Deleting..." : "Delete"}</ActionTinyButton>
          </div>
        </ModalDialog>
      </div>
    );
};

export default BannerCard;
