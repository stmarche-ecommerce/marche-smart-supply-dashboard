import { ChakraProvider } from "@chakra-ui/react";
import { AppProps } from "next/app";
import { AuthProvider } from "../contexts/AuthContext";
import { SideBarDrawerProvider } from "../contexts/SideBarDrawerContext";
import { theme } from "../styles/theme";
import React from "react";

import { QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from 'react-query/devtools'
import { queryClient } from '../services/queryClient';

if (typeof document === 'undefined') {
  React.useLayoutEffect = React.useEffect;
}

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools initialIsOpen={false} />
        <ChakraProvider theme={theme}>
          <SideBarDrawerProvider>
            <Component {...pageProps} />
          </SideBarDrawerProvider>
        </ChakraProvider>
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default MyApp;
