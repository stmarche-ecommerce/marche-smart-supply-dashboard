import {
  Box,
  Button,
  Flex,
  Heading,
  Icon,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Text,
  useBreakpointValue,
  IconButton,
  Spinner,
  Alert,
  AlertIcon,
  useColorModeValue,
} from "@chakra-ui/react";
import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import { FcCheckmark } from "react-icons/fc";
import { RiAddLine, RiPencilLine, RiSearch2Line } from "react-icons/ri";
import { IoClose, IoCloseOutline, IoEyeSharp } from "react-icons/io5";
import { Header } from "../../components/Header";
import { Pagination } from "../../components/Pagination";
import { Sidebar } from "../../components/Sidebar";
import { useUsers } from "../../hooks/useUsers";
import { AiOutlineClose, AiOutlineCloseCircle } from "react-icons/ai";
import { Input } from "../../components/Form/Input";
import { SubmitHandler, useForm } from "react-hook-form";
import { Can } from "../../components/Permissions/Can";

type SearchUserFormData = {
  search: string;
};

export default function ListUsers() {
  const isWideVersion = useBreakpointValue({
    base: false,
    lg: true,
  });

  const color = useColorModeValue("gray.600", "gray.100");
  const bg = useColorModeValue("white", "gray.900");

  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const { register, handleSubmit } = useForm();

  const { isLoading, error, data } = useUsers(currentPage, searchQuery);

  const handleSearchUsers: SubmitHandler<SearchUserFormData> = async ({
    search,
  }) => {
    setCurrentPage(1);
    setSearchQuery(search);
  };

  return (
    <Box>
      <Head>
        <title>Usuários | Supply</title>
      </Head>
      <Header />

      <Can permissions={["list_users"]}>
        <Flex w="95%" my="6" maxWidth={1480} mx="auto" px={["0", "2", "6"]}>
          <Sidebar />
          <Box
            flex="1"
            borderRadius={8}
            bg={bg}
            p={["6", "8"]}
            shadow="0 0 20px rgba(0, 0, 0, 0.05)"
          >
            <Flex mb="8" align="center" justifyContent="space-between">
              <Heading
                color={color}
                fontSize={["md", "md", "2xl"]}
                fontWeight="normal"
              >
                Usuários
              </Heading>

              <Flex alignItems="center">
                {isWideVersion && (
                  <Flex
                    as="form"
                    align="center"
                    onSubmit={handleSubmit(handleSearchUsers)}
                  >
                    <Input
                      name="search"
                      placeholder="Buscar usuários"
                      variant="flushed"
                      borderTop="none"
                      borderLeft="0"
                      borderRight="0"
                      br="8"
                      p="2"
                      backgroundColor={bg}
                      {...register("search")}
                    />

                    <Button
                      size="sm"
                      fontSize="sm"
                      colorScheme="gray"
                      ml="2"
                      mr="4"
                      type="submit"
                      disabled={isLoading}
                      isLoading={isLoading}
                    >
                      <Icon as={RiSearch2Line} fontSize="16" />
                    </Button>
                  </Flex>
                )}
                <Can permissions={["create_users"]}>
                  <Link href="users/create" passHref>
                    <Button
                      bg="green.400"
                      color="white"
                      colorScheme="green"
                      as="a"
                      size="sm"
                      ml="8"
                      leftIcon={<Icon as={RiAddLine} fontSize={[10, 20]} />}
                    >
                      Criar novo
                    </Button>
                  </Link>
                </Can>
              </Flex>
            </Flex>

            {isLoading ? (
              <Flex justify="center">
                <Spinner />
              </Flex>
            ) : error ? (
              <Alert status="warning" borderRadius={8} color={color} width="md">
                <AlertIcon />
                Falha ao buscar usuários
              </Alert>
            ) : (
              <>
                <Table colorScheme="gray">
                  <Thead>
                    <Tr>
                      <Th color={color}>Usuário</Th>
                      {isWideVersion && <Th color={color}>Grupo</Th>}
                      {isWideVersion && <Th color={color}>Ativo</Th>}
                      {isWideVersion && <Th color={color}>Data de cadastro</Th>}
                      <Th></Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {data.users.map((user) => {
                      return (
                        <Tr key={user.id}>
                          <Td>
                            <Text color={color} fontWeight="bold" as="a">
                              {user.name}
                            </Text>

                            <Text color={color} fontSize={["small", "sm"]}>
                              {user.email}
                            </Text>
                          </Td>

                          {isWideVersion && (
                            <Td color={color}>
                              {user.role === "user" ? "usuário" : "admin"}
                            </Td>
                          )}

                          {isWideVersion && (
                            <Td>
                              {user.active ? (
                                <FcCheckmark size="20" />
                              ) : (
                                <AiOutlineCloseCircle
                                  color="#ff564a"
                                  size="20"
                                />
                              )}
                            </Td>
                          )}
                          {isWideVersion && (
                            <Td color={color}>{user.created_at}</Td>
                          )}

                          <Td px="0">
                            {isWideVersion && (
                              <Link href={`/users/edit/${user.id}`} passHref>
                                <Button
                                  size="sm"
                                  backgroundColor="gray.400"
                                  colorScheme="gray"
                                  color="white"
                                  leftIcon={<RiPencilLine />}
                                  mr="4"
                                >
                                  Editar
                                </Button>
                              </Link>
                            )}

                            <Link href={`/users/${user.id}`} passHref>
                              {isWideVersion ? (
                                <Button
                                  size="sm"
                                  colorScheme="green"
                                  backgroundColor="green.400"
                                  color="white"
                                  leftIcon={<IoEyeSharp />}
                                >
                                  Detalhes
                                </Button>
                              ) : (
                                <IconButton
                                  aria-label="view"
                                  colorScheme="green"
                                  backgroundColor="green.400"
                                  color="white"
                                  icon={<Icon as={IoEyeSharp} />}
                                />
                              )}
                            </Link>
                          </Td>

                          <Td></Td>
                        </Tr>
                      );
                    })}
                  </Tbody>
                </Table>

                <Pagination
                  currentPage={currentPage}
                  totalCountOfRegisters={data.countOfRegisters}
                  onPageChange={setCurrentPage}
                />
              </>
            )}
          </Box>
        </Flex>
      </Can>
    </Box>
  );
}
