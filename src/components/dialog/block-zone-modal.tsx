import React from "react";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { useUpdateActivityZoneMutation } from "@/redux/api/admin/user-activities";
import { toast } from "sonner";

// Local SVG icon to avoid external CDN issues
const CalendarIconSVG = (props: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-4 w-4"
    {...props}
  >
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

// --- Inline BlockZoneModal to avoid import path issues ---
export function BlockZoneModal({ open, setOpen, liveId, liveTitle }: any) {
  const form = useForm({
    defaultValues: {
      zone: "",
      date_till: null,
    },
  });

  const [openCalendar, setOpenCalendar] = React.useState(false);
  const [updateActivityZone] = useUpdateActivityZoneMutation();
  const onSubmit = async (values: any) => {
    const dateVal = values.date_till
      ? values.date_till instanceof Date
        ? values.date_till.toISOString()
        : new Date(values.date_till).toISOString()
      : null;

    const payload = {
      id: liveId,
      zone: values.zone,
      date_till: dateVal,
    };

    try {
      const res = await updateActivityZone(payload).unwrap();
      console.log("API success:", res);

      // --------------------------------------------------
      // 🔥 TOAST MESSAGES BASED ON ZONE TYPE
      // --------------------------------------------------

      if (values.zone === "temp_block") {
        toast.warning(
          `User is temporarily banned until ${format(
            new Date(dateVal),
            "PPP",
          )}.`,
        );
      } else if (values.zone === "permanent_block") {
        toast.warning("User has been permanently banned.");
      }
      form.reset();
      setOpen(false);
    } catch (err) {
      console.error("API error:", err);
    }
    // Show payload in console (replace with API call as needed)
    console.log("Submit payload:", payload);

    // Reset form and close modal
    form.reset();
    setOpen(false);
  };

  return (
    <Dialog modal={false} open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Block Zone</DialogTitle>
        </DialogHeader>

        <div className="mb-2 text-sm text-gray-600">
          Blocking: <strong>{liveTitle || liveId}</strong>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="zone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Zone</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose zone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="temp_block">
                          Temporary Block
                        </SelectItem>
                        <SelectItem value="permanent_block">
                          Permanent Block
                        </SelectItem>
                        <SelectItem value="warning_zone">
                          Warning Zone
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date_till"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date Till</FormLabel>

                  <FormControl>
                    <Popover
                      modal={false}
                      open={openCalendar}
                      onOpenChange={setOpenCalendar}
                    >
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground",
                          )}
                          type="button"
                          onClick={() => setOpenCalendar(true)}
                        >
                          {field.value
                            ? format(
                                (field as any).value instanceof Date
                                  ? field.value
                                  : new Date(field.value),
                                "PPP",
                              )
                            : "Pick a date"}
                          <span className="ml-auto opacity-50">
                            <CalendarIconSVG />
                          </span>
                        </Button>
                      </PopoverTrigger>

                      <PopoverContent
                        align="start"
                        className="p-0"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Calendar
                          mode="single"
                          selected={field.value!}
                          onSelect={(date) => {
                            console.log("hello saju", date);
                            field.onChange(date);
                            setOpenCalendar(false);
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1">
                Confirm
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
