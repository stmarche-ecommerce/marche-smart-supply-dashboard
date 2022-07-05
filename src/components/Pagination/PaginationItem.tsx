import { Button } from "@chakra-ui/react";

interface PaginationItemProps {
  isCurrent?: boolean;
  number: number;
  onPageChange: (page: number) => void
}

export function PaginationItem({
  isCurrent = false,
  number,
  onPageChange,
}: PaginationItemProps) {
  if (isCurrent) {
    return (
      <Button
        size="sm"
        fontSize="xs"
        colorScheme="green"
        color="white"
        disabled
        _disabled={{
          bgColor: "green.500",
          cursor: "default",
        }}
      >
        {number}
      </Button>
    );
  }

  return (
    <Button
      bg="gray.700"
      size="sm"
      fontSize="xs"
      color="white"
      _hover={{
        bg: "green.500",
      }}
      onClick={() => onPageChange(number)}
    >
      {number}
    </Button>
  );
}
