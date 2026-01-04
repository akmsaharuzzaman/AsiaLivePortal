import { useState } from "react";

import { useGetAllGiftsQuery } from "@/redux/api/gift.api";
import { GiftLists } from "@/components/pages/gifts";
import { CreateGiftDialog } from "@/components/dialog";

export const GiftListsPage = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  // const [page, setPage] = useState(1);
  const { data: gitftsData, isLoading } = useGetAllGiftsQuery(undefined);

  // const totalPage = usersData?.result?.pagination?.totalPage || 1;
  const gifts = gitftsData?.result || [];

  return (
    <div className="p-4 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {isLoading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <CreateGiftDialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
        />
      )}
      <div className="mb-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-pink-500 dark:text-pink-400">Gifts</h1>
        <Header onSellCoinClick={() => setDialogOpen(true)} />
      </div>

      <GiftLists gifts={gifts} />
    </div>
  );
};

function Header({ onSellCoinClick }: { onSellCoinClick: () => void }) {
  return (
    <div className="flex justify-end my-4">
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
        onClick={onSellCoinClick}
      >
        Create Gift
      </button>
    </div>
  );
}
