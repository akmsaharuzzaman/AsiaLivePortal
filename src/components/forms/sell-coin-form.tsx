import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { useForm, UseFormSetValue } from "react-hook-form";
import { toast } from "sonner";
import { useAsignCoinToUserByIdMutation } from "@/redux/api/power-shared";
import { useGetExactUserByShortIdQuery } from "@/redux/api/power-shared/users";

const sellCoinSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  coinAmount: z.number().min(1, "Amount must be at least 1"),
});
type SellCoinFormValues = z.infer<typeof sellCoinSchema>;

export const SellCoinForm = () => {
  const [shortId, setShortId] = useState("");
  const [debouncedShortId, setDebouncedShortId] = useState("");
  const [asignCoinToUser, { isLoading }] = useAsignCoinToUserByIdMutation();

  // Debounce short ID input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedShortId(shortId.trim());
    }, 400);
    return () => clearTimeout(handler);
  }, [shortId]);

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

  // When user selects a user from search, set userId in form
  const handleUserSelect = (userId: string) => {
    setValue("userId", userId);
  };

  const onSubmit = async (data: SellCoinFormValues) => {
    try {
      const payload = {
        userId: data.userId,
        coins: data.coinAmount,
      };
      const response = await asignCoinToUser(payload).unwrap();
      toast.success(response.message || "Coins sold successfully!");
      setTimeout(() => {
        reset();
        setShortId("");
        setDebouncedShortId("");
      }, 1500);
    } catch (error: any) {
      toast.error(
        error?.data?.message || "Failed to sell coins. Please try again."
      );
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label
          htmlFor="sell-short-id"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Search by Short ID
        </label>
        <Input
          id="sell-short-id"
          type="text"
          placeholder="100001"
          value={shortId}
          onChange={(e) => setShortId(e.target.value)}
        />
        {debouncedShortId && debouncedShortId.length > 0 && (
          <SearchingResultAppear
            shortId={debouncedShortId}
            onUserSelect={handleUserSelect}
          />
        )}
      </div>
      <div>
        <label
          htmlFor="sell-user-id"
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
  shortId,
  onUserSelect,
}: {
  shortId: string;
  onUserSelect: (userId: string) => void;
}) => {
  const { data: userDetailsRes, isLoading, error, isFetching } = useGetExactUserByShortIdQuery(
    { shortId },
    { skip: !shortId || shortId.length === 0 }
  );
  const user = userDetailsRes?.result;

  if (isLoading || isFetching) {
    return (
      <div className="mt-2 max-h-40 overflow-y-auto border rounded bg-white dark:bg-gray-800 shadow">
        <div className="px-3 py-2 text-gray-400 dark:text-gray-500 text-sm text-center">
          Searching...
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="mt-2 max-h-40 overflow-y-auto border rounded bg-white dark:bg-gray-800 shadow">
        <div className="px-3 py-2 text-red-500 dark:text-red-400 text-sm text-center">
          User not found
        </div>
      </div>
    );
  }
  if (!user) {
    return (
      <div className="mt-2 max-h-40 overflow-y-auto border rounded bg-white dark:bg-gray-800 shadow">
        <div className="px-3 py-2 text-gray-400 dark:text-gray-500 text-sm text-center">
          No results
        </div>
      </div>
    );
  }
  return (
    <div className="mt-2 max-h-40 overflow-y-auto border rounded bg-white dark:bg-gray-800 shadow">
      <div
        className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-pink-50 dark:hover:bg-pink-900/20 text-sm"
        onClick={() => onUserSelect(user._id)}
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
    </div>
  );
};
