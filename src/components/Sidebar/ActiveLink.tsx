import { useColorModeValue } from "@chakra-ui/react";
import Link, { LinkProps } from "next/link";
import { useRouter } from "next/router";
import { cloneElement, ReactElement } from "react";

interface ActiveLinkProps extends LinkProps {
  children: ReactElement;
}

export function ActiveLink({ children, ...rest }: ActiveLinkProps) {
  const { asPath } = useRouter();
  let isActive = false;

  if (asPath === rest.href || asPath == rest.as) {
    isActive = true;
  }

  if (asPath === rest.href || asPath == rest.as) {
    isActive = true;
  }

  if (
    asPath.startsWith(String(rest.href)) ||
    asPath.startsWith(String(rest.as))
  ) {
    isActive = true;
  }

  const color = useColorModeValue('gray.600', 'whiteAlpha.900')

  return (
    <Link {...rest}>
      {cloneElement(children, {
        color: isActive ? "green.400" : color,
      })}
    </Link>
  );
}
