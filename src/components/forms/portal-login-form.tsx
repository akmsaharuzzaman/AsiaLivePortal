import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  PortalLoginFormValues,
  portalLoginSchema,
} from "@/schema/login-schema.zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type PortalLoginFormProps = {
  onSubmit: (values: PortalLoginFormValues) => void;
  isLoading?: boolean;
};

export function PortalLoginForm({ onSubmit, isLoading }: PortalLoginFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PortalLoginFormValues>({
    resolver: zodResolver(portalLoginSchema),
    defaultValues: {
      userID: "",
      password: "",
    },
  });

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="space-y-2">
        <Label htmlFor="email" className="text-slate-400 dark:text-slate-500 text-sm">
          User ID
        </Label>
        <Input
          id="userId"
          type="text"
          {...register("userID")}
          className="bg-white dark:bg-gray-800 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:border-pink-400 dark:focus:border-pink-500 focus:ring-pink-400 dark:focus:ring-pink-500"
          placeholder="Enter your userId"
          autoComplete="userId"
        />
        {errors.userID && (
          <p className="text-xs text-red-500 mt-1">{errors.userID.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-slate-400 dark:text-slate-500 text-sm">
          Password
        </Label>
        <Input
          id="password"
          type="password"
          {...register("password")}
          className="bg-white dark:bg-gray-800 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:border-pink-400 dark:focus:border-pink-500 focus:ring-pink-400 dark:focus:ring-pink-500"
          placeholder="Password"
          autoComplete="current-password"
        />
        {errors.password && (
          <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full bg-pink-500 hover:bg-pink-600 text-white font-medium py-3 mt-6"
        disabled={isLoading}
      >
        {isLoading ? "Signing In..." : "Sign In"}
      </Button>
    </form>
  );
}
