import App from "@/pages/App";
import Page404 from "@/pages/Page404";
import Dashboard from "@/layouts/Dashboard";
import Blank from "@/layouts/Blank";
import { createBrowserRouter, } from "react-router-dom";
import { default as CustomerIndex } from "@/pages/customer/Index";
import { default as CustomerCreate } from "@/pages/customer/Create";
import { default as CustomerEdit } from "@/pages/customer/Edit";
import { default as CustomerRead } from "@/pages/customer/Read";
import { default as ProductIndex } from "@/pages/product/Index";
import { default as ProductCreate } from "@/pages/product/Create";
import { default as ProductEdit } from "@/pages/product/Edit";
import { default as ProductRead } from "@/pages/product/Read";
import { default as OrderIndex } from "@/pages/order/Index";
import { default as OrderCreate } from "@/pages/order/Create";
import { default as OrderEdit } from "@/pages/order/Edit";
import { default as OrderRead } from "@/pages/order/Read";
import Metric from "@/pages/Metric";

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <Page404 />,
  },
  {
    path: '/dashboard',
    element: <Dashboard />,
    errorElement: <Page404 />,
    children: [
      {
        path: 'metric',
        element: <Metric />,
      },
      {
        path: 'customer',
        element: <Blank />,
        children: [
          {
            path: '',
            element: <CustomerIndex />
          },
          {
            path: 'create',
            element: <CustomerCreate />
          },
          {
            path: ':id/edit',
            element: <CustomerEdit />
          },
          {
            path: ':id/read',
            element: <CustomerRead />
          },
        ],
      },
      {
        path: 'product',
        element: <Blank />,
        children: [
          {
            path: '',
            element: <ProductIndex />
          },
          {
            path: 'create',
            element: <ProductCreate />
          },
          {
            path: ':id/edit',
            element: <ProductEdit />
          },
          {
            path: ':id/read',
            element: <ProductRead />
          },
        ],
      },
      {
        path: 'order',
        element: <Blank />,
        children: [
          {
            path: '',
            element: <OrderIndex />
          },
          {
            path: 'create',
            element: <OrderCreate />
          },
          {
            path: ':id/edit',
            element: <OrderEdit />
          },
          {
            path: ':id/read',
            element: <OrderRead />
          },
        ],
      },
    ],
  },
]);