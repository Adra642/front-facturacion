export interface Supplier {
  id: number;
  ruc: string;
  name: string;
  email: string;
  address: string;
  phone: string;
}

export const emptySupplier = {
  id: 0,
  ruc: '',
  name: '',
  email: '',
  address: '',
  phone: '',
};
