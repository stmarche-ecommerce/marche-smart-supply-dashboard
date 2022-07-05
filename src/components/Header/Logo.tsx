import { Text } from "@chakra-ui/react";
import Image from "next/image";
import logoImg from "../../../public/images/logo.png";

export function Logo() {
  return (
    <Text
      fontSize={["md", "2xl", "3xl"]}
      fontWeight="bold"
      letterSpacing="tight"
      mt="4"
      ml="6"
      align="center"
    >
      <Image src={logoImg} width={100} height={40} />
    </Text>
  );
}
