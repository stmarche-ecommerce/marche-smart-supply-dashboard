import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  forwardRef,
  Input as ChakraInput,
  InputProps as ChakraInputProps,
  useColorModeValue,
} from "@chakra-ui/react";
import { ForwardRefRenderFunction } from "react";
import { FieldError } from "react-hook-form";

interface InputProps extends ChakraInputProps {
  name: string;
  label?: string;
  error?: FieldError;
}

const InputBase: ForwardRefRenderFunction<HTMLInputElement, InputProps> = (
  { name, label, error, ...rest }: InputProps,
  ref
) => {
  const color = useColorModeValue('gray.700', 'white')
  const bgInput = useColorModeValue('white', 'gray.800')

  return (
    <FormControl isInvalid={!!error}>
      {!!label && <FormLabel mb="0.5" htmlFor={name} color={color}>{label}</FormLabel>}
      <ChakraInput
        name={name}
        id={name}
        focusBorderColor="green.500"
        bgColor={bgInput}
        variant="filled"
        borderColor="gray.500"
        _hover={{ bgColor: bgInput }}
        _focus={{  borderWidth: "initial", borderColor: "green.500"}}
        size="lg"
        fontSize={15}
        ref={ref}
        {...rest}
      ></ChakraInput>
      {error && <FormErrorMessage>{error.message}</FormErrorMessage>}
    </FormControl>
  );
};

export const Input = forwardRef(InputBase);
