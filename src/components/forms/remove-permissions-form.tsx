// import { Button } from "../ui/button";
// import { Input } from "../ui/input";
// import { skipToken } from "@reduxjs/toolkit/query";
// import { useEffect, useState } from "react";
// import { zodResolver } from "@hookform/resolvers/zod";
// import z from "zod";
// import { useForm, UseFormSetValue } from "react-hook-form";
// import { toast } from "sonner";
// import { TUser } from "@/types/api/auth";
// import { useGetUsersQuery } from "@/redux/api/power-shared";
// import { useBlockUserByEmailMutation } from "@/redux/api/admin/blocked-emails";
// import { useRemovePermissionByUserIdMutation } from "@/redux/api/admin/user-activities";

// const removePermissionsSchema = z.object({
//   userId: z.string().min(1, "User ID is required"),
// });
// type RemovePermissionsFormValues = z.infer<typeof removePermissionsSchema>;

// export const RemovePermissionsForm = () => {
//   const [searchName, setSearchName] = useState("");
//   const [debouncedSearch, setDebouncedSearch] = useState("");

//   const [blockUserByEmail, { isLoading }] = useRemovePermissionByUserIdMutation();
//   // debounce search input
//   useEffect(() => {
//     const handler = setTimeout(() => {
//       setDebouncedSearch(searchName);
//     }, 400);
//     return () => clearTimeout(handler);
//   }, [searchName]);

//   // Use backend search for email
//   const { data: searchedUsers, isLoading: isSearching } = useGetUsersQuery(
//     debouncedSearch.length > 0
//       ? {
//           searchTerm: debouncedSearch,
//         }
//       : skipToken,
//   );

//   const filteredUsers =
//     debouncedSearch.length > 0 ? searchedUsers?.result?.users || [] : [];

//   const { register, handleSubmit, setValue, reset } =
//     useForm<RemovePermissionsFormValues>({
//       resolver: zodResolver(removePermissionsSchema),
//       defaultValues: { userId: "" },
//     });

//   const onSubmit = async (data: RemovePermissionsFormValues) => {
//     try {
//       const response = await blockUserByEmail({ email: data.userId }).unwrap();
//       toast.success(response.message || "User blocked successfully!");

//       setTimeout(() => {
//         // onClose();
//         // setSuccessMsg("");
//         reset();
//       }, 1500);
//     } catch (error: any) {
//       console.log(error);
//       toast.error(
//         error?.data?.message || "Failed to blocking user. Please try again.",
//       );
//       // setSuccessMsg("Failed to sell coins. Please try again.");
//     }
//   };
//   return (
//     <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//       <div>
//         <label
//           htmlFor="sell-userID"
//           className="block text-sm font-medium text-gray-700 dark:text-gray-300"
//         >
//           Search by User Name and Email
//         </label>
//         <Input
//           id="sell-email"
//           type="text"
//           placeholder="@saharu"
//           onChange={(e) => setSearchName(e.target.value)}
//         />
//         {searchName && (
//           <div className="mt-2 max-h-32 overflow-y-auto border rounded bg-white dark:bg-gray-800 shadow">
//             {isSearching ? (
//               <div className="px-3 py-2 text-gray-400 dark:text-gray-500 text-sm text-center">
//                 Searching...
//               </div>
//             ) : (filteredUsers as TUser[]).length > 0 ? ( // Todo: need to remove the type assertion
//               (filteredUsers as TUser[]).map(
//                 // Todo: need to remove the  type assertion
//                 (user) => (
//                   <SearchingResultAppear
//                     key={user._id}
//                     user={user}
//                     setValue={setValue}
//                     setSearchName={setSearchName}
//                   />
//                 ),
//               )
//             ) : (
//               <div className="px-3 py-2 text-gray-400 dark:text-gray-500 text-sm">
//                 No user found
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//       <div>
//         <label
//           htmlFor="sell-email"
//           className="block text-sm font-medium text-gray-700 dark:text-gray-300"
//         >
//           User ID
//         </label>
//         <Input type="text" {...register("userId")} disabled readOnly />
//       </div>

//       {isLoading ? (
//         <Button className="bg-red-500 text-white hover:bg-red-600" disabled>
//           Processing..
//         </Button>
//       ) : (
//         <Button
//           type="submit"
//           className="bg-red-500 text-white hover:bg-red-600"
//         >
//           Block
//         </Button>
//       )}
//     </form>
//   );
// };

