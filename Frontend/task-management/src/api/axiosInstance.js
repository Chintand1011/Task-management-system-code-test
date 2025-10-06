import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "https://localhost:44331/api",
  headers: { "Content-Type": "application/json" },
});

// optional: handle 401 -> auto logout logic (will be integrated with AuthContext)
instance.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      // emit a custom event — AuthContext can listen (or you can directly import useAuth wrapper)
      window.dispatchEvent(new Event("logout"));
    }
    return Promise.reject(err);
  }
);

export default instance;
