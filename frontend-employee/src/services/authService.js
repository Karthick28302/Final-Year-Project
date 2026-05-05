import API from "./api";

export const loginEmployee = async (payload) => {
  const { data } = await API.post("/auth/login", payload);
  return data.data;
};

export const getCurrentEmployee = async () => {
  const { data } = await API.get("/auth/me");
  return data.data.user;
};
