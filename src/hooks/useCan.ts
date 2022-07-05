import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

type UseCanParams = {
  permissions?: string[];
};

export function useCan({ permissions }: UseCanParams) {
  const { user, isAuthenticated } = useContext(AuthContext);

  if (!isAuthenticated) {
    return false;
  }

  if (user?.role === "ADMIN") {
    return true;
  }

  if (permissions.length > 0) {
    const parsedUserPermissions = user?.permissions?.map(
      (permission) => permission.name
    );

    const hasAllPermissions = permissions.every((permission) => {
      return parsedUserPermissions?.includes(permission);
    });

    if (!hasAllPermissions) {
      return false;
    }
  }

  return true;
}
