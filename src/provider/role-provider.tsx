import { selectUser } from "@/redux/features/auth.slice";
import { useAppSelector } from "@/redux/hooks";
import { Role } from "@/types/pages/dashboard";
import { createContext, ReactNode, useState } from "react";

interface RoleContextType {
  role: Role;
  setRole: (role: Role) => void;
}

export const RoleContext = createContext<RoleContextType | undefined>(
  undefined
);

export const RoleProvider = ({ children }: { children: ReactNode }) => {
  const user = useAppSelector(selectUser);
  const [role, setRole] = useState<Role>(user?.role as Role);
  return (
    <RoleContext.Provider value={{ role, setRole }}>
      {children}
    </RoleContext.Provider>
  );
};
