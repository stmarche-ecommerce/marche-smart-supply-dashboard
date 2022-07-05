import { useQuery } from "react-query";
import { api } from "../services/apiClient";
import { UserTypes } from "../types/UserTypes";

type GetUsersReturnProps = {
  users: UserTypes[];
  countOfRegisters: number;
};

async function getUsers(
  currentPage: number,
  searchQuery?: string
): Promise<GetUsersReturnProps> {
  const { data, headers } = await api.get("/users", {
    params: {
      page: currentPage,
      search: searchQuery,
    },
  });
  const countOfRegisters = Number(headers["x-total-count"]);

  const users = data.map((user) => {
    return {
      id: user.id,
      name: user.name,
      username: user.username,
      active: user.active,
      email: user.email,
      role: user.role.toLowerCase(),
      description: user.description,
      created_at: new Date(user.created_at).toLocaleString("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }),
    };
  });

  return { users, countOfRegisters };
}

export function useUsers(currentPage: number, searchQuery?: string) {
  return useQuery(
    ["users", currentPage, searchQuery],
    () => getUsers(currentPage, searchQuery),
    {
      staleTime: 1000 * 60 * 10, // 10 minutes
    }
  );
}
