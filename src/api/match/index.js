// src/api/match/index.js
import fetchInstance from "../FetchInstance";
const wrap = (p) => p.then((data) => ({ data })); // axios처럼 { data } 모양

const api = {
  get: (endpoint, { params, headers } = {}) =>
    wrap(fetchInstance(endpoint, { method: "GET", params, headers })),
  post: (endpoint, body, { params, headers } = {}) =>
    wrap(fetchInstance(endpoint, { method: "POST", params, body, headers })),
  put: (endpoint, body, { params, headers } = {}) =>
    wrap(fetchInstance(endpoint, { method: "PUT", params, body, headers })),
  delete: (endpoint, { params, headers } = {}) =>
    wrap(fetchInstance(endpoint, { method: "DELETE", params, headers })),
};
export default api;
