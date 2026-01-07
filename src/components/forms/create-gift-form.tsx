import { useCreateGiftMutation } from "@/redux/api/gift.api";
import { TCreateGiftBody } from "@/types/api/gift";
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
type CreateGiftFormProps = {
  onSave: (e?: FormEvent) => void;
  categories: string[];
  addCategory: (cat: string) => void;
  getCategoryLoading: boolean;
};

const giftSchema = z.object({
  giftName: z.string().min(1, "Gift name is required"),
  category: z.string().min(1, "Category is required"),
  diamonds: z.preprocess((val) => Number(val), z.number().min(1, "Diamonds required")),
  coinPrice: z.preprocess((val) => Number(val), z.number().min(1, "Coin price required")),
  previewImage: z.instanceof(File, { message: "Preview image required" }),
  svgaImage: z.instanceof(File, { message: "SVGA image required" }),
});


export const CreateGiftForm: React.FC<
  CreateGiftFormProps & {
    // onCreateGift?: (body: any) => void;
    isLoading?: boolean;
  }
> = ({ onSave, categories, addCategory, getCategoryLoading }) => {
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [createGift, { isLoading }] = useCreateGiftMutation();

  const form = useForm({
    resolver: zodResolver(giftSchema),
    defaultValues: {
      giftName: "",
      category: "",
      diamonds: "",
      coinPrice: "",
      previewImage: undefined,
      svgaImage: undefined,
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

  const handleCreateCategory = () => {
    if (newCategoryName.trim()) {
      addCategory(newCategoryName.trim());
      form.setValue("category", newCategoryName.trim());
      setIsCreatingCategory(false);
      setNewCategoryName("");
    }
  };

  const onSubmit = form.handleSubmit(async (values) => {
    // if (onCreateGift) {
    //   console.log("Hello")
    //   onCreateGift(values);
    // }
    try {
      if (!values.previewImage || !values.svgaImage) {
        toast.error("Please upload both preview and SVGA images.");
        return;
      }
      const payload: TCreateGiftBody = {
        giftName: values.giftName,
        category: values.category,
        coinPrice: values.coinPrice,
        diamonds: values.diamonds,
        previewImage: values.previewImage,
        svgaImage: values.svgaImage,
      };

      const response = await createGift(payload).unwrap();

      toast.success(response.message);
      setTimeout(() => {
        onSave();
        form.reset();
      }, 1500);
    } catch (error: any) {
      toast.error(
        error?.data?.message || "Failed to create gift. Please try again."
      );
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-4">
        <FormField
          control={form.control}
          name="giftName"
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
          name="category"
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
                      <SelectItem value={""}>
                          Please wait...
                        </SelectItem>
                    ) : (
                      categories?.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
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
            <Button type="button" onClick={handleCreateCategory}>
              Add
            </Button>
          </div>
        )}
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="diamonds"
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
            name="coinPrice"
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
          name="previewImage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Preview Image</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => field.onChange(e.target.files?.[0])}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="svgaImage"
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
            {isLoading ? "Creating..." : "Create Gift"}
          </ActionTinyButton>
        </div>
      </form>
    </Form>
  );
};
