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
                      <select
                        {...field}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">-- Select a Sub-Admin --</option>
                        {subAdmins.map((admin: any) => (
                          <option key={admin._id} value={admin._id}>
                            {admin.name} ({admin.email})
                          </option>
                        ))}
                      </select>
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
                      Email
                    </p>
                    <p className="text-gray-900 dark:text-gray-100">
                      {selectedAdmin.email}
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
                      {selectedAdmin.uid}
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
