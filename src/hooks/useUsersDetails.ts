import { useQuery, UseQueryOptions, UseQueryResult } from "react-query";
import { api } from "../services/apiClient";

type UserDetailsProps = {
  id: string;
  name: string;
  email: string;
  username: string;
  role: string;
  active: boolean;
  phone: string;
  first_access: boolean;
  description: string;
  created_at: Date;
  permissions: [
    {
      id: string;
      name: string;
      description: string;
    }
  ];
};

type UserDetailsResponse = {
  user: UserDetailsProps;
};

export async function getUser(userId: string): Promise<UserDetailsResponse> {
  const response = await api.get(`/users/${userId}`);

  const { data } = response;

  return {
    user: data,
  };
}

export function useUserDetails(userId: string, options?: UseQueryOptions) {
  return useQuery(["users", [userId]], () => getUser(userId), {
    staleTime: 5,
    ...options,
  }) as UseQueryResult<UserDetailsResponse, unknown>;
}
