export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface AddCartItemInput extends Omit<CartItem, "quantity"> {
  quantity?: number;
}
