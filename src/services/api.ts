import axios, { AxiosError } from "axios";
import { GetServerSidePropsContext } from "next";
import { parseCookies } from "nookies";
import { signOut } from "../contexts/AuthContext";

export const setupApi = (ctx: GetServerSidePropsContext = undefined) => {
  let cookies = parseCookies(ctx);
  const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API || "http://localhost:4000",
    headers: {
      Authorization: `Bearer ${cookies["@marche_access_token"]}`,
    },
  });

  api.interceptors.response.use(
    (response) => {
      return response;
    },
    (error: AxiosError) => {
      if (error.response?.status == 401) {
        if (typeof window) {
          signOut();
        }
      }

      return Promise.reject(error);
    }
  );

  return api;
};
