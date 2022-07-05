import {
  Flex,
  Icon,
  HStack,
  useBreakpointValue,
  IconButton,
  Tooltip,
  forwardRef,
} from "@chakra-ui/react";
import { RiLogoutBoxLine, RiMenuLine } from "react-icons/ri";
import { signOut } from "../../contexts/AuthContext";
import { useSideBarDrawer } from "../../contexts/SideBarDrawerContext";
import { Logo } from "./Logo";
import { Profile } from "./Profile";
import { Search } from "./Search";
import { ToggleThemeButton } from "./ToggleThemeButton";

const TooltipIcon = forwardRef(({ children, ...rest }, ref) => (
  <span ref={ref}>
    <Icon {...rest} />
  </span>
));

export function Header() {
  const isWideVersion = useBreakpointValue({
    base: false,
    lg: true,
  });

  const { onOpen } = useSideBarDrawer();

  return (
    <Flex
      as="header"
      w="100%"
      h="20"
      maxWidth="1480"
      mx="auto"
      mt="4"
      px="6"
      align="center"
    >
      {!isWideVersion && (
        <IconButton
          aria-label="Open navigation"
          variant="unstyled"
          fontSize="24"
          alignContent="center"
          mr="2"
          icon={<Icon as={RiMenuLine} height="100%" />}
          onClick={onOpen}
          alignSelf="center"
          w="auto"
        ></IconButton>
      )}

      <Logo />

      {/* {isWideVersion && <Search />} */}


      <Flex alignItems="center" ml="auto">
      {isWideVersion && <ToggleThemeButton />}
        
        <HStack
          spacing={["6", "8"]}
          mx={["6", "8"]}
          pr={["6", "8"]}
          py={1}
          color="gray.300"
          borderRightWidth={1}
          borderColor="gray.700"
        >
          <Tooltip hasArrow label="Sair">
            <TooltipIcon
              onClick={() => signOut()}
              cursor="pointer"
              as={RiLogoutBoxLine}
              fontSize={25}
            />
          </Tooltip>
        </HStack>

        <Profile showProfileData={isWideVersion} />
      </Flex>
    </Flex>
  );
}
