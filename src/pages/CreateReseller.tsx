import { CreateResellerForm } from "@/components/forms/create-reseller-form";
import { BackRouteHeader } from "@/components/shared/back-route-header";
import { useParams } from "react-router-dom";

type CreateResllerPageProps = {
  backRoute: string;
};
export const CreateResellerPage: React.FC<CreateResllerPageProps> = ({
  backRoute = "/",
}) => {
  const { merchantId } = useParams();
  console.log("merchantId", merchantId);
  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Create Reseller</h1>
        <BackRouteHeader backRoute={backRoute} />
      </div>
      <div className="space-y-4">
        <CreateResellerForm parentCreator={merchantId!} />
      </div>
    </div>
  );
};
