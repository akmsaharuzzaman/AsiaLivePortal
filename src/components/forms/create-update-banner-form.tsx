"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ActionTinyButton } from "@/components/buttons/action-tiny-buttons";
import { useCreateBannerMutation, useUpdateBannerMutation } from "@/redux/api/admin/banners";
import { toast } from "sonner";

type Props = {
  initial?: any;
  onSuccess?: () => void;
  mode?: "create" | "update";
};

export const CreateUpdateBannerForm: React.FC<Props> = ({ initial, onSuccess, mode = "create" }) => {
  const [preview, setPreview] = useState<string | null>(initial?.image || null);
  const [file, setFile] = useState<File | null>(null);

  type BannerFormValues = { alt: string };
  const form = useForm<BannerFormValues>({
    defaultValues: { alt: initial?.alt || "" },
  });

  const [createBanner, { isLoading: isCreating }] = useCreateBannerMutation();
  const [updateBanner, { isLoading: isUpdating }] = useUpdateBannerMutation();

  useEffect(() => {
    return () => {
      if (preview && initial?.image !== preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview, initial]);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    setFile(f);
    if (f) setPreview(URL.createObjectURL(f));
  };

  const onSubmit = async (values: BannerFormValues) => {
    if (mode === "create" && !file) return toast.error("Please select an image");
    try {
      const body = new FormData();
      if (file) body.append("image", file);
      if (values.alt) body.append("alt", values.alt);

      if (mode === "create") {
        const res: any = await createBanner(body).unwrap();
        toast.success(res?.message || "Banner created");
        onSuccess && onSuccess();
      } else if (mode === "update" && initial?._id) {
        await updateBanner({ id: initial._id, body }).unwrap();
        toast.success("Banner updated");
        onSuccess && onSuccess();
      }
    } catch (err: any) {
      toast.error(err?.data?.message || err?.message || "Operation failed");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 gap-4 bg-white dark:bg-gray-800 p-6 rounded-lg">
        <div>
          <FormItem>
            <FormLabel>Image</FormLabel>
            <FormControl>
              <input type="file" accept="image/*" onChange={onFileChange} />
            </FormControl>
            <FormMessage />
          </FormItem>
        </div>

        {preview && (
          <div className="w-full h-48 bg-gray-100 dark:bg-gray-700 rounded overflow-hidden">
            <img src={preview} alt={(form.getValues("alt") as string) || "preview"} className="object-cover w-full h-full" />
          </div>
        )}

        <div>
          <FormField
            control={form.control}
            name="alt"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Alt Text</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Alt text for the image" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex items-center gap-3">
          <ActionTinyButton type="submit" disabled={isCreating || isUpdating}>
            {mode === "create" ? (isCreating ? "Uploading..." : "Create Banner") : isUpdating ? "Updating..." : "Update Banner"}
          </ActionTinyButton>
        </div>
      </form>
    </Form>
  );
};

export default CreateUpdateBannerForm;
