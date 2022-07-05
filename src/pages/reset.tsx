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
import { useEffect } from "react";

export default function ForgotPassword() {
  const bg = useColorModeValue("#f7fafc", "gray.900");
  const color = useColorModeValue("gray.600", "white");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const toast = useToast();
  const router = useRouter();
  let token;

  useEffect(() => {
    const params = router.query;
    token = params?.token
  });

  const sendForgotPasswordSchema = yup
    .object({
      password: yup
        .string()
        .required("Senha obrigatória")
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{4,})/,
          `Senha muito fraca`
        ),
      password_confirmation: yup
        .string()
        .required("Confirmação de senha é obrigatória")
        .oneOf([yup.ref("password"), null], "As senhas precisam ser iguais"),
    })
    .required();

  const { register, handleSubmit, formState } = useForm({
    resolver: yupResolver(sendForgotPasswordSchema),
  });

  const onSubmit: SubmitHandler<unknown> = async ({ password }) => {
    try {
      console.log(token);
      
      await api.post("/password/reset", { token, password });

      toast({
        title: "Sua senha foi atualizada com sucesso.",
        description: "",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top-end",
      });

      router.push("/");
    } catch (error) {
      const errorMessage =
        error.response.status === 410
          ? "Token de redefinição de senha inválido"
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
      flexDir="column"
      alignItems="center"
      justifyContent="center"
      width="100vw"
      height="100vh"
      bg={bg}
      onSubmit={handleSubmit(onSubmit)}
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
          Resetar senha
        </Text>
        <Input
          name="email"
          type="text"
          variant="outline"
          placeholder="Sua nova senha"
          fontSize="1xl"
          borderWidth="1px !important"
          borderColor={borderColor}
          fontWeight="light"
          width={["xs"]}
          error={formState.errors.password}
          {...register("password")}
        />

        <Input
          name="email"
          type="text"
          variant="outline"
          placeholder="Confirme sua senha"
          fontSize="1xl"
          borderWidth="1px !important"
          borderColor={borderColor}
          fontWeight="light"
          width={["xs"]}
          error={formState.errors.password_confirmation}
          {...register("password_confirmation")}
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
          ALTERAR SENHA
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
