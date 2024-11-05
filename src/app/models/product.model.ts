export interface Product {
  id: number;
  code: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: {
    id: number;
  };
  supplier: {
    id: number;
  };
}

export const emptyProduct = {
  id: 0,
  code: '',
  name: '',
  description: '',
  price: 0,
  stock: 0,
  category: {
    id: 0,
  },
  supplier: {
    id: 0,
  },
};
