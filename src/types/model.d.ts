declare namespace App.Model {
  export interface Customer {
    id: number;
    name: string;
    displayName: string;
    location: string;
    gender: string;
    address: string;
    createdAt: string;
    updatedAt: string;
  }

  export interface Product {
    id: number;
    name: string;
    displayName: string;
    category: string;
    price: number;
    color: string;
    orders?: Order[];
    createdAt: string;
    updatedAt: string;
  }

  export interface Order {
    id: number;
    name: string;
    customer: Customer;
    products: Product[];
    subtotal?: number;
    createdAt: string;
    updatedAt: string;
  }

  export interface OrderProduct {
    id: number;
    order: Order;
    product: Product;
    quantity: number;
    createdAt: string;
    updatedAt: string;
  }
}