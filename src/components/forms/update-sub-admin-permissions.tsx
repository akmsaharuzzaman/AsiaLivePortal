"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "../ui/checkbox";
import { Permissions } from "@/constants/route.enum";
import { ActionTinyButton } from "../buttons/action-tiny-buttons";
import { useGetSubAdminsQuery } from "@/redux/api/power-shared";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import {  useUpdatePermissionByIdMutation } from "@/redux/api/admin/user-activities";
import { Loader } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const formSchema = z.object({
  subAdminId: z.string().min(1, "Please select a sub-admin"),
  userPermissions: z.array(z.string()).optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function UpdateSubAdminPermissions() {
  const [selectedAdmin, setSelectedAdmin] = useState<any>(null);
  const { data: subAdminRes } = useGetSubAdminsQuery({});
  const subAdmins = subAdminRes?.result?.data || [];
  const [updatePermissionById, {isLoading: isUpdatePermission}]= useUpdatePermissionByIdMutation()
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subAdminId: "",
      userPermissions: [],
    },
  });

  // Update form when a sub-admin is selected
  useEffect(() => {
    const subAdminId = form.watch("subAdminId");
    const admin = subAdmins.find((a: any) => a._id === subAdminId);
    if (admin) {
      setSelectedAdmin(admin);
      form.setValue("userPermissions", admin.userPermissions || []);
    }
  }, [form.watch("subAdminId"), subAdmins]);

  const onSubmit = async (values: FormValues) => {
    try {
      // TODO: integrate with API
      const res = await updatePermissionById({
        userId: values.subAdminId,
        permissions: values.userPermissions || [],
      }).unwrap()
      console.log("Updated permissions:", values);
      toast.success(res?.message || "Permissions updated successfully");
      
      // Reset form after success
      setTimeout(() => {
        form.reset();
        setSelectedAdmin(null);
      }, 1500);
    } catch (error: any) {
      toast.error(
        error?.data?.message || error?.message || "Failed to update permissions",
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
            {/* Sub-Admin Selection */}
            <div className="md:col-span-2">
              <FormField
                control={form.control}
                name="subAdminId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select Sub-Admin</FormLabel>
                            <FormControl>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <button className="w-full text-left px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 flex items-center justify-between">
                                    <span>{subAdmins.find((a: any) => a._id === field.value)?.name || "-- Select a Sub-Admin --"}</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.06z" clipRule="evenodd"/></svg>
                                  </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                  {subAdmins.length === 0 && <div className="px-3 py-2 text-sm text-gray-500">No sub-admins</div>}
                                  {subAdmins.map((admin: any) => (
                                    <DropdownMenuItem
                                      key={admin._id}
                                      className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700"
                                      onClick={() => field.onChange(admin._id)}
                                    >
                                      <Avatar className="h-8 w-8">
                                        {admin.avatar ? (
                                          <AvatarImage src={admin.avatar} alt={admin.name} />
                                        ) : (
                                          <AvatarFallback>{(admin.name || " ").charAt(0).toUpperCase()}</AvatarFallback>
                                        )}
                                      </Avatar>
                                      <div className="flex-1 min-w-0">
                                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{admin.name}</div>
                                        <div className="text-xs text-gray-500 truncate">{admin.email}</div>
                                      </div>
                                    </DropdownMenuItem>
                                  ))}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Selected Admin Details */}
            {selectedAdmin && (
              <div className="md:col-span-2 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Name
                    </p>
                    <p className="text-gray-900 dark:text-gray-100">
                      {selectedAdmin.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Role
                    </p>
                    <p className="text-gray-900 dark:text-gray-100">
                      {selectedAdmin.userRole || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Designation
                    </p>
                    <p className="text-gray-900 dark:text-gray-100">
                      {selectedAdmin.designation || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      UID
                    </p>
                    <p className="text-gray-900 dark:text-gray-100">
                      <b>{selectedAdmin.userId} </b>
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Permissions (full-width row) */}
            {selectedAdmin && (
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
                            label: "Allow to Block User",
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
                              <FormItem className="flex items-center space-x-3 border p-3 rounded-md dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
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
            )}

            {/* Submit */}
            {selectedAdmin && (
              <div className="md:col-span-2">
                <ActionTinyButton
                  type="submit"
                  className="w-full md:w-auto"
                  disabled={isUpdatePermission}
                >
                    {isUpdatePermission ? <><Loader className="animate-spin" /> "Updating..." </>: "Update Permissions"}
                </ActionTinyButton>
              </div>
            )}
          </form>
        </Form>
      </div>
    </div>
  );
}
