import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState, useEffect } from "react";

import { toast } from "sonner";
import { skipToken } from "@reduxjs/toolkit/query";
import { TUser } from "@/types/api/auth";
import {
  useAsignCoinToUserByIdMutation,
  useSearchUsersByEmailQuery,
} from "@/redux/api/power-shared";

const sellCoinSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  coinAmount: z.number().min(1, "Amount must be at least 1"),
  userRole: z.string().min(1, "User role is required"), // This will be set internally
});

type SellCoinFormValues = z.infer<typeof sellCoinSchema>;

type SellCoinDialogProps = {
  open: boolean;
  onClose: () => void;
  // users: Array<TUser>;
};

export function SellCoinDialog({ open, onClose }: SellCoinDialogProps) {
  const [searchName, setSearchName] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [asignCoinToUser, { isLoading }] = useAsignCoinToUserByIdMutation();

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchName);
    }, 400);
    return () => clearTimeout(handler);
  }, [searchName]);

  // Use backend search for email
  const { data: searchedUsers, isLoading: isSearching } =
    useSearchUsersByEmailQuery(
      debouncedSearch.length > 0
        ? { email: debouncedSearch, page: 1, limit: 5 }
        : skipToken,
    );



  const filteredUsers =
    debouncedSearch.length > 0 ? searchedUsers?.result?.users || [] : [];

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<SellCoinFormValues>({
    resolver: zodResolver(sellCoinSchema),
    defaultValues: { userId: "", coinAmount: 1 },
  });

  const onSubmit = async (data: SellCoinFormValues) => {
    try {
      const payload = {
        userId: data.userId,
        coins: data.coinAmount,
        userRole: data.userRole || "user", // Default to "user" if not set
      };

      const response = await asignCoinToUser(payload).unwrap();
      toast.success(response.message);
      setSuccessMsg(
        `Successfully added ${data.coinAmount} coins to user ${data.userId}`,
      );
      setTimeout(() => {
        onClose();
        setSuccessMsg("");
        reset();
      }, 1500);
    } catch (error: any) {
      toast.error(
        error?.data?.message || "Failed to sell coins. Please try again.",
      );
      setSuccessMsg("Failed to sell coins. Please try again.");
    }
  };
  // in this file we are selling coin. i already integrated the api for selling coin. this could be useAsignCoinToUserByIdMutation. please make sure you are perfectly implmented

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-pink-500 text-xl"
          onClick={() => {
            onClose();
            reset();
          }}
          aria-label="Close"
        >
          &times;
        </button>
        <h2 className="text-xl font-bold mb-4 text-pink-500">Sell Coin</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Search User by Name
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-pink-400 dark:focus:border-pink-500"
              placeholder="Type user name..."
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
            />
            {searchName && (
              <div className="mt-2 max-h-32 overflow-y-auto border rounded bg-white dark:bg-gray-800 shadow">
                {isSearching ? (
                  <div className="px-3 py-2 text-gray-400 dark:text-gray-500 text-sm text-center">
                    Searching...
                  </div>
                ) : (filteredUsers as TUser[]).length > 0 ? ( // Todo: need to remove the type assertion
                  (filteredUsers as TUser[]).map(
                    // Todo: need to remove the  type assertion
                    (user) => (
                      <div
                        key={user._id}
                        className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-pink-50 dark:hover:bg-pink-900/20 text-sm"
                        onClick={() => {
                          setValue("userId", user._id);
                          setSearchName(user.name);
                          setValue("userRole", user.userRole); // Set the user role here
                        }}
                      >
                        {user.avatar ? (
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-8 h-8 rounded-full border border-gray-200 dark:border-gray-600 object-cover"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center text-pink-500 dark:text-pink-400 font-bold border border-gray-200 dark:border-gray-600">
                            {user.name?.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-800 dark:text-gray-200">
                            {user.name}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {user.email}
                          </span>
                          <span className="text-xs text-gray-400 dark:text-gray-500">
                            ID: {user._id}
                          </span>
                        </div>
                      </div>
                    ),
                  )
                ) : (
                  <div className="px-3 py-2 text-gray-400 dark:text-gray-500 text-sm">
                    No user found
                  </div>
                )}
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              User ID
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
              {...register("userId")}
              readOnly
            />
            {errors.userId && (
              <p className="text-xs text-red-500 mt-1">
                {errors.userId.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Coin Amount
            </label>
            <input
              type="number"
              min={1}
              className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              {...register("coinAmount", { valueAsNumber: true })}
            />
            {errors.coinAmount && (
              <p className="text-xs text-red-500 mt-1">
                {errors.coinAmount.message}
              </p>
            )}
          </div>
          {isLoading ? (
            <button
              type="submit"
              className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 rounded mt-2"
              disabled
            >
              Selling coin...
            </button>
          ) : (
            <button
              type="submit"
              className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 rounded mt-2"
            >
              Sell Coin
            </button>
          )}

          {successMsg && (
            <p className="text-green-600 text-sm mt-2 text-center">
              {successMsg}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
