import {
  Box,
  Flex,
  Heading,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  useToast,
  useColorModeValue,
  VStack,
  SimpleGrid,
  useBreakpointValue,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  useDisclosure,
} from "@chakra-ui/react";
import { Header } from "../../components/Header";
import { Sidebar } from "../../components/Sidebar";

import Head from "next/head";
import { AiOutlineArrowLeft, AiOutlineDelete } from "react-icons/ai";
import Link from "next/link";
import { setupApi } from "../../services/api";
import { withSSRAuth } from "../../util/withSSRAuth";
import { useUserDetails } from "../../hooks/useUsersDetails";
import { useMutation } from "react-query";
import { api } from "../../services/apiClient";
import { queryClient } from "../../services/queryClient";
import { AxiosError } from "axios";
import { useRouter } from "next/router";

export default function UserDetails({ user }) {
  const bg = useColorModeValue("white", "gray.900");
  const color = useColorModeValue("gray.500", "gray.100");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const router = useRouter();

  const { data } = useUserDetails(user.id, {
    initialData: {
      user,
    },
  });

  const isWideVersion = useBreakpointValue({
    base: false,
    lg: true,
  });

  async function onDeleteUser(id: string) {
    try {
      await deleteUser.mutateAsync(id);
    } catch (error) {
      console.log("Error happened");
    }
  }

  const deleteUser = useMutation(
    async (id: string) => {
      const { data } = await api.delete(`/users/${id}`);
      return data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("users");

        toast({
          title: "Usuário deletado com sucesso.",
          status: "success",
          position: "top",
          duration: 3000,
        });

        router.push("/users");
      },
      onError: (error: AxiosError) => {
        toast({
          title: "Ocorreu um erro ao deletar usuário :(",
          description: "",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
      },
    }
  );

  return (
    <Box>
      <Head>
        <title>Detalhes do usuário | Supply</title>
      </Head>

      <Header />

      <Flex w="95%" my="6" maxWidth={1480} mx="auto" px={["0", "2", "6"]}>
        <Sidebar />
        <Box
          flex="1"
          borderRadius={8}
          bg={bg}
          p={["6", "8", "10"]}
          shadow="0 0 20px rgba(0, 0, 0, 0.05)"
        >
          <Modal isCentered isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader color={color}>
                Deseja realmente excluir esse usuário?
              </ModalHeader>
              <ModalFooter>
                <Button colorScheme="gray" mr={3} onClick={onClose}>
                  Cancelar
                </Button>
                <Button
                  colorScheme="red"
                  onClick={() => onDeleteUser(data.user.id)}
                >
                  Excluir
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>

          <Flex
            mb="8"
            mt="2"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Heading size="lg" fontWeight="medium">
                <Link href="/users" passHref>
                  <Button
                    transform="translateX(-10px)"
                    mb="2"
                    ml="2"
                    mr={["2", "4", "8"]}
                    p="2"
                    as="a"
                    color="gray"
                    variant="outline"
                  >
                    <AiOutlineArrowLeft size="20" />
                  </Button>
                </Link>
                <Text display="inline-block">Detalhes do usuário</Text>
              </Heading>
            </Box>

            {isWideVersion && (
              <Button
                size="sm"
                colorScheme="red"
                backgroundColor="red.400"
                color="white"
                leftIcon={<AiOutlineDelete />}
                mr="8"
                onClick={onOpen}
              >
                Excluir
              </Button>
            )}
          </Flex>

          <VStack spacing="4">
            <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
              <Box>
                <Heading size="md" color={color} fontWeight="bold">
                  Nome
                </Heading>
                <Text mt="2">{data?.user?.name}</Text>
              </Box>
              <Box>
                <Heading size="md" color={color} fontWeight="bold">
                  Email
                </Heading>
                <Text mt="2">{data?.user?.email}</Text>
              </Box>
            </SimpleGrid>
          </VStack>

          <VStack spacing="4">
            <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
              <Box>
                <Heading mt="4" color={color} size="md" fontWeight="bold">
                  Grupo
                </Heading>
                <Text mt="2">
                  {data?.user?.role === "ADMIN" ? "Administração" : "Usuário"}
                </Text>
              </Box>
              <Box>
                <Heading mt="4" color={color} size="md" fontWeight="bold">
                  Ativo
                </Heading>
                <Text mt="2">{data?.user?.active ? "Sim" : "Não"}</Text>
              </Box>
            </SimpleGrid>
          </VStack>

          <VStack spacing="4">
            <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
              <Box>
                <Heading mt="4" color={color} size="md" fontWeight="bold">
                  Username
                </Heading>
                <Text mt="2">{data?.user?.username}</Text>
              </Box>
              <Box>
                <Heading mt="4" color={color} size="md" fontWeight="bold">
                  Primeiro acesso
                </Heading>
                <Text mt="2">{data?.user?.first_access ? "Sim" : "Não"}</Text>
              </Box>
            </SimpleGrid>
          </VStack>

          <VStack spacing="4">
            <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
              <Box>
                <Heading mt="4" color={color} size="md" fontWeight="bold">
                  Descrição
                </Heading>
                <Text mt="2">
                  {data?.user?.description ? data?.user?.description : "..."}
                </Text>
              </Box>
              <Box>
                <Heading mt="4" color={color} size="md" fontWeight="bold">
                  Data de cadastro
                </Heading>
                <Text mt="2">
                  {new Date(data?.user?.created_at).toLocaleString("pt-BR", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </Text>
              </Box>
            </SimpleGrid>
          </VStack>

          <Heading mt="4" color={color} size="md" fontWeight="bold">
            Permissões
          </Heading>

          {data?.user?.permissions.length > 0 ? (
            <Table mt="4">
              <Thead>
                <Tr>
                  <Th>Nome da permissão</Th>
                  <Th>Descrição</Th>
                </Tr>
              </Thead>
              <Tbody>
                {data?.user?.permissions.map((permission) => (
                  <Tr key={permission?.id}>
                    <Td>{permission?.name}</Td>
                    <Td color="gray.500">{permission?.description}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          ) : (
            <Text mt="2">Usuário sem permissão</Text>
          )}

          {!isWideVersion && (
            <Button
              size="sm"
              colorScheme="red"
              backgroundColor="red.400"
              color="white"
              leftIcon={<AiOutlineDelete />}
              mt="8"
              onClick={onOpen}
            >
              Excluir usuário
            </Button>
          )}
        </Box>
      </Flex>
    </Box>
  );
}

export const getServerSideProps = withSSRAuth(async (ctx) => {
  const { id } = ctx.params;

  const api = setupApi(ctx);

  const { data } = await api.get(`/users/${id}`);

  if (!data) {
    return {
      redirect: {
        destination: "/users",
        permanent: false,
      },
    };
  }

  return {
    props: {
      user: data,
    },
  };
});
