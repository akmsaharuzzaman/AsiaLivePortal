"use client";

import React, { useEffect, useState } from "react";
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
  const [alt, setAlt] = useState(initial?.alt || "");
  const [progress, setProgress] = useState<number>(0);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "create" && !file) return toast.error("Please select an image");
    try {
      const form = new FormData();
      if (file) form.append("image", file);
      if (alt) form.append("alt", alt);

      if (mode === "create") {
        const res: any = await createBanner(form).unwrap();
        toast.success(res?.message || "Banner created");
        onSuccess && onSuccess();
      } else if (mode === "update" && initial?._id) {
        await updateBanner({ id: initial._id, body: form }).unwrap();
        toast.success("Banner updated");
        onSuccess && onSuccess();
      }
    } catch (err: any) {
      toast.error(err?.data?.message || err?.message || "Operation failed");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 bg-white dark:bg-gray-800 p-6 rounded-lg">
      <Form>
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
            <img src={preview} alt={alt || "preview"} className="object-cover w-full h-full" />
          </div>
        )}

        <div>
          <FormItem>
            <FormLabel>Alt Text</FormLabel>
            <FormControl>
              <Input value={alt} onChange={(e) => setAlt(e.target.value)} placeholder="Alt text for the image" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </div>

        <div className="flex items-center gap-3">
          <ActionTinyButton type="submit" disabled={isCreating || isUpdating}>
            {mode === "create" ? (isCreating ? "Uploading..." : "Create Banner") : isUpdating ? "Updating..." : "Update Banner"}
          </ActionTinyButton>
        </div>
      </Form>
    </form>
  );
};

export default CreateUpdateBannerForm;
