import { Button } from "../ui/button";
import { Input } from "../ui/input";

export const RemoveHostForm = () => {
  return (
    <div className="space-y-4">
      <div>
        <label
          htmlFor="remove-host-email"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Search by Email
        </label>
        <Input
          id="remove-host-email"
          type="email"
          placeholder="host@example.com"
        />
      </div>
      <Button className="bg-red-500 text-white hover:bg-red-600">
        Remove
      </Button>
    </div>
  );
};
