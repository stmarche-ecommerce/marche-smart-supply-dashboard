import {
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  SimpleGrid,
  useColorModeValue,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { Select } from "chakra-react-select";
import { Input } from "../../components/Form/Input";
import { Header } from "../../components/Header";
import { Sidebar } from "../../components/Sidebar";
import Link from "next/link";
import { useCan } from "../../hooks/useCan";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { SubmitHandler, useForm } from "react-hook-form";
import { CreateUserTypes } from "../../types/CreateUserTypes";
import { api } from "../../services/apiClient";
import { useRouter } from "next/router";
import { useMutation } from "react-query";
import { queryClient } from "../../services/queryClient";
import { AxiosError } from "axios";
import Head from "next/head";
import { useEffect, useState } from "react";

export default function CreateUser() {
  const userCanCreateUsers = useCan({
    permissions: ["create_users"],
  });

  const bg = useColorModeValue("white", "gray.900");
  const color = useColorModeValue("gray.500", "gray.50");

  const toast = useToast();
  const router = useRouter();

  const [roleName, setRoleName] = useState("USER");
  const [permissions, setPermissions] = useState([]);
  const [selectedPermissions, setSelectedPermissions] = useState(null);

  useEffect(() => {
    async function listRolesAndPermissions() {
      const { data } = await api.get("/permissions");

      setPermissions(data);
    }

    listRolesAndPermissions();
  }, []);

  const createUserFormSchema = yup
    .object({
      name: yup.string().required("Nome obrigatório"),
      email: yup
        .string()
        .email("E-mail inválido")
        .required("E-mail obrigatório"),
      username: yup.string().required("Usuário obrigatório"),
      password: yup
        .string()
        .required("Senha obrigatória")
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{4,})/,
          "A senha deve ter no mínimo 4 caracteres, ter 1 caractere especial e uma letra em maiúsculo"
        ),
      password_confirmation: yup
        .string()
        .required("Confirmação de senha é obrigatória")
        .oneOf([yup.ref("password"), null], "As senhas precisam ser iguais"),
    })
    .required();

  const { register, handleSubmit, formState } = useForm({
    resolver: yupResolver(createUserFormSchema),
  });

  const onSubmit: SubmitHandler<CreateUserTypes> = async (values) => {
    try {
      await createUser.mutateAsync(values);
    } catch (error) {
      console.log("Error happened");
    }
  };

  const createUser = useMutation(
    async ({ name, email, username, password }: CreateUserTypes) => {
      const { data } = await api.post("/users", {
        name,
        email,
        username,
        password,
        role: roleName,
      });

      if (selectedPermissions?.length > 0 && roleName === "USER") {
        await api.post(
          `permissions/assign/${data.id}`,
          selectedPermissions.map((permission) => ({permissionId: permission.value}))
        );
        console.log(selectedPermissions.map((permission) => ({permissionId: permission.value})));
        
      }

      return data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("users");

        toast({
          title: "Usuário criado com sucesso.",
          status: "success",
          position: "top",
          duration: 3000,
        });

        router.push("/users");
      },
      onError: (error: AxiosError) => {
        const errorMessage =
          error.response.status === 409
            ? "Esse usuário já foi cadastrado."
            : "Ocorreu um erro ao criar usuário :(";

        toast({
          title: errorMessage,
          description: "",
          status: error.response.status === 409 ? "warning" : "error",
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
        <title>Criar usuário | Supply</title>
      </Head>

      <Header />
      <Flex w="95%" my="6" maxWidth={1480} mx="auto" px={["0", "2", "6"]}>
        <Sidebar />
        <Box
          as="form"
          onSubmit={handleSubmit(onSubmit)}
          flex="1"
          borderRadius={8}
          bg={bg}
          p={["6", "8", "10"]}
          shadow="0 0 20px rgba(0, 0, 0, 0.05)"
        >
          <Heading size="lg" fontWeight="normal" color={color}>
            Criar usuário
          </Heading>

          <Divider my="6" borderColor={color} />
          <VStack spacing="4">
            <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
              <Input
                name="name"
                type="text"
                label="Nome completo"
                error={formState.errors.name}
                {...register("name")}
              />
            </SimpleGrid>
            <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
              <Input
                name="email"
                type="email"
                label="E-mail"
                error={formState.errors.email}
                {...register("email")}
              />
              <Input
                name="username"
                label="Usuário"
                error={formState.errors.username}
                {...register("username")}
              />
            </SimpleGrid>
            <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
              <Input
                name="password"
                type="password"
                label="Senha"
                error={formState.errors.password}
                {...register("password")}
              />
              <Input
                name="password_confirmation"
                type="password"
                label="Confirmação da senha"
                error={formState.errors.password_confirmation}
                {...register("password_confirmation")}
              />
            </SimpleGrid>

            <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
              <FormControl color="green.500">
                <FormLabel mb="0.5" htmlFor="role" color={color}>
                  Grupos
                </FormLabel>

                <Select
                  selectedOptionColor="green"
                  placeholderColor="whatsapp"
                  size="md"
                  placeholder="Usuário"
                  focusBorderColor="green.500"
                  onChange={(e) => setRoleName(e.value)}
                  options={[
                    {
                      label: "Usuário",
                      value: "USER",
                    },
                    {
                      label: "Administração",
                      value: "ADMIN",
                    },
                  ]}
                />
              </FormControl>

              <FormControl color="gray.800">
                <FormLabel mb="0.5" htmlFor="role" color={color}>
                  Permissões
                </FormLabel>
                <Select
                  size="md"
                  isMulti
                  placeholder="Selecione as permissões"
                  closeMenuOnSelect={false}
                  focusBorderColor="green.500"
                  isDisabled={roleName === "ADMIN"}
                  onChange={(e) => setSelectedPermissions(e)}
                  options={permissions.map((permission) => ({
                    label: permission.description,
                    value: permission.id,
                    colorScheme: "green",
                  }))}
                />
              </FormControl>
            </SimpleGrid>
          </VStack>

          <Flex mt="8" justify="flex-end">
            <HStack spacing="4">
              <Link href="/users" passHref>
                <Button
                  as="a"
                  colorScheme="gray"
                  color="white"
                  bgColor="gray.300"
                >
                  Cancelar
                </Button>
              </Link>
              <Button
                colorScheme="green"
                bgColor="green.500"
                disabled={!userCanCreateUsers}
                color="white"
                type="submit"
              >
                Salvar
              </Button>
            </HStack>
          </Flex>
        </Box>
      </Flex>
    </Box>
  );
}
