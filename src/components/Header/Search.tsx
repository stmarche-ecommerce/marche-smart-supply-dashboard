import { Flex, Icon, Input, useColorModeValue } from "@chakra-ui/react";
import { RiSearchLine } from "react-icons/ri";

export function Search() {
  const bg = useColorModeValue("gray.50", "gray.800");
  return (
    <Flex
      as="label"
      flex="1"
      py="4"
      px="8"
      ml={28}
      maxWidth={400}
      alignSelf="center"
      color="gray.200"
      position="relative"
      bg={bg}
      borderRadius="full"
    >
      <Input
        color="gray.50"
        variant="unstyled"
        placeholder="Buscar na plataforma"
        mr="4"
        px="4"
        _placeholder={{
          color: "gray.400",
        }}
      />
      <Icon as={RiSearchLine} fontSize={20}></Icon>
    </Flex>
  );
}
