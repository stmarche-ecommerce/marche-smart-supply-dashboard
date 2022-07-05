import {
  Box,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  useBreakpointValue,
  useColorModeValue,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { useSideBarDrawer } from "../../contexts/SideBarDrawerContext";
import { SideBarNav } from "./SideBarNav";
import useSound from "use-sound";
import menuOpenSound from '../../../public/sounds/menu-open.mp3'

export function Sidebar() {
  const isDrawerSideBar = useBreakpointValue({
    base: true,
    lg: false,
  });

  const { isOpen, onClose } = useSideBarDrawer();

  const bg = useColorModeValue("white", "gray.900");
  const [play] = useSound(menuOpenSound)
  useEffect(() => play(), [isOpen])

  if (isDrawerSideBar) {
    return (
      <Drawer placement="left" isOpen={isOpen} onClose={onClose}>
        <DrawerOverlay>
          <DrawerContent bg={bg} p="4">
            <DrawerCloseButton mt="6" />
            <DrawerHeader>Navegação</DrawerHeader>
            <DrawerBody>
              <SideBarNav />
            </DrawerBody>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>
    );
  }
  return (
    <Box as="aside" w="52">
      <SideBarNav />
    </Box>
  );
}
