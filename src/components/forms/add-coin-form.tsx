import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { useAddCoinForAdminMutation } from "@/redux/api/auth.api";

const addCoinForm = z.object({
  coinAmount: z.number().min(1, "Amount must be at least 1"),
});
type SellCoinFormValues = z.infer<typeof addCoinForm>;

export const AddCoinForm = () => {
  const [addCoin, { isLoading }] = useAddCoinForAdminMutation();

  // Use backend search for email

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SellCoinFormValues>({
    resolver: zodResolver(addCoinForm),
    defaultValues: { coinAmount: 1 },
  });

  const onSubmit = async (data: SellCoinFormValues) => {
    try {
      const payload = {
        coins: Number(data.coinAmount),
      };

      const response = await addCoin(payload).unwrap();
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
          Add Coin
        </Button>
      )}
    </form>
  );
};
