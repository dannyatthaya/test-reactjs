import axios, { parseData, qs } from "@/apis/axios";

export default {
  index(data = {}) {
    let ep = "/api/products";
    let url = qs(ep, data);
    return axios.get(url);
  },
  show(id: number) {
    let ep = `/api/products/${id}`;
    return axios.get(ep);
  },
  store(data: Object) {
    return axios.post("/api/products", parseData(data));
  },
  update(id: number, data: App.Model.Customer) {
    let ep = `/api/products/${id}`;
    return axios.put(ep, parseData(data));
  },
  destroy(id: number) {
    let ep = `/api/products/${id}`;
    return axios.delete(ep);
  },
}