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
              <label className="relative block w-full rounded border-2 border-dashed border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 py-8 text-center cursor-pointer hover:border-gray-300">
                <input type="file" accept="image/*" onChange={onFileChange} className="sr-only" />
                <div className="flex flex-col items-center justify-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16V8a4 4 0 014-4h2a4 4 0 014 4v8m-9 0h10" />
                  </svg>
                  <div className="text-sm text-gray-500">Click to upload or drag and drop</div>
                  <div className="text-xs text-muted-foreground">PNG, JPG, GIF up to 5MB</div>
                </div>
              </label>
            </FormControl>
            <FormMessage />
          </FormItem>
        </div>

        <div>
          {preview ? (
            <div className="relative w-full h-48 rounded overflow-hidden border bg-gray-50 dark:bg-gray-700">
              <img src={preview} alt={(form.getValues("alt") as string) || "preview"} className="object-cover w-full h-full" />
              <div className="absolute top-2 right-2 flex gap-2">
                <button type="button" onClick={() => { setFile(null); setPreview(null); }} className="inline-flex items-center px-3 py-1 text-sm bg-white/80 dark:bg-black/40 rounded-md">Remove</button>
                <label className="inline-flex items-center px-3 py-1 text-sm bg-white/80 dark:bg-black/40 rounded-md cursor-pointer">
                  Replace
                  <input type="file" accept="image/*" onChange={onFileChange} className="sr-only" />
                </label>
              </div>
            </div>
          ) : null}
        </div>

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
