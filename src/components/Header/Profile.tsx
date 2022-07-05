import { Flex, Text, Box, Avatar } from "@chakra-ui/react";
import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";

interface ProfileProps {
  showProfileData?: boolean;
}

export function Profile({ showProfileData = true }: ProfileProps) {
  const { user } = useContext(AuthContext)
  
  return (
    <Flex align="center" pr={[2, 4]}>
      {showProfileData && (
        <Box mr={4} textAlign="right">
          <Text>{user.name}</Text>
          <Text color="gray.300" fontSize="small">
            {user.email}
          </Text>
        </Box>
      )}

      <Avatar size={showProfileData ? "md" : "sm"} name={user.name}></Avatar>
    </Flex>
  );
}
