import { Box, Stack, Text, useColorModeValue } from "@chakra-ui/react";
import { PaginationTypes } from "../../types/PaginationTypes";
import { PaginationItem } from "./PaginationItem";

const siblingsCount = 1;

function generatePagesArray(from: number, to: number) {
  return [...new Array(to - from)]
    .map((_, index) => {
      return from + index + 1;
    })
    .filter((page) => page > 0);
}

export function Pagination({
  onPageChange,
  totalCountOfRegisters,
  currentPage = 1,
  registersPerPage = 10,
}: PaginationTypes) {
  const lastPage = Math.ceil(totalCountOfRegisters / registersPerPage);

  const previousPages =
    currentPage > 1
      ? generatePagesArray(currentPage - 1 - siblingsCount, currentPage - 1)
      : [];

  const nextPages =
    currentPage < lastPage
      ? generatePagesArray(
          currentPage,
          Math.min(currentPage + siblingsCount, lastPage)
        )
      : [];

  const color = useColorModeValue("gray.500", "gray.50");
  return (
    <Stack
      direction={["column", "row"]}
      mt="8"
      justifyContent="space-between"
      align="center"
      spacing="8"
    >
      <Box color={color}>
        <strong>{(currentPage - 1) * registersPerPage + 1}</strong> -{" "}
        <strong>{currentPage * registersPerPage}</strong> de{" "}
        <strong>{totalCountOfRegisters}</strong>
      </Box>
      <Stack spacing="2" direction="row">
        {currentPage > 1 + siblingsCount && (
          <>
            <PaginationItem onPageChange={onPageChange} number={1} />
            {currentPage > 2 + siblingsCount && (
              <Text
                color={color}
                width="8"
                textAlign="center"
                transform="translateY(8px)"
                fontWeight="bold"
              >
                ...
              </Text>
            )}
          </>
        )}

        {previousPages.length > 0 &&
          previousPages.map((page) => {
            return (
              <PaginationItem
                onPageChange={onPageChange}
                key={page}
                number={page}
              />
            );
          })}

        <PaginationItem
          number={currentPage}
          onPageChange={onPageChange}
          isCurrent
        />

        {nextPages.length > 0 &&
          nextPages.map((page) => {
            return (
              <PaginationItem
                onPageChange={onPageChange}
                key={page}
                number={page}
              />
            );
          })}

        {currentPage + siblingsCount < lastPage && (
          <>
            {currentPage + 1 + siblingsCount < lastPage && (
              <Text
                color={color}
                width="8"
                textAlign="center"
                transform="translateY(8px)"
                fontWeight="bold"
              >
                ...
              </Text>
            )}
            <PaginationItem onPageChange={onPageChange} number={lastPage} />
          </>
        )}
      </Stack>
    </Stack>
  );
}
