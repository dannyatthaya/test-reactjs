import axios, { parseData, qs } from "@/apis/axios";

export default {
  index(data = {}) {
    let ep = "/api/orders";
    let url = qs(ep, data);
    return axios.get(url);
  },
  show(id: number) {
    let ep = `/api/orders/${id}`;
    return axios.get(ep);
  },
  store(data: Object) {
    return axios.post("/api/orders", parseData(data));
  },
  update(id: number, data: App.Model.Customer) {
    let ep = `/api/orders/${id}`;
    return axios.put(ep, parseData(data));
  },
  destroy(id: number) {
    let ep = `/api/orders/${id}`;
    return axios.delete(ep);
  },
}