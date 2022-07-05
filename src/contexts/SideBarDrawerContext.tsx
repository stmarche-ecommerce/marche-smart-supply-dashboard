import { useDisclosure, UseDisclosureReturn } from "@chakra-ui/react";
import { createContext, ReactNode, useContext, useEffect } from "react";
import { useRouter } from "next/router";

type SideBarDrawerProviderProps = {
  children: ReactNode;
};

type SideBarDrawerContext = UseDisclosureReturn;

const SideBarDrawerContext = createContext({} as SideBarDrawerContext);

export function SideBarDrawerProvider({
  children,
}: SideBarDrawerProviderProps) {
  const disClosure = useDisclosure();
  const router = useRouter();

  useEffect(() => {
    disClosure.onClose();
  }, [router.asPath]);

  return (
    <SideBarDrawerContext.Provider value={disClosure}>
      {children}
    </SideBarDrawerContext.Provider>
  );
}

export const useSideBarDrawer = () => useContext(SideBarDrawerContext);
