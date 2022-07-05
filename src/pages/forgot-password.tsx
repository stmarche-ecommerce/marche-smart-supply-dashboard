import {
  Button,
  Flex,
  Stack,
  Text,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Input } from "../components/Form/Input";
import { api } from "../services/apiClient";
import * as yup from "yup";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

export default function ForgotPassword() {
  const bg = useColorModeValue("#f7fafc", "gray.900");
  const color = useColorModeValue("gray.600", "white");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const toast = useToast();
  const router = useRouter();

  const sendForgotPasswordSchema = yup.object({
    email: yup.string().email("E-mail inválido").required("E-mail obrigatório"),
  });

  const { register, handleSubmit, formState } = useForm({
    resolver: yupResolver(sendForgotPasswordSchema),
  });

  const onSubmit: SubmitHandler<unknown> = async ({ email }) => {
    try {
      await api.post("/password/forgot", { email });

      toast({
        title: "Quase lá, dê uma checada em seu e-mail :)",
        description: "",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top-end",
      });

      router.push("/");
    } catch (error) {
      const errorMessage =
        error.response.status === 404
          ? "Usuário não encontrado."
          : "Ocorreu um erro ao tentar recuperar senha.";
      toast({
        title: errorMessage,
        description: "",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-end",
      });
    }
  };
  return (
    <Flex
      as="form"
      onSubmit={handleSubmit(onSubmit)}
      flexDir="column"
      alignItems="center"
      justifyContent="center"
      width="100vw"
      height="100vh"
      bg={bg}
    >
      <Stack spacing="4">
        <Text
          color={color}
          mb="4"
          fontSize="xl"
          textAlign="center"
          fontWeight="bold"
          as="h1"
        >
          Recuperar senha
        </Text>
        <Input
          name="email"
          type="text"
          variant="outline"
          placeholder="Digite seu e-mail"
          fontSize="1xl"
          borderWidth="1px !important"
          borderColor={borderColor}
          fontWeight="light"
          width="xs"
          error={formState.errors.email}
          {...register("email")}
        />

        <Button
          size="sm"
          py="6"
          type="submit"
          mt="6"
          colorScheme="green"
          bg="green.500"
          color="white"
          _hover={{ bg: "green.600" }}
          isLoading={formState.isSubmitting}
        >
          RECUPERAR
        </Button>

        <Link href="/" passHref>
          <Text
            _hover={{ textDecoration: "underline" }}
            as="a"
            alignSelf="center"
            mt="4"
            color="gray.500"
            fontSize="sm"
          >
            Voltar
          </Text>
        </Link>
      </Stack>
    </Flex>
  );
}
