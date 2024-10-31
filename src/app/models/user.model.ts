export interface User {
  id: number;
  name: string;
  surname: string;
  email: string;
  password: string;
  role: { id: Role };
  state: boolean;
}

export enum Role {
  Administrador = 1,
  Vendedor = 2,
}

export const emptyUser = {
  id: 0,
  name: '',
  surname: '',
  email: '',
  password: '',
  role: { id: Role.Vendedor },
  state: true,
};
