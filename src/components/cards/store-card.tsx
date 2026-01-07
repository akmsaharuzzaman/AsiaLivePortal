import { DollarSign, Sparkles, Trash } from "lucide-react";
import { ActionTinyButton } from "../buttons/action-tiny-buttons";
import { toast } from "sonner";
import {
  useDeleteStoreMutation,
  useGetStoresByCategoryQuery,
} from "@/redux/api/store.api";

type StoreCardProps = {
  storeId: string;
};

export const StoreCard: React.FC<StoreCardProps> = ({ storeId }) => {
  const [deleteStore, { isLoading }] = useDeleteStoreMutation();
  //   const [open, setOpen] = React.useState(false);
  const { data: storesRes, isLoading: storeIsLoading } =
    useGetStoresByCategoryQuery({ store_id: storeId });
  const handleDelete = async (id: string) => {
    try {
      const res = await deleteStore(id).unwrap();
      toast.success(res.message || "Store deleted successfully!");
      //   setOpen(false);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete store.");
    }
  };
  if (storeIsLoading) <h2>wait for card api..</h2>;
  const stores = storesRes?.result?.items;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {stores ? (
        stores.map((store) => (
          <div className="bg-white rounded-lg shadow-md overflow-hidden group transform hover:-translate-y-1 transition-transform duration-300">
            <img
              src={store?.svgaFile || store?.bundleFiles[0]?.svgaFile}
              alt={store?.name}
              className="w-full h-32 object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).onerror = null;
                (e.target as HTMLImageElement).src =
                  "https://placehold.co/100x100/cccccc/ffffff?text=Error";
              }}
            />
            <div className="p-4">
              <h4 className="text-lg font-semibold text-gray-800">
                {store?.name}
              </h4>
              <div className="flex items-center text-gray-600 mt-1">
                <DollarSign size={14} className="mr-1 text-yellow-500" />
                <span>{store?.price}</span>
              </div>
              <div className="flex items-center text-gray-600 mt-1">
                <Sparkles size={14} className="mr-1 text-blue-500" />
                <span>{store?.totalSold} Solds</span>
              </div>
            </div>
            <div className="p-2 bg-gray-50 flex justify-end gap-x-4 items-center">
              {/* <ActionTinyButton variant="secondary" className="py-1 pl-2 text-xs">
              <Edit size={16} className="mr-2" /> Edit
            </ActionTinyButton> */}
              <ActionTinyButton
                variant="danger"
                className="py-1 px-2 text-xs"
                onClick={() => handleDelete(store._id)}
                disabled={isLoading}
              >
                {isLoading ? (
                  "Deleting..."
                ) : (
                  <>
                    <Trash size={16} className="mr-2" /> Delete
                  </>
                )}
              </ActionTinyButton>
            </div>
          </div>
        ))
      ) : (
        <h2>There are no stores</h2>
      )}
    </div>
  );
};
