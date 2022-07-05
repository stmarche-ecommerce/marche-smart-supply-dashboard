export type EditUserTypes = {
  name: string;
  username: string;
  active: boolean;
  email: string;
  role: string;
  permissions: Array<{
    value: string;
  }>;
  phone: string;
  description?: string;
};
