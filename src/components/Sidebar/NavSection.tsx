import { Box, Text, Stack, useColorModeValue } from "@chakra-ui/react";
import { ReactNode } from "react";

interface NavSectionProps {
  title: string;
  children: ReactNode;
}

export function NavSection({ title, children }: NavSectionProps) {
  const color = useColorModeValue('gray.500', 'whiteAlpha.700')
  return (
    <Box>
      <Text fontWeight="bold" color={color} fontSize="small">
        {title}
      </Text>
      <Stack spacing={4} mt="8" align="stretch">
        {children}
      </Stack>
    </Box>
  );
}
