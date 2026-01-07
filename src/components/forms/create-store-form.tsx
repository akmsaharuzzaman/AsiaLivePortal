import { zodResolver } from "@hookform/resolvers/zod";
import React, { FormEvent, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import { ActionTinyButton } from "../buttons/action-tiny-buttons";
import { TCreateStoreBody, TStoreCategory } from "@/types/api/store";
import { useCreateStoreMutation } from "@/redux/api/store.api";
type CreateStoreFromProps = {
  onSave: (e?: FormEvent) => void;
  categories: TStoreCategory[];
  addCategory: any;
  createStoreCategoryLoading: boolean;
  getCategoryLoading: boolean;
};

const storeSchema = z.object({
  name: z.string().min(1, "Store name is required"),
  validity: z.string(),
  categoryId: z.string().min(1, "Category is required"),
  price: z.preprocess(
    (val) => Number(val),
    z.number().min(1, "Price required"),
  ),
  svgaFile: z.instanceof(File, { message: "SVGA image required" }),
});

export const CreateStoreFrom: React.FC<
  CreateStoreFromProps & {
    // onCreateGift?: (body: any) => void;
    isLoading?: boolean;
  }
> = ({
  onSave,
  categories,
  addCategory,
  getCategoryLoading,
  createStoreCategoryLoading,
}) => {
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [createStore, { isLoading }] = useCreateStoreMutation();

  const form = useForm({
    resolver: zodResolver(storeSchema),
    defaultValues: {
      name: "",
      validity: "",
      categoryId: "",
      price: "",
      svgaFile: undefined,
    },
  });

  // const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  //   if (e.target.value === "create_new") {
  //     setIsCreatingCategory(true);
  //   } else {
  //     form.setValue("category", e.target.value);
  //     setIsCreatingCategory(false);
  //   }
  // };

  const handleCreateCategory = async () => {
    try {
      if (newCategoryName.trim()) {
        const res = await addCategory({
          title: newCategoryName.trim(),
          isPremium: false,
        });
        toast.success(`${res?.result?.title} created successfully`);
        form.setValue("categoryId", res.result._id);
        setIsCreatingCategory(false);
        setNewCategoryName("");
      }
    } catch (err: any) {
      toast.error(err.data.message || "Caught error for creating category");
    }
  };

  const onSubmit = form.handleSubmit(async (values) => {
    // if (onCreateGift) {
    //   console.log("Hello")
    //   onCreateGift(values);
    // }
    try {
      if (!values.svgaFile) {
        toast.error("Please upload SVGA image.");
        return;
      }
      const payload: TCreateStoreBody = {
        name: values.name,
        validity: Number(values.validity),
        categoryId: form.getValues("categoryId"),
        price: Number(values.price),
        svgaFile: values.svgaFile,
      };

      const response = await createStore(payload).unwrap();
      toast.success(response.message);
      setTimeout(() => {
        onSave();
        form.reset();
      }, 1500);
    } catch (error: any) {
      toast.error(
        error?.data?.message || "Failed to create store. Please try again.",
      );
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Gift Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="e.g., Golden Crown" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                <Select
                  value={field.value}
                  onValueChange={(value) => {
                    if (value === "create_new") {
                      setIsCreatingCategory(true);
                    } else {
                      field.onChange(value);
                      setIsCreatingCategory(false);
                    }
                  }}
                >
                  <SelectTrigger className="flex-grow">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {getCategoryLoading ? (
                      <SelectItem value={""}>Please wait...</SelectItem>
                    ) : (
                      categories?.map((cat) => (
                        <SelectItem key={cat._id} value={cat?._id}>
                          {cat?.title}
                        </SelectItem>
                      ))
                    )}
                    <SelectItem value="create_new">
                      + Create New Category
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {isCreatingCategory && (
          <div className="flex gap-2 mt-2">
            <Input
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="New category name"
            />
            <Button
              type="button"
              onClick={handleCreateCategory}
              disabled={createStoreCategoryLoading}
            >
              {createStoreCategoryLoading ? "Wait.." : "Add"}
            </Button>
          </div>
        )}
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="validity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Diamonds</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    value={field.value ? String(field.value) : ""}
                    onChange={(e) => field.onChange(e.target.value)}
                    placeholder="500"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Coin Price</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    value={field.value ? String(field.value) : ""}
                    onChange={(e) => field.onChange(e.target.value)}
                    placeholder="1000"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="svgaFile"
          render={({ field }) => (
            <FormItem>
              <FormLabel>SVGA Image</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept=".svga"
                  onChange={(e) => field.onChange(e.target.files?.[0])}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="secondary" onClick={onSave}>
            Cancel
          </Button>
          <ActionTinyButton type="submit" variant="info" disabled={isLoading}>
            {isLoading ? "Creating..." : "Create Store"}
          </ActionTinyButton>
        </div>
      </form>
    </Form>
  );
};
