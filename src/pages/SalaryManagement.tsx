import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Trash } from "lucide-react";
import { CreateSalaryForm } from "@/components/forms/create-salary-form";
import {
  useAgencySalaryAutoDistributeMutation,
  useDeleteSalaryMutation,
  useGetSalariesQuery,
} from "@/redux/api/salaries.api";
import { toast } from "sonner";
import { ActionTinyButton } from "@/components/buttons/action-tiny-buttons";

// -------------------- Schema --------------------
const formSchema = z.object({
  diamondCount: z
    .number({ message: "Diamond count is required" })
    .min(1)
    .optional(),
  moneyCount: z
    .number({ message: "Money count is required" })
    .min(1)
    .optional(),
  type: z.string().min(2, "Type is required").optional(),
  country: z.string().min(2, "Country is required").optional(),
});

type FormValues = z.infer<typeof formSchema>;

// Mock Data for Salary List

export default function SalaryManagementPage() {
  // const [salaries, setSalaries] = useState(initialSalaries);
  const [open, setOpen] = useState(false);
  const [editingSalary, setEditingSalary] = useState<
    (FormValues & { _id: string }) | null
  >(null);
  const { data: salariesRes, isLoading: salariesLoading } =
    useGetSalariesQuery(undefined);

  // RTK: endpoint cathicng ro deleting salary by salary id
  const [deleteSalary, { isLoading: salaryDeleteLoading }] =
    useDeleteSalaryMutation();
  // RTK: endpoint for auto distribution at a time period manually
  const [agencySalaryAutoDistribute, { isLoading: autoDistributionLoading }] =
    useAgencySalaryAutoDistributeMutation();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      diamondCount: 0,
      moneyCount: 0,
      // type: "",
      country: "",
    },
  });

  if (salariesLoading) {
    return (
      <h4 className="text-gray-900 dark:text-gray-100">
        Please wait for salaries...
      </h4>
    );
  }
  const salaries = salariesRes?.result;
  // const salaries = [
  //   {
  //     _id: "5454474",
  //     diamondCount: 1,
  //     moneyCount: 10,
  //     country: "BDT",
  //   },
  // ];

  // const handleEdit = (salary: FormValues & { _id: string }) => {
  //   setEditingSalary(salary);
  //   form.reset(salary);
  //   setOpen(true);
  // };

  const handleUpdate = (values: FormValues) => {
    console.log(values);
    if (editingSalary) {
      // const updated = salaries.map((s) =>
      //   s._id === editingSalary._id ? { ...s, ...values } : s,
      // );
      // setSalaries(updated);
      setOpen(false);
      setEditingSalary(null);
    }
  };
  const handleDelete = async (salaryId: string) => {
    try {
      const res = await deleteSalary({ salaryId }).unwrap();
      toast.success(res.message || "salary deleted");
    } catch (error: any) {
      toast.error(
        error.message || error.data.message || "salary cannot delete",
      );
    }
  };

  const handleAutoDistribution = async () => {
    try {
      const res = await agencySalaryAutoDistribute({}).unwrap();
      const message = `Salary Distributed: Total: ${res?.result?.total}, Paid: ${res?.result?.paid}, Success Rate: ${res?.result?.successRate}%`;

      if (res.success) {
        toast.success(message || res?.message || "auto distributed salaries");
      } else {
        toast.success(res?.message || "auto distributed salaries");
      }
    } catch (err: any) {
      console.log(err);
      toast.error(err.message || err.data.message || "something went wrong!");
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 dark:bg-transparent px-6 py-10 text-gray-900 dark:text-gray-100">
      <div className="max-w-5xl mx-auto space-y-10">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Salary Management
          </h1>
          <ActionTinyButton
            disabled={autoDistributionLoading}
            onClick={handleAutoDistribution}
            variant={autoDistributionLoading ? "secondary" : "primary"}
          >
            Auto Distribute Salary
          </ActionTinyButton>
        </div>

        {/* Form Card */}
        <Card>
          <CardHeader>
            <CardTitle>Create Salary</CardTitle>
          </CardHeader>
          <CardContent>
            <CreateSalaryForm />
          </CardContent>
        </Card>

        {/* Salary List Table */}
        <Card>
          <CardHeader>
            <CardTitle>Salary List</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Diamond Count</TableHead>
                  <TableHead>Money Count</TableHead>
                  {/*<TableHead>Type</TableHead>*/}
                  <TableHead>Country</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {salaries!.map((salary) => (
                  <TableRow key={salary._id}>
                    <TableCell>{salary.diamondCount}</TableCell>
                    <TableCell>{salary.moneyCount}</TableCell>
                    {/*<TableCell>{salary.type}</TableCell>*/}
                    <TableCell>{salary.country}</TableCell>
                    <TableCell className="text-right flex justify-end gap-x-1">
                      {/*<Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(salary)}
                      >
                        <Pencil className="h-4 w-4 mr-1" /> Edit
                      </Button>*/}
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(salary._id)}
                        disabled={salaryDeleteLoading}
                      >
                        {salaryDeleteLoading ? (
                          "Deleting..."
                        ) : (
                          <>
                            <Trash className="h-4 w-4 mr-1" /> Delete
                          </>
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Edit Salary Modal */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Update Salary</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleUpdate)}
                className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4"
              >
                <FormField
                  control={form.control}
                  name="diamondCount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Diamond Count</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter diamond count"
                          {...field}
                          value={field.value || ""}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="moneyCount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Money Count</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter money count"
                          {...field}
                          value={field.value || ""}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., video/live" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., USD, EUR" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="md:col-span-2 flex justify-end">
                  <Button type="submit">Update</Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
