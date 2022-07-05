import { AxiosError } from "axios";
import Router from "next/router";
import { destroyCookie, parseCookies, setCookie } from "nookies";
import { createContext, ReactNode, useEffect, useState } from "react";
import { api } from "../services/apiClient";

type permissionsUser = {
  id: string;
  name: string;
};

type User = {
  name: string;
  username: String;
  email: string;
  role: string;
  permissions: permissionsUser[];
};

type SignInCredentials = {
  email: string;
  password: string;
};

type AuthContextData = {
  signIn: (credentials: SignInCredentials) => Promise<void>;
  user: User;
  isAuthenticated: boolean;
};

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthContext = createContext({} as AuthContextData);

export function signOut() {
  destroyCookie(undefined, "@marche_access_token");
  // destroyCookie(undefined, "@next.refreshToken");
  Router.push("/");
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState({} as User);

  const isAuthenticated = !!user;

  function getMe() {
    api
      .get("/me")
      .then(({ data }) => {
        setUser({ ...data });
      })
      .catch(() => {
        signOut();
      });
  }

  useEffect(() => {
    const { "@marche_access_token": accessToken } = parseCookies();

    if (accessToken) {
      getMe();
    }
  }, []);

  async function signIn({ email, password }: SignInCredentials) {
    try {
      const { data } = await api.post("/login", {
        email,
        password,
      });

      const { accessToken, refreshToken } = data;

      setCookie(undefined, "@marche_access_token", accessToken, {
        path: "/",
        maxAge: 60 * 60 * 24 * 30, // 30 days
      });

      // setCookie(undefined, "@next.refreshToken", refreshToken?.id, {
      //   path: "/",
      //   maxAge: 60 * 60 * 24 * 30, // 30 days
      // });

      api.defaults.headers["Authorization"] = `Bearer ${accessToken}`;

      getMe();

      Router.push("/dashboard");
    } catch (error) {
      return error.response.status
    }
  }

  return (
    <AuthContext.Provider value={{ signIn, isAuthenticated, user }}>
      {children}
    </AuthContext.Provider>
  );
}
