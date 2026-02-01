import { IApp_LinkedButtonProps } from "@/types/buttons";
import { ModalName } from "@/types/pages/dashboard";
import { ActionGroupHead } from "./action-group-head";
import { AppButton, LinkedButton } from "@/components/buttons";

// Dashboard action button config
interface DashboardAction {
  label: string;
  category: string;
  icon: any;
  variant?: IApp_LinkedButtonProps["variant"];
  modal?: ModalName;
  link?: string;
}

export const DashboardActionItems = ({
  actions = [],
  openModal,
}: {
  actions: DashboardAction[];
  openModal: any;
}) => {
  const coins = actions?.filter((a) => a.category === "coins");
  const management = actions?.filter((a) => a.category === "management");
  const tools = actions?.filter((a) => a.category === "tools");
  const history = actions?.filter((a) => a.category === "history");
  const diamondWithdrawals = actions?.filter(
    (a) => a.category === "diamond-withdrawals",
  );

  return (
    <section className="flex-grow p-4 w-full space-y-8">
      <section className="bg-surface-light dark:bg-surface-dark p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
          <span className="w-1.5 h-6 bg-gradient-to-b from-sky-400 to-blue-600 rounded-full mr-3"></span>
          Quick Actions
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {coins.length > 0 && (
            <ActionGroupHead title="Finance & Coins">
              {coins.map((item) => {
                if (item.link) {
                  return (
                    <LinkedButton
                      label={item.label}
                      icon={item.icon}
                      variant={item.variant}
                      link={item.link}
                    />
                  );
                }
                return (
                  <AppButton
                    label={item.label}
                    icon={item.icon}
                    variant={item.variant}
                    onClick={() => openModal(item.modal)}
                  />
                );
              })}
            </ActionGroupHead>
          )}

          {management.length > 0 && (
            <ActionGroupHead title="Management">
              {management.map((item) => {
                if (item.link) {
                  return (
                    <LinkedButton
                      label={item.label}
                      icon={item.icon}
                      variant={item.variant}
                      link={item.link}
                    />
                  );
                }
                return (
                  <AppButton
                    label={item.label}
                    icon={item.icon}
                    variant={item.variant}
                    onClick={() => openModal(item.modal)}
                  />
                );
              })}
            </ActionGroupHead>
          )}

          {history.length > 0 && (
            <ActionGroupHead title="History">
              {history.map((item) => {
                if (item.link) {
                  return (
                    <LinkedButton
                      label={item.label}
                      icon={item.icon}
                      variant={item.variant}
                      link={item.link}
                    />
                  );
                }
                return (
                  <AppButton
                    label={item.label}
                    icon={item.icon}
                    variant={item.variant}
                    onClick={() => openModal(item.modal)}
                  />
                );
              })}
            </ActionGroupHead>
          )}

          {tools.length > 0 && (
            <ActionGroupHead title="Admin Tools">
              {tools.map((item) => {
                if (item.link) {
                  return (
                    <LinkedButton
                      label={item.label}
                      icon={item.icon}
                      variant={item.variant}
                      link={item.link}
                    />
                  );
                }
                return (
                  <AppButton
                    label={item.label}
                    icon={item.icon}
                    variant={item.variant}
                    onClick={() => openModal(item.modal)}
                  />
                );
              })}
            </ActionGroupHead>
          )}
          {diamondWithdrawals.length > 0 && (
            <ActionGroupHead title="Bank Withdrawals">
              {diamondWithdrawals.map((item) => {
                if (item.link) {
                  return (
                    <LinkedButton
                      label={item.label}
                      icon={item.icon}
                      variant={item.variant}
                      link={item.link}
                    />
                  );
                }
                return (
                  <AppButton
                    label={item.label}
                    icon={item.icon}
                    variant={item.variant}
                    onClick={() => openModal(item.modal)}
                  />
                );
              })}
            </ActionGroupHead>
          )}
        </div>
      </section>
    </section>
  );
};
