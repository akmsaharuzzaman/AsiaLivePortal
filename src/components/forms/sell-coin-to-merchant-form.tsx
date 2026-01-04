import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { skipToken } from "@reduxjs/toolkit/query";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { useForm, UseFormSetValue } from "react-hook-form";
import { toast } from "sonner";
import { TUser } from "@/types/api/auth";
import {
  useAsignCoinToUserByIdMutation,
  useGetMerchantsQuery,
} from "@/redux/api/power-shared";

const sellCoinSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  coinAmount: z.number().min(1, "Amount must be at least 1"),
  userRole: z.string().min(1, "User role is required"), // This will be set internally
});
type SellCoinFormValues = z.infer<typeof sellCoinSchema>;

export const SellCoinToMerchantForm = () => {
  const [searchName, setSearchName] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [asignCoinToUser, { isLoading }] = useAsignCoinToUserByIdMutation();

  // debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchName);
    }, 400);
    return () => clearTimeout(handler);
  }, [searchName]);

  // Use backend search for email
  const { data: searchedUsers, isLoading: isSearching } = useGetMerchantsQuery(
    debouncedSearch.length > 0
      ? {
          searchTerm: debouncedSearch,
        }
      : skipToken
  );

  const filteredUsers =
    debouncedSearch.length > 0 ? searchedUsers?.result?.data || [] : [];

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<SellCoinFormValues>({
    resolver: zodResolver(sellCoinSchema),
    defaultValues: { userId: "", coinAmount: 1, userRole: "" },
  });

  const onSubmit = async (data: SellCoinFormValues) => {
    try {
      const payload = {
        userId: data.userId,
        coins: data.coinAmount,
        userRole: data.userRole || "user", // Default to "user" if not set
      };

      const response = await asignCoinToUser(payload).unwrap();
      toast.success(response.message || "Coins sold successfully!");
      // setSuccessMsg(
      //   `Successfully added ${data.coinAmount} coins to user ${data.userId}`
      // );
      setTimeout(() => {
        // onClose();
        // setSuccessMsg("");
        reset();
      }, 1500);
    } catch (error: any) {
      console.log(error);
      toast.error(
        error?.data?.message || "Failed to sell coins. Please try again."
      );
      // setSuccessMsg("Failed to sell coins. Please try again.");
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label
          htmlFor="sell-userID"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Search by User ID
        </label>
        <Input
          id="sell-email"
          type="text"
          placeholder="@985656"
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
                  <SearchingResultAppear
                    key={user._id}
                    user={user}
                    setValue={setValue}
                    setSearchName={setSearchName}
                  />
                )
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
        <label
          htmlFor="sell-email"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          User ID
        </label>
        <Input type="text" {...register("userId")} readOnly />
      </div>
      <div>
        <label
          htmlFor="sell-amount"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Coin Amount
        </label>
        <Input
          type="number"
          placeholder="e.g, 1000"
          {...register("coinAmount", { valueAsNumber: true })}
        />
        {errors.coinAmount && (
          <p className="text-xs text-red-500 mt-1">
            {errors.coinAmount.message}
          </p>
        )}
      </div>
      {isLoading ? (
        <Button className="bg-green-500 text-white hover:bg-green-600" disabled>
          Processing..
        </Button>
      ) : (
        <Button
          type="submit"
          className="bg-green-500 text-white hover:bg-green-600"
        >
          Confirm Sale
        </Button>
      )}
    </form>
  );
};

const SearchingResultAppear = ({
  setSearchName,
  setValue,
  user,
}: {
  user: TUser;
  setValue: UseFormSetValue<{
    userId: string;
    coinAmount: number;
    userRole: string;
  }>;
  setSearchName: (name: string) => void;
}) => {
  return (
    <div
      className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-pink-50 dark:hover:bg-pink-900/20 text-sm"
      onClick={() => {
        setValue("userId", user._id);
        setSearchName(user.name);
        setValue("userRole", user.userRole);
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
        <span className="font-medium text-gray-800 dark:text-gray-200">{user.name}</span>
        <span className="text-xs text-gray-500 dark:text-gray-400">{user.email}</span>
        <span className="text-xs text-gray-400 dark:text-gray-500">ID: {user._id}</span>
      </div>
    </div>
  );
};