// const SearchingResultAppear = ({
//   setSearchName,
//   setValue,
//   user,
// }: {
//   user: TUser;
//   setValue: UseFormSetValue<{
//     userId: string;
//   }>;
//   setSearchName: (name: string) => void;
// }) => {
//   return (
//     <div
//       className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-pink-50 dark:hover:bg-pink-900/20 text-sm"
//       onClick={() => {
//         setValue("userId", user._id);
//         setSearchName(user.name);
//         // setValue("userRole", user.userRole);
//       }}
//     >
//       {user.avatar ? (
//         <img
//           src={user.avatar}
//           alt={user.name}
//           className="w-8 h-8 rounded-full border border-gray-200 dark:border-gray-600 object-cover"
//         />
//       ) : (
//         <div className="w-8 h-8 rounded-full bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center text-pink-500 dark:text-pink-400 font-bold border border-gray-200 dark:border-gray-600">
//           {user.name?.charAt(0).toUpperCase()}
//         </div>
//       )}
//       <div className="flex flex-col">
//         <span className="font-medium text-gray-800 dark:text-gray-200">
//           {user.name}
//         </span>
//         <span className="text-xs text-gray-500 dark:text-gray-400">
//           {user.email}
//         </span>
//         <span className="text-xs text-gray-400 dark:text-gray-500">
//           ID: {user._id}
//         </span>
//       </div>
//     </div>
//   );
// };


"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "../ui/checkbox";
import { Permissions, Roles } from "@/constants/route.enum";
import { ActionTinyButton } from "../buttons/action-tiny-buttons";
import { useCreatePortalUserMutation } from "@/redux/api/auth.api";
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string().min(2, "Name is required"),
  userId: z.string().min(2, "Email/User ID is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  designation: z.string().min(2, "Designation is required"),
  // parentCreator: z.string().optional(),
  userRole: z.string().min(2, "User Role is required"),
  userPermissions: z.array(z.string()).optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function UpdatePermissionForm() {
  const [createPortalUser, { isLoading }] = useCreatePortalUserMutation();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      userId: "",
      password: "",
      designation: "",
      // parentCreator: "",
      userRole: Roles.SubAdmin,
      userPermissions: [],
    },
  });

  const onSubmit = async (values: FormValues) => {
    // TODO: integrate with API
    try {
      const body = {
        name: values.name.trim(),
        userId: values.userId.trim(),
        password: values.password.trim(),
        designation: values.designation.trim(),
        userRole: values.userRole,
        // parentCreator: values.parentCreator,
        userPermissions: values.userPermissions,
      };
      // if (values.parentCreator === "") {
      //   delete body.parentCreator;
      // }

      const res = await createPortalUser(body);
      if (res.error) {
        throw res.error;
      }
      toast.success(res?.data?.message || "Sub-admin created successfully");

      form.reset();
    } catch (error: any) {
      toast.error(
        error.data.message || error.message || "Failed to create sub admin",
      );
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="w-full mx-auto">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm"
          >
            {/* Full Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter full name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email/User ID */}
            <FormField
              control={form.control}
              name="userId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>User ID</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="User ID" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Designation */}
            <FormField
              control={form.control}
              name="designation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Designation</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter designation" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Parent Creator (Select) */}
            {/* <FormField
              control={form.control}
              name="parentCreator"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Parent Creator</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Skip parent creator" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="super-admin">Super Admin</SelectItem>
                      <SelectItem value="regional-admin">
                        Regional Admin
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            /> */}

            {/* User Role (disabled) */}
            {/* <FormField
              control={form.control}
              name="userRole"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>User Role</FormLabel>
                  <FormControl>
                    <Input disabled value={field.value} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */}

            {/* Permissions (full-width row) */}
            <div className="md:col-span-2">
              <FormField
                control={form.control}
                name="userPermissions"
                render={() => (
                  <FormItem>
                    <FormLabel>Permissions</FormLabel>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        {
                          id: Permissions.CoinDistribution,
                          label: "Allow to Coin Distribution",
                        },
                        {
                          id: Permissions.PromoteUser,
                          label: "Allow to Promote User",
                        },
                        {
                          id: Permissions.UpdateUser,
                          label: "Allow to Update User",
                        },
                        {
                          id: Permissions.BlockUser,
                          label: " Allow to Block User",
                        },
                        {
                          id: Permissions.DeviceBan,
                          label: "Allow to Ban Device",
                        },
                        {
                          id: Permissions.LiveRoomClose,
                          label: "Allow to Live Room Close",
                        },
                      ].map((perm) => (
                        <FormField
                          key={perm.id}
                          control={form.control}
                          name="userPermissions"
                          render={({ field }) => (
                            <FormItem className="flex items-center space-x-3 border p-3 rounded-md">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(perm.id)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([
                                          ...(field.value || []),
                                          perm.id,
                                        ])
                                      : field.onChange(
                                          field.value?.filter(
                                            (val) => val !== perm.id,
                                          ),
                                        );
                                  }}
                                />
                              </FormControl>
                              <span className="text-sm text-gray-700 dark:text-gray-300">
                                {perm.label}
                              </span>
                            </FormItem>
                          )}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Submit */}
            <div className="md:col-span-2">
              <ActionTinyButton
                type="submit"
                className="w-full md:w-auto"
                disabled={isLoading}
              >
                {isLoading ? "Creating..." : "Create Sub Admin"}
              </ActionTinyButton>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
