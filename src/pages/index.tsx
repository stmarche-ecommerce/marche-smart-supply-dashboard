import {
  Button,
  Flex,
  Text,
  Stack,
  useColorModeValue,
} from "@chakra-ui/react";
import { useContext } from "react";
import { useForm } from "react-hook-form";
import { Input } from "../components/Form/Input";
import { AuthContext } from "../contexts/AuthContext";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useToast } from "@chakra-ui/react";
import Head from "next/head";
import Link from "next/link";
import { withSSRGuest } from "../util/withSSRGuest";

export default function Login() {
  const { signIn } = useContext(AuthContext);
  const toast = useToast();

  const signInFormSchema = yup
    .object({
      email: yup
        .string()
        .email("E-mail inválido")
        .required("E-mail obrigatório"),
      password: yup.string().required("Senha obrigatória"),
    })
    .required();

  const { register, handleSubmit, formState } = useForm({
    resolver: yupResolver(signInFormSchema),
  });

  const onSubmit = async (data) => {
    const statusCode = await signIn(data);
    console.log('==>', statusCode);
    
    if (Number(statusCode) === 403) {
      return toast({
        title: "Sua conta foi desativada.",
        description: "",
        status: "info",
        duration: 2000,
        isClosable: true,
        position: "top-end",
      });
    }

    if (statusCode !== undefined) {
      return toast({
        title: "Usuário ou senha inválida.",
        description: "",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top-end",
      });
    }

  };

  const bg = useColorModeValue("#f7fafc", "gray.900");
  const color = useColorModeValue("gray.600", "gray.100");
  const borderColor = useColorModeValue("gray.100", "gray.700");

  return (
    <Flex
      w="100vw"
      h="100vh"
      alignItems="center"
      justifyContent="center"
      flexDirection={["column", "row"]}
      bg={bg}
    >
      <Head>
        <title>Entrar | Supply</title>
      </Head>

      <Stack align={["center", "normal"]} px={[10]} spacing={["8"]} mr={[0, 0, 0, 100]}>
        <img src="images/logo.png" width={150}/>
        <Text
          color={color}
          letterSpacing="tight"
          lineHeight="normal"
          fontSize={["2xl", "3xl", "5xl"]}
          mb="8"
          ml="8"
          fontWeight="extrabold"
          maxW={430}
        >
          Faça login para acessar o sistema
        </Text>
      </Stack>
      <Flex
        as="form"
        width="100%"
        maxWidth={400}
        p="8"
        borderRadius="8"
        flexDir="column"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Stack spacing="4">
          <Input
            name="email"
            label="E-mail"
            type="text"
            variant="outline"
            backgroundColor={bg}
            fontSize="1xl"
            borderWidth="2px !important"
            borderColor={borderColor}
            fontWeight="light"
            _hover={{
              bgColor: bg,
            }}
            error={formState.errors.email}
            {...register("email")}
          />
          <Input
            name="password"
            label="Senha"
            type="password"
            variant="outline"
            backgroundColor={bg}
            fontSize="1xl"
            borderWidth="2px !important"
            borderColor={borderColor}
            fontWeight="light"
            _hover={{
              bgColor: bg,
            }}
            error={formState.errors.password}
            {...register("password")}
          />
        </Stack>

        <Button
          size="lg"
          type="submit"
          mt="6"
          colorScheme="green"
          bg="green.500"
          color="white"
          _hover={{ bg: "green.600" }}
          isLoading={formState.isSubmitting}
        >
          Entrar
        </Button>
        <Link href="/forgot-password" passHref>
          <Text
            _hover={{ textDecoration: "underline" }}
            as="a"
            alignSelf="center"
            mt="4"
            color="gray.500"
          >
            Esqueci minha senha
          </Text>
        </Link>
      </Flex>
    </Flex>
  );
}

export const getServerSideProps = withSSRGuest(async ctx => {
  return {
    props: {}
  };
});