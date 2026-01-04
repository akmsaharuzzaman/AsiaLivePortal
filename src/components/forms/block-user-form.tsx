import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export const BlockUserForm = () => {
  return (
    <div className="space-y-4">
      <div>
        <label
          htmlFor="block-email"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Search by Email
        </label>
        <Input id="block-email" type="email" placeholder="user@example.com" />
      </div>
      <div className="flex items-center">
        <Checkbox id="kick-live" className="text-red-600" />
        <label htmlFor="kick-live" className="ml-2 text-sm text-gray-900 dark:text-gray-100">
          Kick from live room
        </label>
      </div>
      <div>
        <label
          htmlFor="block-duration"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Blocked Duration
        </label>
        <Select>
          <SelectTrigger className="mt-1 w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
            <SelectValue placeholder="Select duration" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1hour">1 Hour</SelectItem>
            <SelectItem value="24hours">24 Hours</SelectItem>
            <SelectItem value="7days">7 Days</SelectItem>
            <SelectItem value="permanent">Permanent</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button className="bg-red-500 text-white hover:bg-red-600">Block</Button>
    </div>
  );
};
