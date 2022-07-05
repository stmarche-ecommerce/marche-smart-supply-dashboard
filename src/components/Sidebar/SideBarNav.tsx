import { Stack, useBreakpointValue } from "@chakra-ui/react";
import {
  RiContactsLine,
  RiDashboardLine,
  RiGitMergeLine,
  RiInputMethodLine,
} from "react-icons/ri";
import { ToggleThemeButton } from "../Header/ToggleThemeButton";
import { Can } from "../Permissions/Can";
import NavLink from "./NavLink";
import { NavSection } from "./NavSection";

export function SideBarNav() {
  const isWideVersion = useBreakpointValue({
    base: false,
    lg: true,
  });

  return (
    <Stack spacing="12" align="flex-start">
      <NavSection title="GERAL">
        <NavLink href="/dashboard" icon={RiDashboardLine}>
          Dashboard
        </NavLink>
        <Can permissions={["list_users"]}>
          <NavLink href="/users" icon={RiContactsLine}>
            Usuários
          </NavLink>
        </Can>
      </NavSection>

      <NavSection title="ENGENHARIA">
        <NavLink href="#" icon={RiInputMethodLine}>
          Formulários
        </NavLink>
        <NavLink href="#" icon={RiGitMergeLine}>
          Engenharia
        </NavLink>
      </NavSection>
      {!isWideVersion && <ToggleThemeButton />}
    </Stack>
  );
}
