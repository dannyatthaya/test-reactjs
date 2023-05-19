import { GridRowId } from "@mui/x-data-grid";

declare namespace Axios {
  export interface Response<T> {
    message: string,
    status: number,
    error?: string,
    data?: T,
    links?: Object,
    meta?: Pagination,
  }

  export interface Pagination {
    currentPage: number,
    from: number,
    lastPage: number,
    links: {
      url: string | null,
      label: string | null,
      active: boolean,
    }[],
    path: string
    perPage: number,
    to: number,
    total: number,
  }

  export interface PaginationParams {
    page?: number,
  }

  export interface SearchParams {
    search?: string,
  }
}

declare namespace Axios.Service {
  export interface List {
    customer: Axios.Service.BasicCrud<App.Model.Customer>
    product: Axios.Service.BasicCrud<App.Model.Product>
    order: Axios.Service.BasicCrud<App.Model.Order>
  }

  export interface BasicCrud<T> {
    index: (params: Axios.PaginationParams | Axios.SearchParams) => Promise<Axios.Response<Array<T>>>,
    show: (id: string | number | GridRowId) => Promise<Axios.Response<T>>,
    store: (data: Object) => Promise<Axios.Response<null>>,
    update: (id: string | number | GridRowId, data: Object) => Promise<Axios.Response<null>>,
    destroy: (id: string | number | GridRowId) => Promise<Axios.Response<null>>,
  }
}