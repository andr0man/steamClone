import api from "./api";

export const login = async (data) => {
  const response = await api.post("/account/signin", data);
  return response.data;
};

export const register = async (data) => {
  const response = await api.post("/account/signup", data);
  return response.data;
};