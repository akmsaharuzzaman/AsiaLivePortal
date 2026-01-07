"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Permissions, Roles } from "@/constants/route.enum";
import { ActionTinyButton } from "../buttons/action-tiny-buttons";
import { useCreatePortalUserMutation } from "@/redux/api/auth.api";
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string().min(2, "Name is required"),
  userId: z.string().min(2, "Email/User ID is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  designation: z.string().min(2, "Designation is required"),
  parentCreator: z.string().optional(),
  userRole: z.string().min(2, "User Role is required"),
  userPermissions: z.array(z.string()).optional(),
});

type FormValues = z.infer<typeof formSchema>;

// TODO: change the directive name of "Merchant"
export function CreateAgencyForm({ parentCreator }: { parentCreator: string }) {
  const [createPortalUser, { isLoading }] = useCreatePortalUserMutation();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      userId: "",
      password: "",
      designation: "",
      parentCreator: parentCreator || "",
      userRole: Roles.Agency,
      userPermissions: [],
    },
  });

  if (!parentCreator) {
    return <div>Parent Creator is required</div>;
  }
  const onSubmit = async (values: FormValues) => {
    // TODO: integrate with API
    try {
      const body = {
        name: values.name.trim(),
        userId: values.userId.trim(),
        password: values.password.trim(),
        designation: values.designation.trim(),
        userRole: values.userRole.trim(),
        parentCreator: values.parentCreator,
        userPermissions: [Permissions.PromoteUser],
      };
      if (values.parentCreator === "") {
        delete body.parentCreator;
      }

      const res = await createPortalUser(body);
      if (res.error) {
        throw res.error;
      }
      // TODO: change the directive name of "Merchant"
      toast.success(res?.data?.message || "Merchant created successfully");

      form.reset();
    } catch (error: any) {
      // TODO: change the directive name of "Merchant"

      toast.error(
        error.data.message || error.message || "Failed to create merchant",
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
            <FormField
              control={form.control}
              name="parentCreator"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Parent Creator</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                    disabled={!!parentCreator} // Disable if parentCreator is provided
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select parent creator" />
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
            />

            {/* User Role (disabled) */}
            <FormField
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
            />

            {/* Permissions (full-width row) */}
            {/* <div className="md:col-span-2">
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
                                            (val) => val !== perm.id
                                          )
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
            </div> */}

            {/* Submit */}
            <div className="md:col-span-2">
              <ActionTinyButton
                type="submit"
                className="w-full md:w-auto"
                disabled={isLoading}
              >
                {/* TODO: change the directive name of "Merchant" */}

                {isLoading ? "Creating..." : "Create Agency"}
              </ActionTinyButton>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
