import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { skipToken } from "@reduxjs/toolkit/query";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, UseFormSetValue } from "react-hook-form";
import { toast } from "sonner";
import { TUser } from "@/types/api/auth";
import {
  useCreateHostMutation,
  useSearchUsersByEmailQuery,
} from "@/redux/api/power-shared";
import { PERMISSION_OPTIONS } from "@/constants/constant";
import {
  CreateHostFormValues,
  createHostSchema,
} from "@/schema/create-host-form";

export const CreateHostForm = () => {
  const [searchName, setSearchName] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [createHost, { isLoading }] = useCreateHostMutation();
  // const user = useAppSelector((state) => state.auth.user);
  // const merchantId = user?.id || "";

  // debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchName);
    }, 400);
    return () => clearTimeout(handler);
  }, [searchName]);

  // Use backend search for user
  const { data: searchedUsers, isLoading: isSearching } =
    useSearchUsersByEmailQuery(
      debouncedSearch.length > 0
        ? {
            email: debouncedSearch,
            page: 1,
            limit: 5,
          }
        : skipToken,
    );

  const filteredUsers =
    debouncedSearch.length > 0 ? searchedUsers?.result?.users || [] : []; // correctly used api response based on the tyepscript type latest changes

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<CreateHostFormValues>({
    resolver: zodResolver(createHostSchema),
    defaultValues: { userId: "", permission: "" },
  });

  const onSubmit = async (data: CreateHostFormValues) => {
    try {
      const payload = {
        userId: data.userId,
        permissions: [data.permission],
      };
      const response = await createHost(payload).unwrap();
      toast.success(response.message || "Host created successfully!");
      setTimeout(() => {
        reset();
      }, 1500);
    } catch (error: any) {
      toast.error(
        error?.data?.message || "Failed to create host. Please try again.",
      );
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label
          htmlFor="host-search"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Search by Email or User ID
        </label>
        <Input
          id="host-search"
          type="text"
          placeholder="user@example.com"
          onChange={(e) => setSearchName(e.target.value)}
        />
        {searchName && (
          <div className="mt-2 max-h-32 overflow-y-auto border rounded bg-white dark:bg-gray-800 shadow">
            {isSearching ? (
              <div className="px-3 py-2 text-gray-400 dark:text-gray-500 text-sm text-center">
                Searching...
              </div>
            ) : (filteredUsers as TUser[]).length > 0 ? (
              (filteredUsers as TUser[]).map((user) => (
                <SearchingResultAppear
                  key={user._id}
                  user={user}
                  setValue={setValue}
                  setSearchName={setSearchName}
                />
              ))
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
          htmlFor="userId"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          User ID
        </label>
        <Input type="text" {...register("userId")} readOnly />
        {errors.userId && (
          <p className="text-xs text-red-500 mt-1">{errors.userId.message}</p>
        )}
      </div>
      <div>
        <label
          htmlFor="permission"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Permission
        </label>
        <select
          {...register("permission")}
          className="w-full border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        >
          <option value="">Select permission</option>
          {PERMISSION_OPTIONS.map((perm) => (
            <option key={perm} value={perm}>
              {perm}
            </option>
          ))}
        </select>
        {errors.permission && (
          <p className="text-xs text-red-500 mt-1">
            {errors.permission.message}
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
          Create Host
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
    permission: string;
  }>;
  setSearchName: (name: string) => void;
}) => {
  return (
    <div
      className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-pink-50 dark:hover:bg-pink-900/20 text-sm"
      onClick={() => {
        setValue("userId", user._id);
        setSearchName(user.name);
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
