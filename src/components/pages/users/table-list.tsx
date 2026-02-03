import { Table } from "@/components/tables/table";
import { renderUserRow } from "./table-row";
import { useUpdateRoleMutation } from "@/redux/api/auth.api";
import { useState } from "react";
import { toast } from "sonner";

const ROLE_OPTIONS = [
  "admin",
  "sub-admin",
  "agency",
  "merchant",
  "re-seller",
];

export const UserTable = ({ data }: { data: any[] }) => {
  const [updateRole, { isLoading }] = useUpdateRoleMutation();
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);

  const handleRoleChange = async (userId: string, newRole: string) => {
    setUpdatingUserId(userId);
    try {
      await updateRole({ userId, newRole }).unwrap();
      toast.success("Role updated successfully!");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update role");
    } finally {
      setUpdatingUserId(null);
    }
  };

  return (
    <Table
      columns={[
        "User",
        "User ID",
        "Gender",
        "Country Language",
        "Coins / Diamonds",
        "Level",
        "Activity Zone",
        "Dates",
        // "Actions",
      ]}
      data={data}
      rowRenderer={user =>
        renderUserRow({
          user,
          roleOptions: ROLE_OPTIONS,
          onRoleChange: handleRoleChange,
          isUpdating: updatingUserId === user._id && isLoading,
        })
      }
    />
  );
};
