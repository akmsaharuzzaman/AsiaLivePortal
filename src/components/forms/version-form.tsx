"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ActionTinyButton } from "@/components/buttons/action-tiny-buttons";
import { toast } from "sonner";

const schema = z.object({
  version: z.string().min(1, "Version is required"),
  minimumVersion: z.string().min(1, "Minimum version is required"),
  DownloadURL: z.string().url("Must be a valid URL"),
  Release_note: z.string().min(1, "Release note is required"),
});

type FormValues = z.infer<typeof schema>;

type Props = {
  initial?: Partial<FormValues>;
  onSubmit: (values: FormValues) => Promise<void> | void;
  submitLabel?: string;
  loading?: boolean;
};

export const VersionForm: React.FC<Props> = ({ initial, onSubmit, submitLabel = "Save", loading = false }) => {
  const form = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { version: initial?.version || "", minimumVersion: initial?.minimumVersion || "", DownloadURL: initial?.DownloadURL || "", Release_note: initial?.Release_note || "" } });

  const handle = async (values: FormValues) => {
    try {
      await onSubmit(values);
    } catch (err: any) {
      toast.error(err?.data?.message || err?.message || "Failed to save");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handle)} className="grid grid-cols-1 gap-4 bg-white dark:bg-gray-800 p-6 rounded-lg">
        <FormField control={form.control} name="version" render={({ field }) => (
          <FormItem>
            <FormLabel>Version</FormLabel>
            <FormControl>
              <Input {...field} placeholder="1.0.0" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name="minimumVersion" render={({ field }) => (
          <FormItem>
            <FormLabel>Minimum Supported Version</FormLabel>
            <FormControl>
              <Input {...field} placeholder="0.9.0" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name="DownloadURL" render={({ field }) => (
          <FormItem>
            <FormLabel>Download URL</FormLabel>
            <FormControl>
              <Input {...field} placeholder="https://example.com/app.apk" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name="Release_note" render={({ field }) => (
          <FormItem>
            <FormLabel>Release Note</FormLabel>
            <FormControl>
              <textarea {...field} className="w-full min-h-[120px] rounded-md border border-input bg-background px-3 py-2 text-sm" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <div className="flex justify-end">
          <ActionTinyButton type="submit" disabled={loading}>{loading ? "Saving..." : submitLabel}</ActionTinyButton>
        </div>
      </form>
    </Form>
  );
};

export default VersionForm;
