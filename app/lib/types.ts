export interface User {
    id: string;
    email: string;
    password:string,
    role: 'user' | 'admin';
    first_name: string;
    last_name: string;
  }
  
  export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    category_id: string;
    image_url: string;
  }
  
  export interface CartItem {
    id: string;
    user_id: string;
    product_id: string;
    quantity: number;
  }
  
  export interface WishlistItem {
    id: string;
    user_id: string;
    product_id: string;
  }