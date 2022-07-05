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
  Switch,
  useColorModeValue,
  useToast,
  VStack,
} from "@chakra-ui/react";
import * as yup from "yup";
import Link from "next/link";
import Head from "next/head";
import { AxiosError } from "axios";
import { useRouter } from "next/router";
import { useMutation } from "react-query";
import { useEffect, useState } from "react";
import { Select } from "chakra-react-select";
import { yupResolver } from "@hookform/resolvers/yup";
import { SubmitHandler, useForm } from "react-hook-form";

import { setupApi } from "../../../services/api";
import { Input } from "../../../components/Form/Input";
import { Header } from "../../../components/Header";
import { Sidebar } from "../../../components/Sidebar";
import { api } from "../../../services/apiClient";
import { useCan } from "../../../hooks/useCan";
import { queryClient } from "../../../services/queryClient";
import { withSSRAuth } from "../../../util/withSSRAuth";
import { useUserDetails } from "../../../hooks/useUsersDetails";
import { EditUserTypes } from "../../../types/EditUserTypes";

export default function CreateUser({ user }) {
  const userCanCreateUsers = useCan({
    permissions: ["edit_users"],
  });

  const bg = useColorModeValue("white", "gray.900");
  const color = useColorModeValue("gray.500", "gray.50");

  const toast = useToast();
  const router = useRouter();

  const [roleName, setRoleName] = useState("USER");
  const [permissions, setPermissions] = useState([]);
  const [selectedPermissions, setSelectedPermissions] = useState(null);
  const [userActive, setUserActive] = useState(true);

  const { data } = useUserDetails(user.id, {
    initialData: {
      user,
    },
  });

  useEffect(() => {
    setRoleName(data.user.role);
    setSelectedPermissions(data.user.permissions);
    setUserActive(data.user.active);

    async function listRolesAndPermissions() {
      const { data } = await api.get("/permissions");

      setPermissions(data);
    }

    listRolesAndPermissions();
  }, []);

  const editUserFormSchema = yup
    .object({
      name: yup.string().required("Nome obrigatório"),
      email: yup
        .string()
        .email("E-mail inválido")
        .required("E-mail obrigatório"),
      username: yup.string().required("Usuário obrigatório"),
      phone: yup.string(),
      description: yup.string(),
      role: yup.array(),
      permissions: yup.string(),
    })
    .required();

  const { register, handleSubmit, formState } = useForm({
    resolver: yupResolver(editUserFormSchema),
  });

  const onSubmit: SubmitHandler<EditUserTypes> = async (values) => {
    try {
      await editUser.mutateAsync({
        ...values,
        role: roleName,
        active: userActive,
        permissions: selectedPermissions,
      });
    } catch (error) {
      console.log("Error happened");
    }
  };

  const editUser = useMutation(
    async ({
      name,
      email,
      username,
      active,
      phone,
      role,
      permissions,
      description,
    }: EditUserTypes) => {
      const [userUpdatted, permissionsUpdated] = await Promise.all([
        api.patch(`/users/${data.user.id}`, {
          name,
          email,
          username,
          active,
          phone,
          role,
          description,
        }),
        api.post(
          `permissions/assign/${data.user.id}`,
          permissions
            .map((permission) => ({
              permissionId: permission.value,
            }))
            .filter((a) => a.permissionId)
        ),
      ]);

      if (
        typeof userUpdatted.data?.id &&
        typeof permissionsUpdated.data?.count
      ) {
        return userUpdatted.data;
      }

      throw new Error("Error hapenned");
    },
    {
      onSuccess: (data) => {
        console.log(data);

        queryClient.invalidateQueries(["users"]);

        toast({
          title: "Usuário editado com sucesso.",
          status: "success",
          position: "top",
          duration: 3000,
        });

        router.push("/users");
      },
      onError: (error: AxiosError) => {
        toast({
          title: "Ocorreu um erro ao editar usuário.",
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
        <title>Editar usuário | Supply</title>
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
            Editar usuário
          </Heading>

          <Divider my="6" borderColor={color} />
          <VStack spacing="4">
            <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
              <Input
                name="name"
                type="text"
                label="Nome completo"
                autoFocus={true}
                defaultValue={data.user.name}
                error={formState.errors.name}
                {...register("name")}
              />
            </SimpleGrid>
            <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
              <Input
                name="email"
                type="email"
                label="E-mail"
                defaultValue={data.user.email}
                error={formState.errors.email}
                {...register("email")}
              />
              <Input
                name="username"
                label="Usuário"
                defaultValue={data.user.username}
                error={formState.errors.username}
                {...register("username")}
              />
            </SimpleGrid>

            <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
              <Input
                name="phone"
                type="number"
                label="Telefone"
                defaultValue={data.user.phone}
                {...register("phone")}
              />
              <Input
                name="description"
                type="text"
                label="Descrição"
                defaultValue={data.user.description}
                {...register("description")}
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
                  defaultValue={{
                    label: data.user.role === "ADMIN" ? "Administração" : "Usuário",
                    value: data.user.role,
                  }}
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
                  defaultValue={data.user.permissions.map((permission) => ({
                    label: permission.description,
                    value: permission.id,
                  }))}
                  onChange={(e) => setSelectedPermissions(e)}
                  options={permissions.map((permission) => ({
                    label: permission.description,
                    value: permission.id,
                    colorScheme: "green",
                  }))}
                />
              </FormControl>
            </SimpleGrid>

            <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
              <FormControl pl="2" display="flex" alignItems="center">
                <FormLabel htmlFor="email-alerts" mb="0">
                  Ativo
                </FormLabel>
                <Switch
                  onChange={() => {
                    setUserActive(!userActive);
                  }}
                  colorScheme="green"
                  isChecked={userActive}
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
                // disabled={!userCanCreateUsers}
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
