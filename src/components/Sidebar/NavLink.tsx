import {
  Text,
  Link as ChakraLink,
  Icon,
  LinkProps as ChakraLinkProps,
} from "@chakra-ui/react";
import { IconType } from "react-icons";
import { ActiveLink } from "./ActiveLink";

interface NavLinkProps extends ChakraLinkProps {
  icon: IconType;
  children: string;
  href: string;
}

export default function NavLink({
  icon,
  children,
  href,
  ...rest
}: NavLinkProps) {
  return (
    <ActiveLink href={href} passHref>
      <ChakraLink display="flex" alignContent="center" {...rest}>
        <Icon as={icon} fontSize={20}></Icon>
        <Text ml={4} fontWeight="medium">
          {children}
        </Text>
      </ChakraLink>
    </ActiveLink>
  );
}
